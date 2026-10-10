import type { FeeRateConfig } from './types';

/**
 * DEMO FEE CONFIGURATION
 *
 * All rates below are ILLUSTRATIVE DEMO VALUES only.
 * They do NOT represent actual brokerage, exchange, or regulatory rates.
 * Verify against official SEBI / exchange / broker schedules before any real use.
 *
 * Source: Demo configuration — verify against official exchange/SEBI/broker schedules before any real use.
 */
export const DEMO_FEE_CONFIG: FeeRateConfig = {
  // Brokerage
  brokerageDeliveryPct:     0.10,   // 0.10% of order value (DEMO)
  brokerageIntradayPct:     0.03,   // 0.03% of order value (DEMO)
  brokerageOptionFlat:      20,     // ₹20 flat per order (DEMO)

  // STT — Securities Transaction Tax (DEMO rates)
  sttDeliveryBuyPct:        0.10,   // 0.10% on buy turnover (DEMO)
  sttDeliverySellPct:       0.10,   // 0.10% on sell turnover (DEMO)
  sttIntradaySellPct:       0.025,  // 0.025% on sell turnover (DEMO)
  sttOptionSellPct:         0.05,   // 0.05% on premium on sell (DEMO)

  // Exchange Transaction Charges (DEMO rates)
  exchangeTxnDeliveryPct:   0.00325, // (DEMO)
  exchangeTxnIntradayPct:   0.00325, // (DEMO)
  exchangeTxnOptionPct:     0.05,    // on premium (DEMO)

  // GST on brokerage + exchange charges + SEBI charges
  gstPct:                   18,      // 18% (DEMO)

  // SEBI Turnover Charges (DEMO rate)
  sebiTurnoverPct:          0.0001,  // ₹10 per crore (DEMO)

  // Stamp Duty (DEMO rates — buy side only)
  stampDutyBuyDeliveryPct:  0.015,  // 0.015% on buy (DEMO)
  stampDutyBuyIntradayPct:  0.003,  // 0.003% on buy (DEMO)
  stampDutyBuyOptionPct:    0.003,  // 0.003% on buy premium (DEMO)

  // DP Charges — Delivery SELL only, flat per scrip
  dpChargesDeliverySell:    15.93,  // ₹15.93 per scrip (DEMO)

  // IPFT (Investor Protection Fund Trust) — options
  ipftOptionPct:            0.05,   // on premium (DEMO)

  asOf: '2025-01-01',
  source: 'Demo configuration — verify against official exchange/SEBI/broker schedules before any real use.',
  isDemo: true,
};
