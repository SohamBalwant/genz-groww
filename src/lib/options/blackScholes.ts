/**
 * Black-Scholes Pricing & Greeks Engine
 *
 * Implements European option pricing and Greeks (Delta, Gamma, Theta, Vega, Rho)
 * using the standard Black-Scholes-Merton model with normal CDF rational approximations.
 *
 * Conventions:
 * - Spot (S): Price of the underlying asset in INR
 * - Strike (K): Exercise price of the contract in INR
 * - Time to Expiry (T): Time in years (e.g., 7 days = 7 / 365)
 * - Volatility (sigma): Annualized standard deviation of returns (e.g., 0.15 for 15%)
 * - Risk-free Rate (r): Annualized risk-free benchmark yield (e.g., 0.065 for 6.5% RBI repo/G-Sec rate)
 * - Theta (Theta): Normalized to per-calendar-day decay (INR / day)
 * - Vega (Vega): Normalized to 1 percentage point change in IV (INR / 1% IV)
 * - Rho (Rho): Normalized to 1 percentage point change in interest rate (INR / 1% rate)
 */

export interface BlackScholesResult {
  price: number;
  delta: number;
  gamma: number;
  theta: number; // INR per day decay
  vega: number;  // INR per 1% change in IV
  rho: number;   // INR per 1% change in rate
  intrinsicValue: number;
  timeValue: number;
}

/**
 * Standard Normal Probability Density Function (PDF): phi(x)
 */
