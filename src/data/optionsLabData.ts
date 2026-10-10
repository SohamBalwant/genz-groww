import type { OptionChainData, OptionChainRow } from '../types';
import {
  calculateFromDte,
  calculateMaxPain,
  calculatePcr,
  type OptionChainStrikeData,
} from '../lib/options/blackScholes';

export interface SupportedOptionInstrument {
  id: string;
  symbol: string;
  name: string;
  type: 'INDEX' | 'STOCK';
  spot: number;
  change: number;
  changePct: number;
  lotSize: number;
  strikeStep: number;
  baseIv: number; // in %
  expiries: string[];
  expiryDtes: Record<string, number>;
  description: string;
}

export const SUPPORTED_OPTION_INSTRUMENTS: SupportedOptionInstrument[] = [
  {
    id: 'index-nifty50',
    symbol: 'NIFTY 50',
    name: 'NIFTY 50 Benchmark Index',
    type: 'INDEX',
    spot: 24850.25,
    change: 112.40,
    changePct: 0.45,
    lotSize: 25,
    strikeStep: 50,
    baseIv: 13.5,
    expiries: ['27-Mar-2025', '03-Apr-2025', '10-Apr-2025', '24-Apr-2025'],
    expiryDtes: {
      '27-Mar-2025': 12,
      '03-Apr-2025': 19,
      '10-Apr-2025': 26,
      '24-Apr-2025': 40,
    },
    description: "India's headline equity benchmark comprising 50 bluechip companies across 13 sectors.",
  },
  {
    id: 'index-banknifty',
    symbol: 'BANKNIFTY',
    name: 'Nifty Bank Index',
    type: 'INDEX',
    spot: 52410.80,
    change: 480.20,
    changePct: 0.92,
    lotSize: 15,
    strikeStep: 100,
    baseIv: 15.8,
    expiries: ['27-Mar-2025', '02-Apr-2025', '09-Apr-2025', '24-Apr-2025'],
    expiryDtes: {
      '27-Mar-2025': 12,
      '02-Apr-2025': 18,
      '09-Apr-2025': 25,
      '24-Apr-2025': 40,
    },
    description: '12 liquid and large-cap Indian banking stocks representing the banking sector pulse.',
  },
  {
    id: 'index-finnifty',
    symbol: 'FINNIFTY',
    name: 'Nifty Financial Services',
    type: 'INDEX',
    spot: 23650.40,
    change: 145.30,
    changePct: 0.62,
    lotSize: 25,
    strikeStep: 50,
    baseIv: 14.2,
    expiries: ['25-Mar-2025', '01-Apr-2025', '29-Apr-2025'],
    expiryDtes: {
      '25-Mar-2025': 10,
      '01-Apr-2025': 17,
      '29-Apr-2025': 45,
    },
    description: 'Financial institutions including banks, NBFCs, insurance, and housing finance.',
  },
  {
    id: 'stock-srphrm',
    symbol: 'SRPHRM',
    name: 'SunRise Pharma Ltd',
    type: 'STOCK',
    spot: 1520.00,
    change: 18.80,
    changePct: 1.25,
    lotSize: 250,
    strikeStep: 20,
    baseIv: 24.5,
    expiries: ['27-Mar-2025', '24-Apr-2025', '29-May-2025'],
    expiryDtes: {
      '27-Mar-2025': 12,
      '24-Apr-2025': 40,
      '29-May-2025': 75,
    },
    description: 'High-beta pharmaceutical leader with robust F&O derivatives participation.',
  },
  {
    id: 'stock-ifbl',
    symbol: 'IFBL',
    name: 'IndiaFirst Bank Ltd',
    type: 'STOCK',
    spot: 1680.50,
    change: 35.40,
    changePct: 2.15,
    lotSize: 300,
    strikeStep: 20,
    baseIv: 22.0,
    expiries: ['27-Mar-2025', '24-Apr-2025'],
    expiryDtes: {
      '27-Mar-2025': 12,
      '24-Apr-2025': 40,
    },
    description: 'Major private sector bank with high retail derivative liquidity.',
  },
];

/**
 * Generates mathematically consistent option chains based on Black-Scholes pricing
 * and realistic Indian market open interest distribution.
 */
