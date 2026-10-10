export type Moneyness = 'ITM' | 'ATM' | 'OTM';

/**
 * Calculates moneyness for options contracts.
 * Call (CE):
 *   Strike < Spot => In the Money (ITM)
 *   Strike > Spot => Out of the Money (OTM)
 * Put (PE):
 *   Strike > Spot => In the Money (ITM)
 *   Strike < Spot => Out of the Money (OTM)
 * ATM: Nearest strike to spot or within a tight threshold.
 */
export function getMoneyness(
  strike: number,
  spot: number,
  type: 'CE' | 'PE',
  isNearestStrike: boolean = false
): Moneyness {
  if (isNearestStrike || Math.abs(strike - spot) <= 5) {
    return 'ATM';
  }

  if (type === 'CE') {
    return strike < spot ? 'ITM' : 'OTM';
  } else {
    return strike > spot ? 'ITM' : 'OTM';
  }
}

export function getMoneynessLabel(m: Moneyness): string {
  switch (m) {
    case 'ITM':
      return 'In the Money (ITM)';
    case 'ATM':
      return 'At the Money (ATM)';
    case 'OTM':
      return 'Out of the Money (OTM)';
  }
}

export function getMoneynessBadgeClass(m: Moneyness): string {
  switch (m) {
    case 'ITM':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
    case 'ATM':
      return 'bg-primary-100 text-primary-800 border-primary-300 font-bold';
    case 'OTM':
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}
