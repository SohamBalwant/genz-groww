import { describe, it, expect } from 'vitest';
import { getMoneyness } from './moneyness';
import { getBreakeven, getMaxLoss, longCallPayoff, longPutPayoff } from './payoff';

describe('Options Moneyness (T11)', () => {
  const spot = 1520;

  it('correctly categorizes Call options (CE)', () => {
    // Strike < Spot -> ITM
    expect(getMoneyness(1450, spot, 'CE')).toBe('ITM');
    // Strike > Spot -> OTM
    expect(getMoneyness(1600, spot, 'CE')).toBe('OTM');
    // Nearest strike -> ATM
    expect(getMoneyness(1520, spot, 'CE', true)).toBe('ATM');
  });

  it('correctly categorizes Put options (PE)', () => {
    // Strike > Spot -> ITM
    expect(getMoneyness(1600, spot, 'PE')).toBe('ITM');
    // Strike < Spot -> OTM
    expect(getMoneyness(1450, spot, 'PE')).toBe('OTM');
    // Nearest strike -> ATM
    expect(getMoneyness(1520, spot, 'PE', true)).toBe('ATM');
  });
});

describe('Options Payoff Engine (T12)', () => {
  const strike = 1500;
  const premium = 30;
  const lotSize = 250;
  const lots = 1;

  it('calculates Call breakeven and max loss correctly', () => {
    const breakeven = getBreakeven(strike, premium, 'CE');
    expect(breakeven).toBe(1530); // 1500 + 30

    const maxLoss = getMaxLoss(premium, lotSize, lots);
    expect(maxLoss).toBe(7500); // 30 * 250
  });

  it('calculates Put breakeven and max loss correctly', () => {
    const breakeven = getBreakeven(strike, premium, 'PE');
    expect(breakeven).toBe(1470); // 1500 - 30

    const maxLoss = getMaxLoss(premium, lotSize, lots);
    expect(maxLoss).toBe(7500);
  });

  it('evaluates Call payoff curve at breakeven to zero PnL', () => {
    const points = longCallPayoff(strike, premium, lotSize, lots, 1400, 1600, 20);
    // At price = 1530, PnL should be 0
    const atBreakeven = points.find((p) => Math.abs(p.price - 1530) < 5);
    expect(atBreakeven).toBeDefined();
    if (atBreakeven) {
      expect(Math.abs(atBreakeven.pnl)).toBeLessThan(100);
    }
  });

  it('caps Call max loss at negative total premium when price is below strike', () => {
    const points = longCallPayoff(strike, premium, lotSize, lots, 1300, 1450, 5);
    points.forEach((p) => {
      expect(p.pnl).toBe(-7500);
    });
  });

  it('caps Put max loss at negative total premium when price is above strike', () => {
    const points = longPutPayoff(strike, premium, lotSize, lots, 1550, 1700, 5);
    points.forEach((p) => {
      expect(p.pnl).toBe(-7500);
    });
  });
});