export function normalPdf(x: number): number {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Standard Normal Cumulative Distribution Function (CDF): Phi(x)
 * Uses high-precision rational Chebyshev approximation (Abramowitz & Stegun formula 26.2.17)
 * Error < 7.5e-8 across all x
 */
export function normalCdf(x: number): number {
  if (isNaN(x)) return 0.5;

  // Handle extreme boundaries
  if (x < -10) return 0;
  if (x > 10) return 1;

  const a1 = 0.319381530;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const p = 0.2316419;

  const k = 1 / (1 + p * Math.abs(x));
  const poly = ((((a5 * k + a4) * k + a3) * k + a2) * k + a1) * k;
  const cdf = 1 - normalPdf(x) * poly;

  return x >= 0 ? cdf : 1 - cdf;
}

/**
 * Calculate Black-Scholes Price and all 5 Greeks for European Options
 */
export function calculateBlackScholes(
  spot: number,
  strike: number,
  timeYears: number,
  volatility: number,
  riskFreeRate: number = 0.065,
  type: 'CE' | 'PE'
): BlackScholesResult {
  // Sanitize inputs
  const S = Math.max(0.01, spot);
  const K = Math.max(0.01, strike);
  const T = Math.max(0, timeYears);
  const sigma = Math.max(0.001, volatility);
  const r = riskFreeRate;

  const intrinsicValue = type === 'CE' ? Math.max(0, S - K) : Math.max(0, K - S);

  // Edge case: At or past expiration (T <= 0 or very small)
  if (T <= 0.0001) {
    let delta = 0;
    if (type === 'CE') {
      delta = S > K ? 1 : S === K ? 0.5 : 0;
    } else {
      delta = S < K ? -1 : S === K ? -0.5 : 0;
    }

    return {
      price: Math.round(intrinsicValue * 100) / 100,
      delta,
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0,
      intrinsicValue: Math.round(intrinsicValue * 100) / 100,
      timeValue: 0,
    };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const nd1 = normalCdf(d1);
  const nd2 = normalCdf(d2);
  const nNegD1 = normalCdf(-d1);
  const nNegD2 = normalCdf(-d2);
  const pdfD1 = normalPdf(d1);

  const discount = Math.exp(-r * T);

  let rawPrice = 0;
  let rawDelta = 0;
  let rawTheta = 0;
  let rawRho = 0;

  if (type === 'CE') {
    rawPrice = S * nd1 - K * discount * nd2;
    rawDelta = nd1;
    // Annualized Theta, then divided by 365 for daily decay
    rawTheta = (-(S * pdfD1 * sigma) / (2 * sqrtT) - r * K * discount * nd2) / 365;
    // Rho per 1% change in interest rate
    rawRho = (K * T * discount * nd2) / 100;
  } else {
    rawPrice = K * discount * nNegD2 - S * nNegD1;
    rawDelta = nd1 - 1; // Negative for puts
    rawTheta = (-(S * pdfD1 * sigma) / (2 * sqrtT) + r * K * discount * nNegD2) / 365;
    rawRho = (-K * T * discount * nNegD2) / 100;
  }

  // Gamma and Vega are identical for Call and Put
  const rawGamma = pdfD1 / (S * sigma * sqrtT);
  // Vega per 1 percentage point change in volatility (0.01 change in sigma)
  const rawVega = (S * sqrtT * pdfD1) / 100;

  // Option price cannot be less than its intrinsic value
  const price = Math.max(intrinsicValue, Math.round(rawPrice * 100) / 100);
  const timeValue = Math.max(0, Math.round((price - intrinsicValue) * 100) / 100);

  return {
    price,
    delta: Math.round(rawDelta * 1000) / 1000,
    gamma: Math.round(rawGamma * 10000) / 10000,
    theta: Math.round(rawTheta * 100) / 100,
    vega: Math.round(rawVega * 100) / 100,
    rho: Math.round(rawRho * 100) / 100,
    intrinsicValue: Math.round(intrinsicValue * 100) / 100,
    timeValue,
  };
}

/**
 * Convenience helper to calculate options metrics using Days to Expiration (DTE)
 * and IV in percentage format (e.g., ivPct = 15 for 15%).
 */
export function calculateFromDte(
  spot: number,
  strike: number,
  dteDays: number,
  ivPct: number,
  type: 'CE' | 'PE',
  riskFreeRate: number = 0.065
): BlackScholesResult {
  const timeYears = Math.max(0, dteDays) / 365;
  const volatility = Math.max(1, ivPct) / 100;
  return calculateBlackScholes(spot, strike, timeYears, volatility, riskFreeRate, type);
}

/**
 * Calculate Max Pain strike from option chain rows.
 * Max Pain is the strike at which option buyers lose the maximum amount of money,
 * or equivalently, where total option payouts by sellers are minimized at expiry.
 */
export interface OptionChainStrikeData {
  strike: number;
  callOi: number;
  putOi: number;
}

export function calculateMaxPain(strikesData: OptionChainStrikeData[]): {
  maxPainStrike: number;
  totalPayoutAtMaxPain: number;
  payoutsByStrike: Record<number, number>;
} {
  if (!strikesData || strikesData.length === 0) {
    return { maxPainStrike: 0, totalPayoutAtMaxPain: 0, payoutsByStrike: {} };
  }

  const payoutsByStrike: Record<number, number> = {};
  let minPayout = Infinity;
  let maxPainStrike = strikesData[0].strike;

  for (const candidate of strikesData) {
    const settlement = candidate.strike;
    let totalPayout = 0;

    for (const row of strikesData) {
      // Call payout if settlement > strike
      if (settlement > row.strike) {
        totalPayout += (settlement - row.strike) * row.callOi;
      }
      // Put payout if settlement < strike
      if (settlement < row.strike) {
        totalPayout += (row.strike - settlement) * row.putOi;
      }
    }

    payoutsByStrike[settlement] = totalPayout;
    if (totalPayout < minPayout) {
      minPayout = totalPayout;
      maxPainStrike = settlement;
    }
  }

  return {
    maxPainStrike,
    totalPayoutAtMaxPain: minPayout,
    payoutsByStrike,
  };
}

/**
 * Calculate Put-Call Ratio (PCR) based on Open Interest.
 * PCR = Total Put OI / Total Call OI.
 */
export function calculatePcr(strikesData: OptionChainStrikeData[]): {
  pcr: number;
  totalCallOi: number;
  totalPutOi: number;
  interpretation: string;
} {
  const totalCallOi = strikesData.reduce((acc, s) => acc + s.callOi, 0);
  const totalPutOi = strikesData.reduce((acc, s) => acc + s.putOi, 0);

  const pcr = totalCallOi > 0 ? Math.round((totalPutOi / totalCallOi) * 100) / 100 : 1;

  let interpretation = 'Neutral';
  if (pcr > 1.3) {
    interpretation = 'Bullish Support (Heavy Put Writing)';
  } else if (pcr > 1.0) {
    interpretation = 'Mildly Bullish / Constructive';
  } else if (pcr < 0.7) {
    interpretation = 'Bearish Pressure (Heavy Call Writing)';
  } else if (pcr < 0.9) {
    interpretation = 'Cautious / Mildly Bearish';
  }

  return {
    pcr,
    totalCallOi,
    totalPutOi,
    interpretation,
  };
}
