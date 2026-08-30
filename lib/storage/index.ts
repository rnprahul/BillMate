import { AppSettings, Customer, Receipt } from '@/types';

const STORAGE_KEYS = {
  RECEIPTS: 'billmate_receipts_v1',
  CUSTOMERS: 'billmate_customers_v1',
  SETTINGS: 'billmate_settings_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultTemplate: 'modern',
  defaultSize: 'a4',
  defaultCurrency: 'INR',
  defaultTaxRate: 18,
  defaultPaymentMethod: 'upi',
  receiptPrefix: 'REC-',
  nextReceiptNumber: 1001,
  savedBusiness: {
    name: 'Apex Design & Tech Labs',
    phone: '+91 98765 43210',
    email: 'billing@apexdesign.io',
    website: 'https://apexdesign.io',
    address: 'Suite 402, Cyber Tower, Silicon Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
    gstin: '29ABCDE1234F1Z5',
  },
  useSavedBusinessByDefault: true,
  defaultNotes: 'Thank you for choosing BillMate! We appreciate your business.',
  defaultTerms: 'Payment due within 15 days of issue. In case of queries, please contact billing support.',
};

const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '+91 91234 56789',
    email: 'rahul.sharma@example.com',
    address: 'Flat 12B, Green Heights, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    totalSpent: 42480,
    receiptCount: 2,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    phone: '+91 98987 65432',
    email: 'priya.patel@acmeconsulting.in',
    address: 'B-304, Sapphire Corporate Park, BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    totalSpent: 88500,
    receiptCount: 1,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'cust-3',
    name: 'Alex Vance',
    phone: '+1 (555) 234-5678',
    email: 'alex@novasoft.dev',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94107',
    totalSpent: 0,
    receiptCount: 0,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const SAMPLE_RECEIPTS: Receipt[] = [
  {
    id: 'rec-1001',
    receiptNumber: 'REC-1001',
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    time: '14:30',
    currency: 'INR',
    business: {
      name: 'Apex Design & Tech Labs',
      phone: '+91 98765 43210',
      email: 'billing@apexdesign.io',
      website: 'https://apexdesign.io',
      address: 'Suite 402, Cyber Tower, Silicon Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      gstin: '29ABCDE1234F1Z5',
    },
    customer: {
      id: 'cust-2',
      name: 'Priya Patel',
      phone: '+91 98987 65432',
      email: 'priya.patel@acmeconsulting.in',
      address: 'B-304, Sapphire Corporate Park, BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400051',
    },
    items: [
      {
        id: 'item-1',
        name: 'Brand Identity & Web UI Design System',
        description: 'Complete Figma design system with components and interactive prototype',
        quantity: 1,
        unitPrice: 50000,
        taxRate: 18,
        total: 50000,
      },
      {
        id: 'item-2',
        name: 'Next.js Frontend Architecture & Setup',
        description: 'Production-ready responsive web application frontend setup with TypeScript',
        quantity: 1,
        unitPrice: 25000,
        taxRate: 18,
        total: 25000,
      },
    ],
    subtotal: 75000,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxableAmount: 75000,
    isGstEnabled: true,
    gstMode: 'exclusive',
    gstType: 'igst',
    gstRate: 18,
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 13500,
    generalTaxRate: 0,
    generalTaxAmount: 0,
    totalTaxAmount: 13500,
    grandTotal: 88500,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    amountPaid: 88500,
    balanceDue: 0,
    notes: 'Thank you for partnering with Apex Design!',
    terms: 'All deliverables are covered under warranty for 30 days.',
    template: 'modern',
    size: 'a4',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'rec-1002',
    receiptNumber: 'REC-1002',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    time: '11:15',
    currency: 'INR',
    business: {
      name: 'Apex Design & Tech Labs',
      phone: '+91 98765 43210',
      email: 'billing@apexdesign.io',
      website: 'https://apexdesign.io',
      address: 'Suite 402, Cyber Tower, Silicon Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      gstin: '29ABCDE1234F1Z5',
    },
    customer: {
      id: 'cust-1',
      name: 'Rahul Sharma',
      phone: '+91 91234 56789',
      email: 'rahul.sharma@example.com',
      address: 'Flat 12B, Green Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
    },
    items: [
      {
        id: 'item-3',
        name: 'Cloud Infrastructure Audit & Optimization',
        description: 'AWS performance tuning and serverless cost reduction',
        quantity: 1,
        unitPrice: 36000,
        taxRate: 18,
        total: 36000,
      },
    ],
    subtotal: 36000,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxableAmount: 36000,
    isGstEnabled: true,
    gstMode: 'exclusive',
    gstType: 'cgst_sgst',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    cgstAmount: 3240,
    sgstAmount: 3240,
    igstAmount: 0,
    generalTaxRate: 0,
    generalTaxAmount: 0,
    totalTaxAmount: 6480,
    grandTotal: 42480,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    amountPaid: 42480,
    balanceDue: 0,
    notes: 'Thank you for your business!',
    terms: 'Support included for 14 days.',
    template: 'classic',
    size: 'a4',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rec-1003',
    receiptNumber: 'REC-1003',
    date: new Date().toISOString().split('T')[0],
    time: '16:45',
    currency: 'INR',
    business: {
      name: 'Apex Design & Tech Labs',
      phone: '+91 98765 43210',
      email: 'billing@apexdesign.io',
      website: 'https://apexdesign.io',
      address: 'Suite 402, Cyber Tower, Silicon Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      gstin: '29ABCDE1234F1Z5',
    },
    customer: {
      name: 'Global Tech Retailer',
      phone: '+91 99887 76655',
      email: 'orders@globaltech.com',
    },
    items: [
      {
        id: 'item-4',
        name: 'Thermal POS Receipt Printer Setup',
        description: 'Hardware configuration & test roll',
        quantity: 2,
        unitPrice: 4500,
        taxRate: 18,
        total: 9000,
      },
      {
        id: 'item-5',
        name: 'Barcode Scanner Handheld 2D',
        description: 'High-speed wireless scanner with charging cradle',
        quantity: 2,
        unitPrice: 3200,
        taxRate: 18,
        total: 6400,
      },
    ],
    subtotal: 15400,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 1540,
    taxableAmount: 13860,
    isGstEnabled: true,
    gstMode: 'exclusive',
    gstType: 'cgst_sgst',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 0,
    cgstAmount: 1247.4,
    sgstAmount: 1247.4,
    igstAmount: 0,
    generalTaxRate: 0,
    generalTaxAmount: 0,
    totalTaxAmount: 2494.8,
    grandTotal: 16354.8,
    paymentMethod: 'card',
    paymentStatus: 'partially_paid',
    amountPaid: 10000,
    balanceDue: 6354.8,
    notes: 'Partial payment received. Balance due on final delivery.',
    terms: 'Standard hardware return policy within 7 days.',
    template: 'minimal',
    size: 'thermal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeGetItem<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): boolean {
  if (!isClient()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
}

export const StorageService = {
  initialize() {
    if (!isClient()) return;
    
    // Seed initial settings if missing
    if (!window.localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      safeSetItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    
    // Seed sample customers and receipts if completely new
    if (!window.localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
      safeSetItem(STORAGE_KEYS.RECEIPTS, SAMPLE_RECEIPTS);
    }
    
    if (!window.localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      safeSetItem(STORAGE_KEYS.CUSTOMERS, SAMPLE_CUSTOMERS);
    }
  },

  getSettings(): AppSettings {
    const settings = safeGetItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...settings };
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    safeSetItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  getReceipts(): Receipt[] {
    return safeGetItem<Receipt[]>(STORAGE_KEYS.RECEIPTS, SAMPLE_RECEIPTS);
  },

  getReceiptById(id: string): Receipt | null {
    const receipts = this.getReceipts();
    return receipts.find((r) => r.id === id) || null;
  },

  getNextReceiptNumber(): string {
    const settings = this.getSettings();
    const prefix = settings.receiptPrefix || 'REC-';
    const num = settings.nextReceiptNumber || 1001;
    return `${prefix}${num}`;
  },

  saveReceipt(receipt: Receipt): Receipt {
    const receipts = this.getReceipts();
    const existingIndex = receipts.findIndex((r) => r.id === receipt.id);
    
    let updatedReceipts: Receipt[];
    if (existingIndex >= 0) {
      updatedReceipts = [...receipts];
      updatedReceipts[existingIndex] = { ...receipt, updatedAt: new Date().toISOString() };
    } else {
      updatedReceipts = [receipt, ...receipts];
      // Increment next receipt counter
      const settings = this.getSettings();
      const currentNum = settings.nextReceiptNumber || 1001;
      this.saveSettings({ nextReceiptNumber: currentNum + 1 });
    }

    safeSetItem(STORAGE_KEYS.RECEIPTS, updatedReceipts);
    this.syncCustomerFromReceipt(receipt);
    return receipt;
  },

  deleteReceipt(id: string): boolean {
    const receipts = this.getReceipts();
    const filtered = receipts.filter((r) => r.id !== id);
    return safeSetItem(STORAGE_KEYS.RECEIPTS, filtered);
  },

  getCustomers(): Customer[] {
    return safeGetItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, SAMPLE_CUSTOMERS);
  },

  getCustomerById(id: string): Customer | null {
    const customers = this.getCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  saveCustomer(customer: Customer): Customer {
    const customers = this.getCustomers();
    const existingIndex = customers.findIndex((c) => c.id === customer.id);
    let updated: Customer[];
    
    if (existingIndex >= 0) {
      updated = [...customers];
      updated[existingIndex] = { ...customer, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...customer, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...customers];
    }
    
    safeSetItem(STORAGE_KEYS.CUSTOMERS, updated);
    return customer;
  },

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    return safeSetItem(STORAGE_KEYS.CUSTOMERS, filtered);
  },

  syncCustomerFromReceipt(receipt: Receipt) {
    if (!receipt.customer?.name?.trim()) return;

    const customers = this.getCustomers();
    const name = receipt.customer.name.trim().toLowerCase();
    const phone = receipt.customer.phone?.trim();
    const email = receipt.customer.email?.trim().toLowerCase();

    // Check if customer exists by ID, or email, or phone, or name
    let matchedCustomer = customers.find((c) => {
      if (receipt.customer.id && c.id === receipt.customer.id) return true;
      if (email && c.email?.toLowerCase() === email) return true;
      if (phone && c.phone === phone) return true;
      if (c.name.toLowerCase() === name) return true;
      return false;
    });

    // Recompute total spent and count for all receipts
    const allReceipts = this.getReceipts();
    const customerReceipts = allReceipts.filter((r) => {
      if (matchedCustomer && r.customer?.id === matchedCustomer.id) return true;
      if (email && r.customer?.email?.toLowerCase() === email) return true;
      if (phone && r.customer?.phone === phone) return true;
      return r.customer?.name?.toLowerCase() === name;
    });

    const totalSpent = customerReceipts.reduce((sum, r) => sum + (r.grandTotal || 0), 0);
    const receiptCount = customerReceipts.length;

    if (matchedCustomer) {
      matchedCustomer = {
        ...matchedCustomer,
        name: receipt.customer.name,
        phone: receipt.customer.phone || matchedCustomer.phone,
        email: receipt.customer.email || matchedCustomer.email,
        address: receipt.customer.address || matchedCustomer.address,
        city: receipt.customer.city || matchedCustomer.city,
        state: receipt.customer.state || matchedCustomer.state,
        postalCode: receipt.customer.postalCode || matchedCustomer.postalCode,
        totalSpent,
        receiptCount,
        updatedAt: new Date().toISOString(),
      };
      this.saveCustomer(matchedCustomer);
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: receipt.customer.name,
        phone: receipt.customer.phone,
        email: receipt.customer.email,
        address: receipt.customer.address,
        city: receipt.customer.city,
        state: receipt.customer.state,
        postalCode: receipt.customer.postalCode,
        totalSpent: receipt.grandTotal || 0,
        receiptCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.saveCustomer(newCustomer);
    }
  },

  exportAllData(): string {
    const data = {
      app: 'BillMate',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      receipts: this.getReceipts(),
      customers: this.getCustomers(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonString: string): { success: boolean; message: string; counts?: { receipts: number; customers: number } } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON file structure.' };
      }

      if (!Array.isArray(parsed.receipts) && !Array.isArray(parsed.customers) && !parsed.settings) {
        return { success: false, message: 'File is not a valid BillMate backup.' };
      }

      if (Array.isArray(parsed.receipts)) {
        safeSetItem(STORAGE_KEYS.RECEIPTS, parsed.receipts);
      }
      if (Array.isArray(parsed.customers)) {
        safeSetItem(STORAGE_KEYS.CUSTOMERS, parsed.customers);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        safeSetItem(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      return {
        success: true,
        message: 'Data successfully restored!',
        counts: {
          receipts: parsed.receipts?.length || 0,
          customers: parsed.customers?.length || 0,
        },
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to parse JSON file.' };
    }
  },

  clearAllData(): void {
    if (!isClient()) return;
    window.localStorage.removeItem(STORAGE_KEYS.RECEIPTS);
    window.localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
