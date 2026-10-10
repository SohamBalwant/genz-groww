import { describe, it, expect } from 'vitest';
import { MOCK_STOCKS } from './stocks';
import { MOCK_MUTUAL_FUNDS } from './mutualFunds';
import { MOCK_BONDS } from './bonds';
import { MOCK_ETFS } from './etfs';
import { MOCK_IPOS } from './ipos';
import { MOCK_NEWS_STORIES } from './newsStories';
import { MOCK_EVENTS } from './marketEvents';
import { MOCK_OPTION_CHAIN } from './optionChain';

describe('Data Integrity & Relationship Verification (Phase 2 Gate)', () => {
  const allInstrumentIds = new Set([
    ...MOCK_STOCKS.map((s) => s.id),
    ...MOCK_MUTUAL_FUNDS.map((m) => m.id),
    ...MOCK_BONDS.map((b) => b.id),
    ...MOCK_ETFS.map((e) => e.id),
    ...MOCK_IPOS.map((i) => i.id),
  ]);

  it('verifies that all news relatedInstrumentIds resolve to existing instruments', () => {
    MOCK_NEWS_STORIES.forEach((story) => {
      story.relatedInstrumentIds.forEach((id) => {
        expect(
          allInstrumentIds.has(id),
          `Story "${story.headline}" references invalid instrumentId "${id}"`
        ).toBe(true);

        expect(
          story.relevanceReasons[id],
          `Story "${story.headline}" missing relevanceReason for instrumentId "${id}"`
        ).toBeDefined();
        expect(story.relevanceReasons[id].length).toBeGreaterThan(10);
      });
    });
  });

  it('verifies that all market event affectedInstruments resolve and provide reason + caveat', () => {
    MOCK_EVENTS.forEach((event) => {
      event.affectedInstruments.forEach((aff) => {
        expect(
          allInstrumentIds.has(aff.instrumentId),
          `Event "${event.title}" references invalid instrumentId "${aff.instrumentId}"`
        ).toBe(true);

        expect(aff.reason, `Event "${event.title}" missing reason for "${aff.instrumentId}"`).toBeDefined();
        expect(aff.reason.length).toBeGreaterThan(10);

        expect(aff.caveat, `Event "${event.title}" missing caveat for "${aff.instrumentId}"`).toBeDefined();
        expect(aff.caveat.length).toBeGreaterThan(10);
      });
    });
  });

  it('validates edge cases in stocks (loss-making, no-dividend, bank debt-to-equity)', () => {
    const zenithSteel = MOCK_STOCKS.find((s) => s.id === 'stock-zenstl');
    expect(zenithSteel).toBeDefined();
    expect(zenithSteel?.financials.metrics.pe).toBeNull();
    expect(zenithSteel?.financials.metrics.eps).toBeLessThan(0);

    const fmcg = MOCK_STOCKS.find((s) => s.id === 'stock-nbfmcg');
    expect(fmcg).toBeDefined();
    expect(fmcg?.financials.metrics.dividendYield).toBeNull();

    const bank = MOCK_STOCKS.find((s) => s.id === 'stock-ifbl');
    expect(bank).toBeDefined();
    expect(bank?.financials.metrics.isBank).toBe(true);
    expect(bank?.financials.metrics.debtToEquity).toBeNull();
  });

  it('validates that bond coupon and YTM are distinct fields and unrated bond exists', () => {
    MOCK_BONDS.forEach((bond) => {
      expect(typeof bond.coupon).toBe('number');
      expect(typeof bond.ytm).toBe('number');
    });

    const unrated = MOCK_BONDS.find((b) => b.id === 'bond-corp-003');
    expect(unrated).toBeDefined();
    expect(unrated?.rating).toBeNull();
  });

  it('validates option chain strikes, lot size, and moneyness alignment', () => {
    expect(MOCK_OPTION_CHAIN.underlyingId).toBe('stock-srphrm');
    expect(MOCK_OPTION_CHAIN.lotSize).toBe(250);
    expect(MOCK_OPTION_CHAIN.rows.length).toBe(11);

    const atmRow = MOCK_OPTION_CHAIN.rows.find((r) => r.strike === MOCK_OPTION_CHAIN.spot);
    expect(atmRow).toBeDefined();
    expect(atmRow?.ce.delta).toBeCloseTo(0.5, 1);
    expect(atmRow?.pe.delta).toBeCloseTo(-0.5, 1);
  });
});
