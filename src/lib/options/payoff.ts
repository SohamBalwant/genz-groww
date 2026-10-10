export interface PayoffPoint {
  price: number;
  pnl: number;
}

export function getBreakeven(
  strike: number,
  premium: number,
  type: 'CE' | 'PE',
  _side: 'BUY' | 'SELL' = 'BUY'
): number {
  if (type === 'CE') {
    return strike + premium;
  }
  return strike - premium;
}

export function getMaxLoss(
  premium: number,
  lotSize: number,
  lots: number = 1,
  side: 'BUY' | 'SELL' = 'BUY',
  type: 'CE' | 'PE' = 'CE',
  strike: number = 0
): number | string {
  if (side === 'BUY') {
    return Math.round(premium * lotSize * lots * 100) / 100;
  }
  // Short positions
  if (type === 'CE') {
    return 'Theoretically Unlimited (Unbounded Upside Risk)';
  }
  // Short Put: max loss occurs if underlying drops to 0
  const maxShortPutLoss = Math.max(0, (strike - premium) * lotSize * lots);
  return Math.round(maxShortPutLoss * 100) / 100;
}

export function getMaxProfit(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  type: 'CE' | 'PE',
  side: 'BUY' | 'SELL' = 'BUY'
): string {
  if (side === 'BUY') {
    if (type === 'CE') {
      return 'Theoretically Unlimited';
    }
    const maxPutProfit = Math.max(0, (strike - premium) * lotSize * lots);
    return `₹${maxPutProfit.toLocaleString('en-IN')} (if stock drops to 0)`;
  }
  // Short side: max profit is capped at the premium collected
  const totalPremium = Math.round(premium * lotSize * lots * 100) / 100;
  return `₹${totalPremium.toLocaleString('en-IN')} (Total premium received)`;
}

/**
 * Calculates long call payoff curve points at expiry across a price range.
 */
export function longCallPayoff(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  minPrice: number,
  maxPrice: number,
  steps: number = 25
): PayoffPoint[] {
  const points: PayoffPoint[] = [];
  const stepSize = (maxPrice - minPrice) / steps;
  const totalPremium = premium * lotSize * lots;

  for (let i = 0; i <= steps; i++) {
    const currentPrice = minPrice + i * stepSize;
    const intrinsicValue = Math.max(0, currentPrice - strike) * lotSize * lots;
    const pnl = Math.round((intrinsicValue - totalPremium) * 100) / 100;
    points.push({ price: Math.round(currentPrice * 10) / 10, pnl });
  }

  return points;
}

/**
 * Calculates long put payoff curve points at expiry across a price range.
 */
export function longPutPayoff(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  minPrice: number,
  maxPrice: number,
  steps: number = 25
): PayoffPoint[] {
  const points: PayoffPoint[] = [];
  const stepSize = (maxPrice - minPrice) / steps;
  const totalPremium = premium * lotSize * lots;

  for (let i = 0; i <= steps; i++) {
    const currentPrice = minPrice + i * stepSize;
    const intrinsicValue = Math.max(0, strike - currentPrice) * lotSize * lots;
    const pnl = Math.round((intrinsicValue - totalPremium) * 100) / 100;
    points.push({ price: Math.round(currentPrice * 10) / 10, pnl });
  }

  return points;
}

/**
 * Calculates short call payoff curve points at expiry across a price range.
 */
export function shortCallPayoff(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  minPrice: number,
  maxPrice: number,
  steps: number = 25
): PayoffPoint[] {
  const points: PayoffPoint[] = [];
  const stepSize = (maxPrice - minPrice) / steps;
  const totalPremium = premium * lotSize * lots;

  for (let i = 0; i <= steps; i++) {
    const currentPrice = minPrice + i * stepSize;
    const intrinsicLoss = Math.max(0, currentPrice - strike) * lotSize * lots;
    const pnl = Math.round((totalPremium - intrinsicLoss) * 100) / 100;
    points.push({ price: Math.round(currentPrice * 10) / 10, pnl });
  }

  return points;
}

/**
 * Calculates short put payoff curve points at expiry across a price range.
 */
export function shortPutPayoff(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  minPrice: number,
  maxPrice: number,
  steps: number = 25
): PayoffPoint[] {
  const points: PayoffPoint[] = [];
  const stepSize = (maxPrice - minPrice) / steps;
  const totalPremium = premium * lotSize * lots;

  for (let i = 0; i <= steps; i++) {
    const currentPrice = minPrice + i * stepSize;
    const intrinsicLoss = Math.max(0, strike - currentPrice) * lotSize * lots;
    const pnl = Math.round((totalPremium - intrinsicLoss) * 100) / 100;
    points.push({ price: Math.round(currentPrice * 10) / 10, pnl });
  }

  return points;
}

/**
 * Master dispatcher for any single-leg payoff curve.
 */
export function calculatePayoffPoints(
  strike: number,
  premium: number,
  lotSize: number,
  lots: number = 1,
  type: 'CE' | 'PE',
  side: 'BUY' | 'SELL',
  minPrice: number,
  maxPrice: number,
  steps: number = 30
): PayoffPoint[] {
  if (side === 'BUY') {
    return type === 'CE'
      ? longCallPayoff(strike, premium, lotSize, lots, minPrice, maxPrice, steps)
      : longPutPayoff(strike, premium, lotSize, lots, minPrice, maxPrice, steps);
  } else {
    return type === 'CE'
      ? shortCallPayoff(strike, premium, lotSize, lots, minPrice, maxPrice, steps)
      : shortPutPayoff(strike, premium, lotSize, lots, minPrice, maxPrice, steps);
  }
}
