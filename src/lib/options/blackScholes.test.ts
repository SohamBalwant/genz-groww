import { describe, it, expect } from 'vitest';
import {
  normalCdf,
  normalPdf,
  calculateBlackScholes,
  calculateFromDte,
  calculateMaxPain,
  calculatePcr,
} from './blackScholes';

describe('Black-Scholes Mathematical Foundations', () => {
  it('computes standard normal CDF and PDF accurately', () => {
    // Phi(0) = 0.5
    expect(normalCdf(0)).toBeCloseTo(0.5, 4);
    // Phi(1.96) ~= 0.975
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    // Phi(-1.96) ~= 0.025
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
    // PDF at 0 = 1 / sqrt(2pi) ~= 0.3989
    expect(normalPdf(0)).toBeCloseTo(0.3989, 3);
  });

  it('calculates textbook European Call & Put prices and checks Put-Call Parity', () => {
    const S = 100;
    const K = 100;
    const T = 1.0;
    const sigma = 0.20;
    const r = 0.05;

    const call = calculateBlackScholes(S, K, T, sigma, r, 'CE');
    const put = calculateBlackScholes(S, K, T, sigma, r, 'PE');

    // Standard textbook value for S=100, K=100, T=1, sigma=0.2, r=0.05: Call ~= 10.45, Put ~= 5.57
    expect(call.price).toBeCloseTo(10.45, 1);
    expect(put.price).toBeCloseTo(5.57, 1);

    // Put-Call Parity: C - P = S - K * exp(-r*T)
    const discount = Math.exp(-r * T);
    const leftSide = call.price - put.price;
    const rightSide = S - K * discount;
    expect(leftSide).toBeCloseTo(rightSide, 1);
  });

  it('satisfies theoretical Greeks boundaries and sign conventions', () => {
    const spot = 24850;
    const strike = 24850;
    const dte = 14; // 14 days
    const iv = 13.5; // 13.5%

    const call = calculateFromDte(spot, strike, dte, iv, 'CE');
    const put = calculateFromDte(spot, strike, dte, iv, 'PE');

    // Delta: Call in (0, 1), Put in (-1, 0)
    expect(call.delta).toBeGreaterThan(0.4);
    expect(call.delta).toBeLessThan(0.65);
    expect(put.delta).toBeLessThan(-0.35);
    expect(put.delta).toBeGreaterThan(-0.6);
    // Call Delta - Put Delta should equal 1
    expect(call.delta - put.delta).toBeCloseTo(1, 2);

    // Gamma: Always strictly positive for both Call and Put
    expect(call.gamma).toBeGreaterThan(0);
    expect(put.gamma).toBeGreaterThan(0);
    expect(call.gamma).toBeCloseTo(put.gamma, 4);

    // Theta: Negative for long options (decay)
    expect(call.theta).toBeLessThan(0);
    expect(put.theta).toBeLessThan(0);

    // Vega: Strictly positive (options gain value with rising volatility)
    expect(call.vega).toBeGreaterThan(0);
    expect(put.vega).toBeGreaterThan(0);
    expect(call.vega).toBeCloseTo(put.vega, 2);

    // Rho: Positive for Calls, Negative for Puts
    expect(call.rho).toBeGreaterThan(0);
    expect(put.rho).toBeLessThan(0);
  });

  it('handles expiration edge case (DTE = 0) gracefully without NaN or Infinity', () => {
    const spot = 25000;
    const itmCall = calculateFromDte(spot, 24800, 0, 15, 'CE');
    expect(itmCall.price).toBe(200); // Intrinsic value
    expect(itmCall.delta).toBe(1);
    expect(itmCall.gamma).toBe(0);
    expect(itmCall.theta).toBe(0);

    const otmCall = calculateFromDte(spot, 25200, 0, 15, 'CE');
    expect(otmCall.price).toBe(0);
    expect(otmCall.delta).toBe(0);

    const itmPut = calculateFromDte(spot, 25200, 0, 15, 'PE');
    expect(itmPut.price).toBe(200);
    expect(itmPut.delta).toBe(-1);

    const otmPut = calculateFromDte(spot, 24800, 0, 15, 'PE');
    expect(otmPut.price).toBe(0);
    expect(otmPut.delta).toBe(0);
  });
});

describe('Max Pain & PCR Calculations', () => {
  const strikesData = [
    { strike: 24700, callOi: 50000, putOi: 200000 },
    { strike: 24800, callOi: 120000, putOi: 180000 },
    { strike: 24900, callOi: 220000, putOi: 110000 },
    { strike: 25000, callOi: 350000, putOi: 60000 },
  ];

  it('calculates Max Pain correctly', () => {
    const result = calculateMaxPain(strikesData);
    expect(result.maxPainStrike).toBeGreaterThanOrEqual(24700);
    expect(result.maxPainStrike).toBeLessThanOrEqual(25000);
    expect(result.totalPayoutAtMaxPain).toBeGreaterThan(0);
  });

  it('calculates PCR (Put/Call Ratio) accurately', () => {
    const result = calculatePcr(strikesData);
    // Total Call OI = 50k + 120k + 220k + 350k = 740,000
    // Total Put OI = 200k + 180k + 110k + 60k = 550,000
    // PCR = 550,000 / 740,000 ~= 0.74
    expect(result.totalCallOi).toBe(740000);
    expect(result.totalPutOi).toBe(550000);
    expect(result.pcr).toBeCloseTo(0.74, 2);
    expect(result.interpretation).toContain('Bearish');
  });
});
