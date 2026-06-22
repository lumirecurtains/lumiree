/**
 * Formats a number as Indian Rupee (INR) with proper comma placement
 * Example: 125000 -> ₹1,25,000
 */
export const formatINR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CURRENCY_SYMBOL = '₹';
