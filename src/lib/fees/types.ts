// ─── Fee Engine Types ─────────────────────────────────────────────────────────

export type ChargeApplicability = 'APPLIES' | 'CONDITIONAL' | 'NOT_APPLICABLE';

export interface ChargeLine {
  id: string;
  label: string;
  amount: number;
  applicability: ChargeApplicability;
  condition?: string;  // shown when CONDITIONAL
  explanation: string;
  formula?: string;    // e.g. "0.1% of ₹10,000"
}

export interface ChargesResult {
  orderValue: number;
  lines: ChargeLine[];
  totalApplicable: number;
  netPayable?: number;    // for BUY
  netReceivable?: number; // for SELL
  assumptions: string[];
  configAsOf: string;
  isDemo: true;
}

export interface FeeRateConfig {
  brokerageDeliveryPct: number;    // % of order value
  brokerageIntradayPct: number;
  brokerageOptionFlat: number;     // flat per order
  sttDeliveryBuyPct: number;
  sttDeliverySellPct: number;
  sttIntradaySellPct: number;
  sttOptionSellPct: number;        // on premium
  exchangeTxnDeliveryPct: number;
  exchangeTxnIntradayPct: number;
  exchangeTxnOptionPct: number;
  gstPct: number;                  // on brokerage + exchange + sebi
  sebiTurnoverPct: number;
  stampDutyBuyDeliveryPct: number;
  stampDutyBuyIntradayPct: number;
  stampDutyBuyOptionPct: number;
  dpChargesDeliverySell: number;   // flat per scrip
  ipftOptionPct: number;
  asOf: string;
  source: string;
  isDemo: true;
}

export interface FeeCalculationInput {
  assetClass: import('../../types').AssetClass | 'OPTION';
  product: 'DELIVERY' | 'INTRADAY' | 'OPTION' | 'MF' | 'BOND' | 'IPO';

  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  exchange: 'NSE' | 'BSE';
  premiumBased?: boolean; // for options
}
