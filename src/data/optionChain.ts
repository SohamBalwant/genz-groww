import type { OptionChainData } from '../types';

export const MOCK_OPTION_CHAIN: OptionChainData = {
  underlyingId: 'stock-srphrm',
  spot: 1520.0,
  lotSize: 250,
  expiries: ['27-Mar-2025', '24-Apr-2025', '29-May-2025'],
  asOf: '2025-03-15T15:30:00.000Z',
  assumptions: 'Static illustrative values for educational demonstration. Greeks and premiums are sample estimates; not derived from a live pricing model.',
  isDemo: true,
  rows: [
    {
      strike: 1300,
      ce: { strike: 1300, type: 'CE', ltp: 226.50, changePct: 2.4, volume: 1450, oi: 28400, delta: 0.94, gamma: 0.0008, theta: -1.2 },
      pe: { strike: 1300, type: 'PE', ltp: 4.80, changePct: -18.2, volume: 820, oi: 45000, delta: -0.06, gamma: 0.0008, theta: -1.1 },
    },
    {
      strike: 1350,
      ce: { strike: 1350, type: 'CE', ltp: 178.00, changePct: 2.1, volume: 2100, oi: 34200, delta: 0.89, gamma: 0.0012, theta: -1.5 },
      pe: { strike: 1350, type: 'PE', ltp: 7.20, changePct: -15.4, volume: 1250, oi: 52000, delta: -0.11, gamma: 0.0012, theta: -1.4 },
    },
    {
      strike: 1400,
      ce: { strike: 1400, type: 'CE', ltp: 132.50, changePct: 1.8, volume: 4800, oi: 68500, delta: 0.82, gamma: 0.0018, theta: -2.1 },
      pe: { strike: 1400, type: 'PE', ltp: 11.50, changePct: -12.1, volume: 2900, oi: 76000, delta: -0.18, gamma: 0.0018, theta: -1.9 },
    },
    {
      strike: 1450,
      ce: { strike: 1450, type: 'CE', ltp: 89.20, changePct: 1.5, volume: 8500, oi: 112000, delta: 0.72, gamma: 0.0026, theta: -2.8 },
      pe: { strike: 1450, type: 'PE', ltp: 19.40, changePct: -8.5, volume: 6400, oi: 94000, delta: -0.28, gamma: 0.0026, theta: -2.5 },
    },
    {
      strike: 1480,
      ce: { strike: 1480, type: 'CE', ltp: 66.00, changePct: 1.2, volume: 11200, oi: 135000, delta: 0.63, gamma: 0.0032, theta: -3.4 },
      pe: { strike: 1480, type: 'PE', ltp: 26.80, changePct: -6.2, volume: 9800, oi: 118000, delta: -0.37, gamma: 0.0032, theta: -3.1 },
    },
    {
      strike: 1500,
      ce: { strike: 1500, type: 'CE', ltp: 52.50, changePct: 0.9, volume: 18500, oi: 210000, delta: 0.56, gamma: 0.0038, theta: -3.9 },
      pe: { strike: 1500, type: 'PE', ltp: 33.20, changePct: -4.1, volume: 15400, oi: 185000, delta: -0.44, gamma: 0.0038, theta: -3.6 },
    },
    {
      strike: 1520, // ATM strike! Nearest to spot 1520
      ce: { strike: 1520, type: 'CE', ltp: 40.10, changePct: 0.2, volume: 24500, oi: 285000, delta: 0.50, gamma: 0.0042, theta: -4.2 },
      pe: { strike: 1520, type: 'PE', ltp: 40.80, changePct: -0.5, volume: 22800, oi: 265000, delta: -0.50, gamma: 0.0042, theta: -4.1 },
    },
    {
      strike: 1550,
      ce: { strike: 1550, type: 'CE', ltp: 25.40, changePct: -3.8, volume: 16200, oi: 195000, delta: 0.38, gamma: 0.0035, theta: -3.7 },
      pe: { strike: 1550, type: 'PE', ltp: 55.60, changePct: 2.8, volume: 11500, oi: 145000, delta: -0.62, gamma: 0.0035, theta: -3.6 },
    },
    {
      strike: 1600,
      ce: { strike: 1600, type: 'CE', ltp: 11.20, changePct: -9.5, volume: 9800, oi: 142000, delta: 0.22, gamma: 0.0024, theta: -2.7 },
      pe: { strike: 1600, type: 'PE', ltp: 91.00, changePct: 5.4, volume: 5400, oi: 88000, delta: -0.78, gamma: 0.0024, theta: -2.8 },
    },
    {
      strike: 1650,
      ce: { strike: 1650, type: 'CE', ltp: 4.80, changePct: -16.2, volume: 4200, oi: 86000, delta: 0.11, gamma: 0.0014, theta: -1.8 },
      pe: { strike: 1650, type: 'PE', ltp: 134.50, changePct: 8.2, volume: 2800, oi: 46000, delta: -0.89, gamma: 0.0014, theta: -1.9 },
    },
    {
      strike: 1700,
      ce: { strike: 1700, type: 'CE', ltp: 2.10, changePct: -25.0, volume: 2100, oi: 52000, delta: 0.05, gamma: 0.0008, theta: -1.1 },
      pe: { strike: 1700, type: 'PE', ltp: 181.20, changePct: 10.5, volume: 1100, oi: 28000, delta: -0.95, gamma: 0.0008, theta: -1.2 },
    },
  ],
};