export function generateOptionChain(
  instrument: SupportedOptionInstrument,
  expiry: string
): OptionChainData {
  const dte = instrument.expiryDtes[expiry] ?? 12;
  const spot = instrument.spot;
  const step = instrument.strikeStep;
  const baseIv = instrument.baseIv;

  // Find nearest rounded ATM strike
  const atmStrike = Math.round(spot / step) * step;

  // Generate 15 strikes spanning -7 to +7 steps around ATM
  const numStepsEachSide = 8;
  const rows: OptionChainRow[] = [];
  const strikesDataForMetrics: OptionChainStrikeData[] = [];

  for (let i = -numStepsEachSide; i <= numStepsEachSide; i++) {
    const strike = atmStrike + i * step;
    if (strike <= 0) continue;

    // Volatility smile: OTM puts and OTM calls typically trade at slight IV premium
    const distanceFraction = Math.abs(strike - spot) / spot;
    const ivSkew = distanceFraction * 8; // Slight smile curvature
    const ceIv = Math.round((baseIv + (strike > spot ? ivSkew * 0.5 : ivSkew * 0.8)) * 10) / 10;
    const peIv = Math.round((baseIv + (strike < spot ? ivSkew * 1.0 : ivSkew * 0.4)) * 10) / 10;

    // Black-Scholes calculations
    const bsCe = calculateFromDte(spot, strike, dte, ceIv, 'CE');
    const bsPe = calculateFromDte(spot, strike, dte, peIv, 'PE');

    // Realistic Open Interest & Volume distributions
    // Major round strikes (e.g. ending in 000 or 500) have heavier OI
    const isMajorRound = strike % (step * 5) === 0;
    const isRound = strike % (step * 2) === 0;
    const roundMultiplier = isMajorRound ? 2.2 : isRound ? 1.5 : 1.0;

    // Distribution factor peaks around ATM / near-OTM resistance/support
    const ceDistribution = Math.exp(-Math.pow((strike - (spot + step * 2)) / (step * 5), 2));
    const peDistribution = Math.exp(-Math.pow((strike - (spot - step * 2)) / (step * 5), 2));

    const baseUnitOi = instrument.type === 'INDEX' ? 180000 : 45000;
    const baseUnitVol = instrument.type === 'INDEX' ? 35000 : 8000;

    const ceOi = Math.round(baseUnitOi * (0.3 + ceDistribution * 1.5) * roundMultiplier);
    const peOi = Math.round(baseUnitOi * (0.3 + peDistribution * 1.5) * roundMultiplier);

    const ceVol = Math.round(baseUnitVol * (0.2 + ceDistribution * 1.8));
    const peVol = Math.round(baseUnitVol * (0.2 + peDistribution * 1.8));

    // Simulated 1D change based on underlying move and delta
    const underlyingMove = instrument.change;
    const ceChangePct = Math.round(((underlyingMove * bsCe.delta) / Math.max(1, bsCe.price)) * 100 * 10) / 10;
    const peChangePct = Math.round(((underlyingMove * bsPe.delta) / Math.max(1, bsPe.price)) * 100 * 10) / 10;

    // Bid/Ask spread (tight for ATM, wider for illiquid deep OTM)
    const spreadPct = Math.max(0.002, 0.005 + distanceFraction * 0.05);
    const ceHalfSpread = Math.max(0.05, Math.round(bsCe.price * spreadPct * 100) / 100);
    const peHalfSpread = Math.max(0.05, Math.round(bsPe.price * spreadPct * 100) / 100);

    const ceBid = Math.max(0.05, Math.round((bsCe.price - ceHalfSpread) * 100) / 100);
    const ceAsk = Math.round((bsCe.price + ceHalfSpread) * 100) / 100;
    const peBid = Math.max(0.05, Math.round((bsPe.price - peHalfSpread) * 100) / 100);
    const peAsk = Math.round((bsPe.price + peHalfSpread) * 100) / 100;

    rows.push({
      strike,
      ce: {
        strike,
        type: 'CE',
        ltp: bsCe.price,
        changePct: ceChangePct,
        volume: ceVol,
        oi: ceOi,
        iv: ceIv,
        delta: bsCe.delta,
        gamma: bsCe.gamma,
        theta: bsCe.theta,
        vega: bsCe.vega,
        rho: bsCe.rho,
        bid: ceBid,
        ask: ceAsk,
      },
      pe: {
        strike,
        type: 'PE',
        ltp: bsPe.price,
        changePct: peChangePct,
        volume: peVol,
        oi: peOi,
        iv: peIv,
        delta: bsPe.delta,
        gamma: bsPe.gamma,
        theta: bsPe.theta,
        vega: bsPe.vega,
        rho: bsPe.rho,
        bid: peBid,
        ask: peAsk,
      },
    });

    strikesDataForMetrics.push({
      strike,
      callOi: ceOi,
      putOi: peOi,
    });
  }

  return {
    underlyingId: instrument.id,
    underlyingSymbol: instrument.symbol,
    underlyingName: instrument.name,
    spot: instrument.spot,
    change: instrument.change,
    changePct: instrument.changePct,
    expiries: instrument.expiries,
    lotSize: instrument.lotSize,
    asOf: '2025-03-15T15:30:00.000Z',
    assumptions: `Black-Scholes-Merton model with RBI repo rate benchmark (6.5%) and volatility smile estimates for ${instrument.symbol}. DTE: ${dte} days.`,
    rows,
    isDemo: true,
  };
}

/**
 * Get Market Summary Analytics (PCR, Max Pain, Total OI) for a given option chain
 */
export function getChainAnalytics(chain: OptionChainData) {
  const strikesData: OptionChainStrikeData[] = chain.rows.map((r) => ({
    strike: r.strike,
    callOi: r.ce.oi,
    putOi: r.pe.oi,
  }));

  const maxPain = calculateMaxPain(strikesData);
  const pcr = calculatePcr(strikesData);

  // Find ATM strike (nearest to spot)
  let minDiff = Infinity;
  let atmStrike = chain.rows[0]?.strike ?? 0;
  for (const r of chain.rows) {
    const diff = Math.abs(r.strike - chain.spot);
    if (diff < minDiff) {
      minDiff = diff;
      atmStrike = r.strike;
    }
  }

  return {
    maxPainStrike: maxPain.maxPainStrike,
    pcr: pcr.pcr,
    totalCallOi: pcr.totalCallOi,
    totalPutOi: pcr.totalPutOi,
    pcrInterpretation: pcr.interpretation,
    atmStrike,
    spotDistanceToAtm: Math.round((chain.spot - atmStrike) * 100) / 100,
  };
}
