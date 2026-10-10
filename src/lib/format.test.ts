import { describe, it, expect } from 'vitest';
import { formatINR, formatPercent, formatLakhCrore, formatDate, formatDate24h } from './format';

describe('formatINR', () => {
  it('formats standard Indian currency with commas correctly', () => {
    expect(formatINR(123456.78)).toBe('₹1,23,456.78');
    expect(formatINR(1000)).toBe('₹1,000.00');
    expect(formatINR(5000000)).toBe('₹50,00,000.00');
    expect(formatINR(0)).toBe('₹0.00');
  });

  it('handles negative amounts correctly', () => {
    expect(formatINR(-45000.5)).toBe('-₹45,000.50');
  });

  it('formats compact representations correctly', () => {
    expect(formatINR(15000000, true)).toBe('₹1.50 Cr');
    expect(formatINR(250000, true)).toBe('₹2.50 L');
    expect(formatINR(1200, true)).toBe('₹1.2 K');
  });
});

describe('formatLakhCrore', () => {
  it('formats in words for large values', () => {
    expect(formatLakhCrore(34000000)).toBe('₹3.40 Crore');
    expect(formatLakhCrore(500000)).toBe('₹5.00 Lakh');
  });
});

describe('formatPercent', () => {
  it('formats positive percentages with upward arrow and plus sign', () => {
    expect(formatPercent(2.45)).toBe('▲ +2.45%');
  });

  it('formats negative percentages with downward arrow and minus sign', () => {
    expect(formatPercent(-1.82)).toBe('▼ −1.82%');
  });

  it('formats zero correctly', () => {
    expect(formatPercent(0)).toBe('0.00%');
  });
});

describe('formatDate', () => {
  it('formats valid dates in IST format', () => {
    const iso = '2025-03-15T10:30:00.000Z';
    const formatted = formatDate(iso);
    expect(formatted).toContain('2025');
    expect(formatted).toContain('Mar');
  });
});

describe('formatDate24h', () => {
  it('formats dates in 24-hour clock without am/pm and IST suffix', () => {
    const iso = '2025-03-14T10:35:00.000Z'; // 16:05 IST
    const formatted = formatDate24h(iso);
    expect(formatted).toContain('14 Mar 2025');
    expect(formatted).toContain('16:05');
    expect(formatted).not.toMatch(/am|pm|AM|PM/);
    expect(formatted).not.toContain('IST');
  });
});
