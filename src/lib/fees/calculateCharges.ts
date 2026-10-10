import type { FeeCalculationInput, FeeRateConfig, ChargeLine, ChargesResult } from './types';

/**
 * Pure calculation engine for statutory, regulatory, and brokerage charges.
 * Configured dynamically via FeeRateConfig.
 * Strictly separates APPLIES (summed into total) from CONDITIONAL/NOT_APPLICABLE (informative only).
 */
export function calculateCharges(input: FeeCalculationInput, config: FeeRateConfig): ChargesResult {
  const { assetClass, product, side, price, quantity } = input;
  const isBuy = side === 'BUY';
  const isOption = product === 'OPTION' || assetClass === 'OPTION';

  // For options, orderValue is premium turnover (premium * quantity)
  const orderValue = isOption ? price * quantity : price * quantity;
  const lines: ChargeLine[] = [];

  let brokerageAmount = 0;
  let sttAmount = 0;
  let exchangeAmount = 0;
  let sebiAmount = 0;
  let stampDutyAmount = 0;
  let dpAmount = 0;
  let ipftAmount = 0;

  // 1. BROKERAGE
  if (assetClass === 'MF') {
    lines.push({
      id: 'brokerage',
      label: 'Brokerage',
      amount: 0,
      applicability: 'NOT_APPLICABLE',
      formula: '₹0 for Direct Mutual Fund investments',
      explanation: 'Direct plans have zero distributor or brokerage commission.',
    });
  } else if (isOption) {
    brokerageAmount = config.brokerageOptionFlat;
    lines.push({
      id: 'brokerage',
      label: 'Brokerage',
      amount: brokerageAmount,
      applicability: 'APPLIES',
      formula: `₹${config.brokerageOptionFlat} flat per order (Demo rate)`,
      explanation: 'Flat brokerage fee per executed order for options contracts.',
    });
  } else if (product === 'INTRADAY') {
    brokerageAmount = Math.round((orderValue * config.brokerageIntradayPct) / 100 * 100) / 100;
    lines.push({
      id: 'brokerage',
      label: 'Brokerage',
      amount: brokerageAmount,
      applicability: 'APPLIES',
      formula: `${config.brokerageIntradayPct}% of ₹${orderValue.toFixed(2)}`,
      explanation: 'Brokerage charged on intraday equity trades.',
    });
  } else if (product === 'DELIVERY') {
    brokerageAmount = Math.round((orderValue * config.brokerageDeliveryPct) / 100 * 100) / 100;
    lines.push({
      id: 'brokerage',
      label: 'Brokerage',
      amount: brokerageAmount,
      applicability: 'APPLIES',
      formula: `${config.brokerageDeliveryPct}% of ₹${orderValue.toFixed(2)}`,
      explanation: 'Brokerage charged on delivery equity trades.',
    });
  } else {
    // Bond or IPO
    lines.push({
      id: 'brokerage',
      label: 'Brokerage',
      amount: 0,
      applicability: 'NOT_APPLICABLE',
      formula: '₹0 upfront brokerage',
      explanation: 'Zero direct brokerage on primary issue applications / bonds.',
    });
  }

  // 2. STT (Securities Transaction Tax)
  if (assetClass === 'MF') {
    lines.push({
      id: 'stt',
      label: 'Securities Transaction Tax (STT)',
      amount: 0,
      applicability: 'NOT_APPLICABLE',
      explanation: 'STT on mutual funds is levied on redemption of equity funds, not on fresh purchase.',
    });
  } else if (isOption) {
    if (isBuy) {
      lines.push({
        id: 'stt',
        label: 'Securities Transaction Tax (STT)',
        amount: 0,
        applicability: 'NOT_APPLICABLE',
        explanation: 'STT on option trades is levied on the sell side upon premium turnover.',
      });
    } else {
      sttAmount = Math.round((orderValue * config.sttOptionSellPct) / 100 * 100) / 100;
      lines.push({
        id: 'stt',
        label: 'Securities Transaction Tax (STT)',
        amount: sttAmount,
        applicability: 'APPLIES',
        formula: `${config.sttOptionSellPct}% of ₹${orderValue.toFixed(2)} premium`,
        explanation: 'STT charged by the government on the sale of options contracts.',
      });
    }
  } else if (product === 'INTRADAY') {
    if (isBuy) {
      lines.push({
        id: 'stt',
        label: 'Securities Transaction Tax (STT)',
        amount: 0,
        applicability: 'NOT_APPLICABLE',
        explanation: 'STT on intraday equity trades is levied on the sell side only.',
      });
    } else {
      sttAmount = Math.round((orderValue * config.sttIntradaySellPct) / 100 * 100) / 100;
      lines.push({
        id: 'stt',
        label: 'Securities Transaction Tax (STT)',
        amount: sttAmount,
        applicability: 'APPLIES',
        formula: `${config.sttIntradaySellPct}% of ₹${orderValue.toFixed(2)}`,
        explanation: 'STT levied on intraday equity sell transactions.',
      });
    }
  } else if (product === 'DELIVERY') {
    const rate = isBuy ? config.sttDeliveryBuyPct : config.sttDeliverySellPct;
    sttAmount = Math.round((orderValue * rate) / 100 * 100) / 100;
    lines.push({
      id: 'stt',
      label: 'Securities Transaction Tax (STT)',
      amount: sttAmount,
      applicability: 'APPLIES',
      formula: `${rate}% on ₹${orderValue.toFixed(2)}`,
      explanation: 'Central government tax on stock exchange transactions.',
    });
  }

  // 3. EXCHANGE TRANSACTION CHARGES
  if (assetClass === 'MF' || assetClass === 'IPO') {
    // Negligible or zero upfront
  } else if (isOption) {
    exchangeAmount = Math.round((orderValue * config.exchangeTxnOptionPct) / 100 * 100) / 100;
    lines.push({
      id: 'exchange-txn',
      label: 'Exchange Transaction Charges',
      amount: exchangeAmount,
      applicability: 'APPLIES',
      formula: `${config.exchangeTxnOptionPct}% of premium turnover`,
      explanation: 'Turnover charge levied by the exchange (NSE/BSE) for trade execution.',
    });
  } else {
    const rate = product === 'INTRADAY' ? config.exchangeTxnIntradayPct : config.exchangeTxnDeliveryPct;
    exchangeAmount = Math.round((orderValue * rate) / 100 * 100) / 100;
    lines.push({
      id: 'exchange-txn',
      label: 'Exchange Transaction Charges',
      amount: exchangeAmount,
      applicability: 'APPLIES',
      formula: `${rate}% of ₹${orderValue.toFixed(2)}`,
      explanation: 'Fees charged by the stock exchange (NSE/BSE) to process transactions.',
    });
  }

  // 4. SEBI TURNOVER CHARGES
  if (assetClass !== 'MF' && assetClass !== 'IPO') {
    sebiAmount = Math.round((orderValue * config.sebiTurnoverPct) / 100 * 100) / 100;
    lines.push({
      id: 'sebi-turnover',
      label: 'SEBI Turnover Charges',
      amount: sebiAmount,
      applicability: 'APPLIES',
      formula: `${config.sebiTurnoverPct}% of turnover (₹10/crore Demo)`,
      explanation: 'Statutory regulatory fee collected on behalf of the regulator SEBI.',
    });
  }

  // 5. STAMP DUTY (BUY SIDE ONLY)
  if (isBuy) {
    let stampRate = 0;
    if (assetClass === 'MF') {
      stampRate = 0.005; // 0.005% on mutual fund unit creation
    } else if (isOption) {
      stampRate = config.stampDutyBuyOptionPct;
    } else if (product === 'INTRADAY') {
      stampRate = config.stampDutyBuyIntradayPct;
    } else {
      stampRate = config.stampDutyBuyDeliveryPct;
    }
    stampDutyAmount = Math.round((orderValue * stampRate) / 100 * 100) / 100;
    lines.push({
      id: 'stamp-duty',
      label: 'Stamp Duty',
      amount: stampDutyAmount,
      applicability: 'APPLIES',
      formula: `${stampRate}% of order value`,
      explanation: 'Government revenue stamp duty charged under the Indian Stamp Act on purchases.',
    });
  } else {
    lines.push({
      id: 'stamp-duty',
      label: 'Stamp Duty',
      amount: 0,
      applicability: 'NOT_APPLICABLE',
      explanation: 'Stamp duty is mandated on buy-side orders only.',
    });
  }

  // 6. IPFT (For Options)
  if (isOption) {
    ipftAmount = Math.round((orderValue * config.ipftOptionPct) / 100 * 100) / 100;
    lines.push({
      id: 'ipft',
      label: 'Investor Protection Fund Trust (IPFT)',
      amount: ipftAmount,
      applicability: 'APPLIES',
      formula: `${config.ipftOptionPct}% of premium`,
      explanation: 'Statutory fee levied for investor protection and grievance redressal.',
    });
  }

  // 7. GST (18% on Brokerage + Exchange charges + SEBI charges)
  const gstBase = brokerageAmount + exchangeAmount + sebiAmount;
  let gstAmount = 0;
  if (gstBase > 0) {
    gstAmount = Math.round(((gstBase * config.gstPct) / 100) * 100) / 100;
    lines.push({
      id: 'gst',
      label: 'GST (Goods and Services Tax)',
      amount: gstAmount,
      applicability: 'APPLIES',
      formula: `${config.gstPct}% on (Brokerage + Exchange + SEBI charges = ₹${gstBase.toFixed(2)})`,
      explanation: 'Central & State GST levied on financial and brokerage services.',
    });
  }

  // 8. DP (DEPOSITORY PARTICIPANT) CHARGES — Delivery SELL only
  if (product === 'DELIVERY') {
    if (side === 'SELL') {
      dpAmount = config.dpChargesDeliverySell;
      lines.push({
        id: 'dp-charges',
        label: 'DP (Depository Participant) Charges',
        amount: dpAmount,
        applicability: 'APPLIES',
        formula: `₹${config.dpChargesDeliverySell} flat per scrip (CDSL/NSDL Demo)`,
        explanation: 'Depository fee charged when shares are debited from your demat account upon delivery sale.',
      });
    } else {
      // DELIVERY BUY: Conditional line! NOT included in total!
      lines.push({
        id: 'dp-charges',
        label: 'DP (Depository Participant) Charges',
        amount: config.dpChargesDeliverySell,
        applicability: 'CONDITIONAL',
        condition: `Applies when you sell these shares in the future: ₹${config.dpChargesDeliverySell} per company`,
        explanation: 'Depository charges do not apply when buying. They only apply when shares leave your demat account on a future sell.',
      });
    }
  }

  // Total Applicable = Sum of APPLIES lines ONLY
  const totalApplicable = Math.round(
    lines
      .filter((line) => line.applicability === 'APPLIES')
      .reduce((sum, line) => sum + line.amount, 0) * 100
  ) / 100;

  const netPayable = isBuy ? Math.round((orderValue + totalApplicable) * 100) / 100 : undefined;
  const netReceivable = !isBuy ? Math.round((orderValue - totalApplicable) * 100) / 100 : undefined;

  const assumptions = [
    'All calculation rates are based on the illustrative DEMO schedule.',
    'GST calculated at 18% on eligible brokerage, exchange, and SEBI fee components.',
    'Actual charges on an exchange vary with order execution price, order type, and current circulars.',
  ];

  return {
    orderValue: Math.round(orderValue * 100) / 100,
    lines,
    totalApplicable,
    netPayable,
    netReceivable,
    assumptions,
    configAsOf: config.asOf,
    isDemo: true,
  };
}
