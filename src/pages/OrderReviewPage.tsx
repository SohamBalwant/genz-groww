import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { ChargesBreakdown } from '../components/trade/ChargesBreakdown';
import { DemoBadge } from '../components/ui/DemoBadge';
import { Button } from '../components/ui/Button';
import { formatINR } from '../lib/format';
import { ArrowLeft } from 'lucide-react';
import type { SimulatedOrder } from '../types';

export const OrderReviewPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const draft = state.activeOrderDraft;
  const [submitting, setSubmitting] = useState(false);

  // If no draft exists (e.g. user refreshed or arrived directly)
  if (!draft || !draft.charges) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-textPrimary">No Active Order Draft</h2>
        <p className="text-sm text-textSecondary">
          Please select an instrument and set your quantity to begin an order review.
        </p>
        <Button onClick={() => navigate('/')}>Return to Discover</Button>
      </div>
    );
  }

  const isBuy = draft.side === 'BUY';
  const orderValue = draft.price * draft.quantity;
  const totalCharges = draft.charges.totalApplicable;

  // Net payable or receivable
  const netAmount = isBuy
    ? orderValue + totalCharges
    : Math.max(0, orderValue - totalCharges);

  const handleConfirmOrder = () => {
    if (submitting || !draft.charges) return;
    setSubmitting(true);

    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newOrder: SimulatedOrder = {
      id: orderId,
      instrumentId: draft.instrumentId,
      instrumentName: draft.instrumentName || draft.instrumentId,
      assetClass: draft.assetClass,
      product: draft.product,
      side: draft.side,
      quantity: draft.quantity,
      price: draft.price,
      orderType: draft.orderType,
      status: 'SIMULATED',
      timestamp: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      charges: draft.charges,
      contractDetails: draft.contractDetails,
    };

    // Store order in state and clear draft
    dispatch({ type: 'ADD_SIMULATED_ORDER', payload: newOrder });

    // Navigate to confirmation
    navigate(`/order/result/${orderId}`);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Back to Edit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-textSecondary hover:text-textPrimary transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Edit Order Ticket
        </button>
        <DemoBadge size="xs" />
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary-700 bg-primary-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Step 2 of 2 · Final Review
            </span>
            <DemoBadge size="xs" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-textPrimary tracking-tight">
            Review {draft.side} Order
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Review all trade parameters and itemised statutory charges before recording.
          </p>
        </div>

        {/* Order Summary Specs Table */}
        <div className="bg-bgSurface border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
                {draft.assetClass}
              </span>
              <h2 className="text-base font-bold text-textPrimary">
                {draft.instrumentName || draft.instrumentId}
              </h2>
              {draft.contractDetails && (
                <p className="text-xs text-purple-700 font-semibold mt-0.5">
                  {draft.contractDetails.type} Strike {draft.contractDetails.strike} · {draft.contractDetails.expiry}
                </p>
              )}
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                isBuy ? 'bg-primary-500 text-white' : 'bg-loss text-white'
              }`}
            >
              {draft.side}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-textMuted block">Product Type</span>
              <span className="font-semibold text-textPrimary capitalize">
                {draft.product.toLowerCase()}
              </span>
            </div>

            <div>
              <span className="text-textMuted block">Order Execution</span>
              <span className="font-semibold text-textPrimary capitalize">
                {draft.orderType.toLowerCase()} (NSE)
              </span>
            </div>

            <div>
              <span className="text-textMuted block">Quantity</span>
              <span className="font-semibold text-textPrimary tabular-nums">
                {draft.quantity.toLocaleString('en-IN')} shares / units
              </span>
            </div>

            <div>
              <span className="text-textMuted block">Unit Price / Premium</span>
              <span className="font-semibold text-textPrimary tabular-nums">
                {formatINR(draft.price)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs font-bold text-textMuted">Gross Order Value</span>
            <span className="text-sm font-bold text-textPrimary tabular-nums">
              {formatINR(orderValue)}
            </span>
          </div>
        </div>

        {/* Itemised Fee Breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted">
            Regulatory & Brokerage Fee Breakdown
          </h3>
          <ChargesBreakdown charges={draft.charges} side={draft.side} defaultExpanded={true} />
        </div>

        {/* Net Amount Banner */}
        <div className="p-4 bg-primary-50/60 border border-primary-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-primary-900 block">
              {isBuy ? 'Estimated Net Payable' : 'Estimated Net Receivable'}
            </span>
            <span className="text-[11px] text-primary-700">
              {isBuy
                ? 'Order value + all applicable statutory charges'
                : 'Order value − all applicable statutory charges'}
            </span>
          </div>
          <span className="text-xl font-extrabold text-primary-700 tabular-nums">
            {formatINR(netAmount)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full font-semibold"
          >
            Edit Order
          </Button>

          <Button
            variant="primary"
            disabled={submitting}
            onClick={handleConfirmOrder}
            className="w-full font-bold bg-primary-500 hover:bg-primary-600 text-white whitespace-nowrap text-xs sm:text-sm px-2.5 sm:px-4"
          >
            {submitting ? 'Recording...' : 'Confirm Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
