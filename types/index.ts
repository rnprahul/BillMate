export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SGD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound', locale: 'en-GB' },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'CAD ($) - Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', label: 'AUD ($) - Australian Dollar', locale: 'en-AU' },
  SGD: { code: 'SGD', symbol: 'S$', label: 'SGD ($) - Singapore Dollar', locale: 'en-SG' },
  AED: { code: 'AED', symbol: 'AED', label: 'AED (د.إ) - UAE Dirham', locale: 'en-AE' },
};

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque' | 'other';

export const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card (Credit/Debit)' },
  { id: 'upi', label: 'UPI / QR' },
  { id: 'bank_transfer', label: 'Bank Transfer (NEFT/RTGS/IMPS)' },
  { id: 'cheque', label: 'Cheque' },
  { id: 'other', label: 'Other' },
];

export type PaymentStatus = 'paid' | 'pending' | 'partially_paid';

export const PAYMENT_STATUSES: { id: PaymentStatus; label: string; color: string }[] = [
  { id: 'paid', label: 'Paid', color: 'emerald' },
  { id: 'pending', label: 'Pending', color: 'amber' },
  { id: 'partially_paid', label: 'Partially Paid', color: 'blue' },
];

export type DiscountType = 'percentage' | 'fixed';
export type GstCalculationMode = 'exclusive' | 'inclusive';
export type GstType = 'cgst_sgst' | 'igst';
export type ReceiptTemplate = 'classic' | 'modern' | 'minimal';
export type ReceiptSize = 'a4' | 'thermal';

export interface ReceiptItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // in percentage (0 to 100)
  total: number; // Calculated: qty * unitPrice
}

export interface BusinessProfile {
  name: string;
  logo?: string; // base64 or URL
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  gstin?: string;
}

export interface CustomerInfo {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface Customer extends CustomerInfo {
  id: string;
  totalSpent: number;
  receiptCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  currency: CurrencyCode;
  
  // Business details
  business: BusinessProfile;
  
  // Customer details
  customer: CustomerInfo;
  
  // Line items
  items: ReceiptItem[];
  
  // Calculations
  subtotal: number;
  
  // Discount
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  
  // Taxes / GST
  taxableAmount: number;
  isGstEnabled: boolean;
  gstMode: GstCalculationMode;
  gstType: GstType;
  gstRate: number; // e.g. 18 for 18%
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  generalTaxRate: number; // For non-GST users
  generalTaxAmount: number;
  totalTaxAmount: number;
  
  // Final
  grandTotal: number;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  balanceDue: number;
  
  // Notes & terms
  notes?: string;
  terms?: string;
  
  // Styling
  template: ReceiptTemplate;
  size: ReceiptSize;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultTemplate: ReceiptTemplate;
  defaultSize: ReceiptSize;
  defaultCurrency: CurrencyCode;
  defaultTaxRate: number;
  defaultPaymentMethod: PaymentMethod;
  receiptPrefix: string;
  nextReceiptNumber: number;
  savedBusiness: BusinessProfile;
  useSavedBusinessByDefault: boolean;
  defaultNotes?: string;
  defaultTerms?: string;
}
