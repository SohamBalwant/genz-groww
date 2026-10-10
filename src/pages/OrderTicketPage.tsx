import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { dataService } from '../services/dataService';
import { calculateCharges } from '../lib/fees/calculateCharges';
import { DEMO_FEE_CONFIG } from '../lib/fees/feeConfig';
import { ChargesBreakdown } from '../components/trade/ChargesBreakdown';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { formatINR } from '../lib/format';
import { ArrowLeft, ShieldAlert, ChevronRight } from 'lucide-react';
import type {
  Instrument,
  Ipo,
  OrderDraft,
  TradeProduct,
  TradeSide,
} from '../types';

export const OrderTicketPage: React.FC = () => {
  const { instrumentId } = useParams<{ instrumentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [loading, setLoading] = useState(true);
  const [instrument, setInstrument] = useState<Instrument | null>(null);

  // Parse Query Parameters
  const paramSide = (searchParams.get('side') as TradeSide) || 'BUY';
  const paramProduct = (searchParams.get('product') as TradeProduct) || 'DELIVERY';
  const paramStrike = searchParams.get('strike') ? Number(searchParams.get('strike')) : undefined;
  const paramExpiry = searchParams.get('expiry') || undefined;
  const paramType = (searchParams.get('type') as 'CE' | 'PE') || undefined;
  const paramPremium = searchParams.get('premium') ? Number(searchParams.get('premium')) : undefined;
  const paramLotSize = searchParams.get('lotSize') ? Number(searchParams.get('lotSize')) : undefined;

  // Form states
  const [side, setSide] = useState<TradeSide>(paramSide);
  const [product, setProduct] = useState<TradeProduct>(paramProduct);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number>(
    paramProduct === 'OPTION' && paramLotSize ? paramLotSize : 1
  );
  const [limitPrice, setLimitPrice] = useState<number>(0);
  const [showChargesDetail, setShowChargesDetail] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchInst = async () => {
      if (!instrumentId) return;
      setLoading(true);
      try {
        const item = await dataService.getInstrumentById(instrumentId);
        if (mounted && item) {
          setInstrument(item);
          // Set default price
          let initialPrice = 100;
          if ('price' in item && typeof item.price === 'number') {
            initialPrice = item.price;
          } else if ('nav' in item && typeof item.nav === 'number') {
            initialPrice = item.nav;
          } else if ('minInvestment' in item && typeof item.minInvestment === 'number') {
            initialPrice = item.minInvestment;
          } else if ('priceBand' in item && Array.isArray((item as Ipo).priceBand)) {
            initialPrice = (item as Ipo).priceBand[1];
          }

          if (paramPremium) initialPrice = paramPremium;
          setLimitPrice(initialPrice);
        }
      } catch (err) {
        console.error('Failed to load instrument for order:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInst();
    return () => {
      mounted = false;
    };
  }, [instrumentId, paramPremium]);

  // Current execution price
  const executionPrice = useMemo(() => {
    if (paramProduct === 'OPTION' && paramPremium) return paramPremium;
    if (!instrument) return 0;
    if (orderType === 'LIMIT' && limitPrice > 0) return limitPrice;
    if ('price' in instrument && typeof instrument.price === 'number') return instrument.price;
    if ('nav' in instrument && typeof instrument.nav === 'number') return instrument.nav;
    if ('minInvestment' in instrument && typeof instrument.minInvestment === 'number') return instrument.minInvestment;
    if ('priceBand' in instrument && Array.isArray((instrument as Ipo).priceBand)) {
      return (instrument as Ipo).priceBand[1];
    }
    return 100;
  }, [instrument, orderType, limitPrice, paramProduct, paramPremium]);

  // Total order value
  const orderValue = useMemo(() => {
    return executionPrice * quantity;
  }, [executionPrice, quantity]);

  // Fee calculation via pure engine
  const chargesResult = useMemo(() => {
    if (!instrument || orderValue <= 0) return null;
    return calculateCharges(
      {
        assetClass: instrument.assetClass,
        product: product,
        side: side,
        price: executionPrice,
        quantity: quantity,
        exchange: 'NSE',
        premiumBased: product === 'OPTION',
      },
      DEMO_FEE_CONFIG
    );
  }, [instrument, product, side, executionPrice, quantity, orderValue]);

  const handleReviewOrder = () => {
    if (!instrument || !chargesResult) return;

    const draft: OrderDraft = {
      instrumentId: instrument.id,
      instrumentName: instrument.name,
      assetClass: instrument.assetClass,
      product: product,
      side: side,
      quantity: quantity,
      price: executionPrice,
      orderType: orderType,
      exchange: 'NSE',
      charges: chargesResult,
      contractDetails:
        product === 'OPTION' && paramStrike && paramExpiry && paramType && paramLotSize
          ? {
              strike: paramStrike,
              expiry: paramExpiry,
              type: paramType,
              lotSize: paramLotSize,
            }
          : undefined,
    };

    dispatch({ type: 'SET_ORDER_DRAFT', payload: draft });
    navigate('/order/review');
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!instrument) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-textPrimary">Instrument Not Found</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const isOption = product === 'OPTION';

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Header Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Cancel & Return
        </button>
        <DemoBadge size="xs" />
      </div>

      {/* Main Order Ticket Card */}
      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
        {/* Instrument Identification */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-bgSurface text-textMuted px-2 py-0.5 rounded border border-border">
                {instrument.assetClass}
              </span>
              {isOption && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  {paramType} Strike {paramStrike}
                </span>
              )}
            </div>
            <h1 className="text-lg md:text-xl font-bold text-textPrimary mt-1">
              {instrument.name}
            </h1>
            <p className="text-xs text-textMuted">
              NSE{instrument.isin ? ` · ${instrument.isin}` : ''}
              {paramExpiry && ` · Expiry: ${paramExpiry}`}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-textMuted block">LTP / Price</span>
            <span className="text-lg font-bold text-textPrimary tabular-nums">
              {formatINR(executionPrice)}
            </span>
          </div>
        </div>

        {/* Product Type & Side Switches */}
        <div className="space-y-4">
          {/* Side Switch (Buy vs Sell) */}
          {instrument.assetClass === 'STOCK' && !isOption && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-bgSurface rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setSide('BUY')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                  side === 'BUY'
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSide('SELL')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                  side === 'SELL'
                    ? 'bg-loss text-white shadow-xs'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                Sell
              </button>
            </div>
          )}

          {/* Delivery vs Intraday */}
          {instrument.assetClass === 'STOCK' && !isOption && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setProduct('DELIVERY')}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  product === 'DELIVERY'
                    ? 'border-primary-500 bg-primary-50/50 text-primary-900 ring-1 ring-primary-500'
                    : 'border-border bg-white text-textSecondary hover:bg-bgSurface'
                }`}
              >
                <span className="font-bold block">Delivery</span>
                <span className="text-[11px] text-textMuted">Hold shares long-term</span>
              </button>

              <button
                type="button"
                onClick={() => setProduct('INTRADAY')}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  product === 'INTRADAY'
                    ? 'border-primary-500 bg-primary-50/50 text-primary-900 ring-1 ring-primary-500'
                    : 'border-border bg-white text-textSecondary hover:bg-bgSurface'
                }`}
              >
                <span className="font-bold block">Intraday (MIS)</span>
                <span className="text-[11px] text-textMuted">Square off before 3:20 PM</span>
              </button>
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="order-qty" className="font-semibold text-textPrimary">
                {isOption ? 'Quantity (Shares in Lot)' : 'Quantity (Shares / Units)'}
              </label>
              {isOption && paramLotSize && (
                <span className="text-textMuted text-[11px]">
                  Lot Size = {paramLotSize} shares
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  id="order-qty"
                  type="number"
                  min={isOption && paramLotSize ? paramLotSize : 1}
                  step={isOption && paramLotSize ? paramLotSize : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full h-11 px-3 bg-bgSurface border border-borderMd rounded-xl text-sm font-bold text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 tabular-nums"
                />
              </div>

              {/* Quick Stepper */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.max(
                        isOption && paramLotSize ? paramLotSize : 1,
                        prev - (isOption && paramLotSize ? paramLotSize : 1)
                      )
                    )
                  }
                  className="w-10 h-11 bg-bgSurface border border-border rounded-xl font-bold text-base hover:bg-bgMuted flex items-center justify-center text-textPrimary"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) =>
                      prev + (isOption && paramLotSize ? paramLotSize : 1)
                    )
                  }
                  className="w-10 h-11 bg-bgSurface border border-border rounded-xl font-bold text-base hover:bg-bgMuted flex items-center justify-center text-textPrimary"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Order Type: Market vs Limit */}
          {!isOption && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-textPrimary">Order Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    orderType === 'MARKET'
                      ? 'bg-textPrimary text-white border-textPrimary'
                      : 'bg-white text-textSecondary border-border hover:bg-bgSurface'
                  }`}
                >
                  Market
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                    orderType === 'LIMIT'
                      ? 'bg-textPrimary text-white border-textPrimary'
                      : 'bg-white text-textSecondary border-border hover:bg-bgSurface'
                  }`}
                >
                  Limit
                </button>
              </div>

              {orderType === 'LIMIT' && (
                <div className="pt-2">
                  <span className="text-[11px] text-textMuted block mb-1">Limit Price (₹)</span>
                  <input
                    type="number"
                    step="0.05"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-bgSurface border border-border rounded-xl text-sm font-bold text-textPrimary tabular-nums"
                  />
                </div>
              )}
            </div>
          )}

          {/* Live Order Value & Estimated Charges */}
          <div className="p-4 bg-bgSurface rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-textMuted">Total Order Value:</span>
              <span className="text-base font-bold text-textPrimary tabular-nums">
                {formatINR(orderValue)}
              </span>
            </div>

            {chargesResult && (
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-textMuted flex items-center gap-1">
                  Est. Charges (SEBI, STT, Stamp, Exch):
                </span>
                <span className="font-semibold text-textPrimary tabular-nums">
                  {formatINR(chargesResult.totalApplicable)}
                </span>
              </div>
            )}

            {/* Expandable charges breakdown */}
            {chargesResult && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowChargesDetail(!showChargesDetail)}
                  className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
                >
                  {showChargesDetail ? 'Hide fee calculation' : 'View itemised fee calculation'}
                </button>

                {showChargesDetail && (
                  <div className="mt-3">
                    <ChargesBreakdown charges={chargesResult} side={side} defaultExpanded={true} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Risk Warning Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldAlert size={14} className="text-amber-700" />
              <span>Investment Risk Acknowledgment</span>
            </div>
            <p>
              {isOption
                ? 'Option buyers risk losing 100% of the premium if the underlying stock does not cross the strike price before expiry.'
                : 'Equity investments are subject to market volatility. Past performance does not assure future yields.'}
            </p>
          </div>
        </div>

        {/* CTA to Review */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleReviewOrder}
            className="text-sm font-bold whitespace-nowrap"
            rightIcon={<ChevronRight size={16} className="shrink-0" />}
          >
            Review Order
          </Button>
        </div>
      </div>
    </div>
  );
};
