import { CURRENCIES, CurrencyCode, DiscountType, GstCalculationMode, GstType, Receipt, ReceiptItem } from '@/types';

/**
 * Rounds a number to exactly two decimal places, avoiding binary floating point quirks.
 */
export function round2(value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Formats a monetary value according to currency rules.
 */
export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'INR'): string {
  const safeAmount = isNaN(amount) ? 0 : round2(amount);
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);

    return `${config.symbol} ${formatted}`;
  } catch {
    return `${config.symbol} ${safeAmount.toFixed(2)}`;
  }
}

/**
 * Calculates item totals and returns a clean copy of items
 */
export function calculateItemTotal(quantity: number, unitPrice: number): number {
  const q = Math.max(0, isNaN(quantity) ? 0 : quantity);
  const p = Math.max(0, isNaN(unitPrice) ? 0 : unitPrice);
  return round2(q * p);
}

export interface CalculationInput {
  items: ReceiptItem[];
  discountType: DiscountType;
  discountValue: number;
  isGstEnabled: boolean;
  gstMode: GstCalculationMode;
  gstType: GstType;
  gstRate: number;
  generalTaxRate: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'pending' | 'partially_paid';
}

export interface CalculationResult {
  items: ReceiptItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  generalTaxAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
}

/**
 * Complete, accurate computation engine for receipts
 */
export function calculateReceiptTotals(input: CalculationInput): CalculationResult {
  // 1. Calculate each item's total & subtotal
  const processedItems = input.items.map((item) => {
    const total = calculateItemTotal(item.quantity, item.unitPrice);
    return {
      ...item,
      total,
    };
  });

  const subtotal = round2(
    processedItems.reduce((sum, item) => sum + (item.total || 0), 0)
  );

  // 2. Calculate Discount
  let discountAmount = 0;
  const rawDiscount = Math.max(0, isNaN(input.discountValue) ? 0 : input.discountValue);

  if (input.discountType === 'percentage') {
    const safePercent = Math.min(100, rawDiscount);
    discountAmount = round2((subtotal * safePercent) / 100);
  } else {
    discountAmount = round2(Math.min(subtotal, rawDiscount));
  }

  // 3. Taxable Amount
  const taxableAmount = Math.max(0, round2(subtotal - discountAmount));

  // 4. Tax / GST Calculation
  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let generalTaxAmount = 0;
  let totalTaxAmount = 0;
  let grandTotal = 0;

  if (input.isGstEnabled) {
    const rate = Math.max(0, Math.min(100, isNaN(input.gstRate) ? 0 : input.gstRate));

    if (input.gstMode === 'inclusive') {
      // GST is inclusive in taxableAmount
      // Base amount = taxableAmount / (1 + rate / 100)
      // Total GST = taxableAmount - Base amount
      const baseAmount = rate > 0 ? round2(taxableAmount / (1 + rate / 100)) : taxableAmount;
      const gstTax = round2(taxableAmount - baseAmount);
      totalTaxAmount = gstTax;
      grandTotal = taxableAmount;

      if (input.gstType === 'cgst_sgst') {
        cgstRate = round2(rate / 2);
        sgstRate = round2(rate / 2);
        cgstAmount = round2(gstTax / 2);
        sgstAmount = round2(gstTax - cgstAmount); // Exact sum
      } else {
        igstRate = rate;
        igstAmount = gstTax;
      }
    } else {
      // GST is exclusive (added on top)
      const gstTax = round2((taxableAmount * rate) / 100);
      totalTaxAmount = gstTax;
      grandTotal = round2(taxableAmount + totalTaxAmount);

      if (input.gstType === 'cgst_sgst') {
        cgstRate = round2(rate / 2);
        sgstRate = round2(rate / 2);
        cgstAmount = round2(gstTax / 2);
        sgstAmount = round2(gstTax - cgstAmount);
      } else {
        igstRate = rate;
        igstAmount = gstTax;
      }
    }
  } else {
    // Non-GST general tax
    const genRate = Math.max(0, Math.min(100, isNaN(input.generalTaxRate) ? 0 : input.generalTaxRate));
    generalTaxAmount = round2((taxableAmount * genRate) / 100);
    totalTaxAmount = generalTaxAmount;
    grandTotal = round2(taxableAmount + totalTaxAmount);
  }

  // 5. Payment & Balance Due
  let amountPaid = Math.max(0, isNaN(input.amountPaid) ? 0 : input.amountPaid);

  if (input.paymentStatus === 'paid') {
    amountPaid = grandTotal;
  } else if (input.paymentStatus === 'pending') {
    amountPaid = 0;
  } else {
    // partially_paid
    amountPaid = Math.min(grandTotal, amountPaid);
  }

  const balanceDue = Math.max(0, round2(grandTotal - amountPaid));

  return {
    items: processedItems,
    subtotal,
    discountAmount,
    taxableAmount,
    cgstRate,
    sgstRate,
    igstRate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    generalTaxAmount,
    totalTaxAmount,
    grandTotal,
    amountPaid,
    balanceDue,
  };
}
