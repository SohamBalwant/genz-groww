/**
 * Utility functions for formatting currency, percentages, numbers, and dates.
 * Enforces Indian number formatting standards (Lakh/Crore) and IST timestamps.
 */

export function formatINR(amount: number | null | undefined, compact: boolean = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) {
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) {
      return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)} K`;
    }
    return `${sign}₹${abs.toFixed(2)}`;
  }

  // Standard Indian comma grouping
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const parts = absAmount.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian format: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherDigits = integerPart.substring(0, integerPart.length - 3);
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    integerPart = formattedOther + ',' + lastThree;
  }

  return `${isNegative ? '-' : ''}₹${integerPart}.${decimalPart}`;
}

export function formatLakhCrore(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(2)} Crore`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

export function formatPercent(
  pct: number | null | undefined,
  decimals: number = 2,
  includeArrow: boolean = true
): string {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return '0.00%';
  }

  const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
  const arrow = includeArrow ? (pct > 0 ? '▲ ' : pct < 0 ? '▼ ' : '') : '';
  const absVal = Math.abs(pct).toFixed(decimals);

  return `${arrow}${sign}${absVal}%`;
}

export function formatDate(
  isoString: string,
  options?: { relative?: boolean; includeTime?: boolean }
): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString;
    }

    if (options?.relative) {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return `${diffMins}m ago`;
      }
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      if (diffDays === 1) {
        return 'Yesterday';
      }
      if (diffDays < 7) {
        return `${diffDays}d ago`;
      }
    }

    // Explicit IST output format
    const formatted = date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    if (options?.includeTime) {
      const time = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
      return `${formatted}, ${time} IST`;
    }

    return formatted;
  } catch {
    return isoString;
  }
}

export function formatDateIST(isoString: string): string {
  return formatDate(isoString, { includeTime: true });
}

/**
 * Formats ISO string into clean 24-hour clock date string without AM/PM or timezone label.
 * Example: "14 Mar 2025, 16:05"
 */
export function formatDate24h(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString;
    }

    const formattedDate = date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });

    return `${formattedDate}, ${time}`;
  } catch {
    return isoString;
  }
}

export const formatPct = formatPercent;

export function formatPeriodLabel(period: string): string {
  if (!period) return '';
  return period.toUpperCase();
}
