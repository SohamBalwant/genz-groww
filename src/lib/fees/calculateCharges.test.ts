import { describe, it, expect } from 'vitest';
import { calculateCharges } from './calculateCharges';
import { DEMO_FEE_CONFIG } from './feeConfig';
import type { FeeRateConfig } from './types';

describe('calculateCharges (Fee Engine)', () => {
  it('T18: Delivery BUY applies correct charges and marks DP charges as CONDITIONAL (excluded from total)', () => {
    const input = {
      assetClass: 'STOCK' as const,
      product: 'DELIVERY' as const,
      side: 'BUY' as const,
      price: 1000,
      quantity: 10,
      exchange: 'NSE' as const,
    };

    const result = calculateCharges(input, DEMO_FEE_CONFIG);

    expect(result.orderValue).toBe(10000);

    // Verify APPLIES lines
    const brokerage = result.lines.find((l) => l.id === 'brokerage');
    const stt = result.lines.find((l) => l.id === 'stt');
    const exchange = result.lines.find((l) => l.id === 'exchange-txn');
    const gst = result.lines.find((l) => l.id === 'gst');
    const sebi = result.lines.find((l) => l.id === 'sebi-turnover');
    const stamp = result.lines.find((l) => l.id === 'stamp-duty');
    const dp = result.lines.find((l) => l.id === 'dp-charges');

    expect(brokerage?.applicability).toBe('APPLIES');
    expect(stt?.applicability).toBe('APPLIES');
    expect(exchange?.applicability).toBe('APPLIES');
    expect(gst?.applicability).toBe('APPLIES');
    expect(sebi?.applicability).toBe('APPLIES');
    expect(stamp?.applicability).toBe('APPLIES');

    // DP must be CONDITIONAL on buy
    expect(dp?.applicability).toBe('CONDITIONAL');
    expect(dp?.condition).toBeDefined();

    // Verify totalApplicable sums ONLY applicable lines
    const applicableSum = result.lines
      .filter((l) => l.applicability === 'APPLIES')
      .reduce((s, l) => s + l.amount, 0);

    expect(result.totalApplicable).toBe(Math.round(applicableSum * 100) / 100);
    expect(result.netPayable).toBe(result.orderValue + result.totalApplicable);
  });

  it('T18: Delivery SELL applies DP charges and marks Stamp duty as NOT_APPLICABLE', () => {
    const input = {
      assetClass: 'STOCK' as const,
      product: 'DELIVERY' as const,
      side: 'SELL' as const,
      price: 1000,
      quantity: 10,
      exchange: 'NSE' as const,
    };

    const result = calculateCharges(input, DEMO_FEE_CONFIG);

    const dp = result.lines.find((l) => l.id === 'dp-charges');
    const stamp = result.lines.find((l) => l.id === 'stamp-duty');

    expect(dp?.applicability).toBe('APPLIES');
    expect(dp?.amount).toBe(DEMO_FEE_CONFIG.dpChargesDeliverySell);
    expect(stamp?.applicability).toBe('NOT_APPLICABLE');

    expect(result.netReceivable).toBe(result.orderValue - result.totalApplicable);
  });

  it('T20: calculation is purely driven by config without hard-coded numbers', () => {
    const customConfig: FeeRateConfig = {
      ...DEMO_FEE_CONFIG,
      brokerageDeliveryPct: 0.2, // double the brokerage
    };

    const input = {
      assetClass: 'STOCK' as const,
      product: 'DELIVERY' as const,
      side: 'BUY' as const,
      price: 5000,
      quantity: 2,
      exchange: 'NSE' as const,
    };

    const res1 = calculateCharges(input, DEMO_FEE_CONFIG);
    const res2 = calculateCharges(input, customConfig);

    const b1 = res1.lines.find((l) => l.id === 'brokerage')?.amount || 0;
    const b2 = res2.lines.find((l) => l.id === 'brokerage')?.amount || 0;

    expect(b2).toBeCloseTo(b1 * 2, 1);
  });

  it('Options BUY calculates flat brokerage and excludes STT on buy side', () => {
    const input = {
      assetClass: 'OPTION' as const,
      product: 'OPTION' as const,
      side: 'BUY' as const,
      price: 25, // premium
      quantity: 250, // 1 lot of 250
      exchange: 'NSE' as const,
    };

    const result = calculateCharges(input, DEMO_FEE_CONFIG);

    expect(result.orderValue).toBe(6250); // 25 * 250

    const brokerage = result.lines.find((l) => l.id === 'brokerage');
    expect(brokerage?.amount).toBe(DEMO_FEE_CONFIG.brokerageOptionFlat);

    const stt = result.lines.find((l) => l.id === 'stt');
    expect(stt?.applicability).toBe('NOT_APPLICABLE');

    const stamp = result.lines.find((l) => l.id === 'stamp-duty');
    expect(stamp?.applicability).toBe('APPLIES');
  });

  it('Direct Mutual Funds have zero brokerage', () => {
    const input = {
      assetClass: 'MF' as const,
      product: 'MF' as const,
      side: 'BUY' as const,
      price: 100, // NAV
      quantity: 50, // 50 units = ₹5,000
      exchange: 'NSE' as const,
    };

    const result = calculateCharges(input, DEMO_FEE_CONFIG);

    const brokerage = result.lines.find((l) => l.id === 'brokerage');
    expect(brokerage?.amount).toBe(0);
    expect(brokerage?.applicability).toBe('NOT_APPLICABLE');
  });
});
