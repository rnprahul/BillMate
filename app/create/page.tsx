'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Receipt, ReceiptItem } from '@/types';
import { StorageService } from '@/lib/storage';
import { calculateReceiptTotals } from '@/lib/calculations/receipt';
import { useToast } from '@/components/providers/ToastProvider';
import { ReceiptForm } from '@/components/forms/ReceiptForm';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { Edit3, Eye, Sparkles } from 'lucide-react';

const DEFAULT_INITIAL_RECEIPT: Receipt = {
  id: 'rec-new',
  receiptNumber: 'REC-1001',
  date: '2026-08-30',
  time: '12:00',
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
    name: 'John Doe',
    phone: '+91 91234 56789',
    email: 'client@example.com',
    address: '101 Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400020',
  },
  items: [
    {
      id: 'item-default-1',
      name: 'Professional Web Development',
      description: 'Design & technical implementation consulting',
      quantity: 1,
      unitPrice: 5000,
      taxRate: 18,
      total: 5000,
    },
  ],
  subtotal: 5000,
  discountType: 'percentage',
  discountValue: 0,
  discountAmount: 0,
  taxableAmount: 5000,
  isGstEnabled: true,
  gstMode: 'exclusive',
  gstType: 'cgst_sgst',
  gstRate: 18,
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 0,
  cgstAmount: 450,
  sgstAmount: 450,
  igstAmount: 0,
  generalTaxRate: 0,
  generalTaxAmount: 0,
  totalTaxAmount: 900,
  grandTotal: 5900,
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  amountPaid: 5900,
  balanceDue: 0,
  notes: 'Thank you for your business!',
  terms: 'Payment due within 15 days. For inquiries, please email billing support.',
  template: 'modern',
  size: 'a4',
  createdAt: '2026-08-30T12:00:00.000Z',
  updatedAt: '2026-08-30T12:00:00.000Z',
};

function ReceiptCreatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { success, error: showError } = useToast();

  const [receipt, setReceipt] = useState<Receipt>(DEFAULT_INITIAL_RECEIPT);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    StorageService.initialize();

    if (editId) {
      const found = StorageService.getReceiptById(editId);
      if (found) {
        setReceipt(found);
      }
    } else {
      const settings = StorageService.getSettings();
      const nextNum = StorageService.getNextReceiptNumber();
      const now = new Date();

      setReceipt((prev) => ({
        ...prev,
        id: `rec-${Date.now()}`,
        receiptNumber: nextNum,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        currency: settings.defaultCurrency || 'INR',
        template: settings.defaultTemplate || 'modern',
        size: settings.defaultSize || 'a4',
        paymentMethod: settings.defaultPaymentMethod || 'upi',
        business: settings.useSavedBusinessByDefault && settings.savedBusiness
          ? {
              name: settings.savedBusiness.name || '',
              logo: settings.savedBusiness.logo || '',
              phone: settings.savedBusiness.phone || '',
              email: settings.savedBusiness.email || '',
              website: settings.savedBusiness.website || '',
              address: settings.savedBusiness.address || '',
              city: settings.savedBusiness.city || '',
              state: settings.savedBusiness.state || '',
              postalCode: settings.savedBusiness.postalCode || '',
              gstin: settings.savedBusiness.gstin || '',
            }
          : prev.business,
      }));
    }

    setMounted(true);
  }, [editId]);

  // Synchronous calculation: Pure, instant, zero-lag, no useEffect feedback loop
  const calculatedReceipt = useMemo((): Receipt => {
    const calc = calculateReceiptTotals({
      items: receipt.items,
      discountType: receipt.discountType,
      discountValue: receipt.discountValue,
      isGstEnabled: receipt.isGstEnabled,
      gstMode: receipt.gstMode,
      gstType: receipt.gstType,
      gstRate: receipt.gstRate,
      generalTaxRate: receipt.generalTaxRate,
      amountPaid: receipt.amountPaid,
      paymentStatus: receipt.paymentStatus,
    });

    return {
      ...receipt,
      items: calc.items,
      subtotal: calc.subtotal,
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      cgstRate: calc.cgstRate,
      sgstRate: calc.sgstRate,
      igstRate: calc.igstRate,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      generalTaxAmount: calc.generalTaxAmount,
      totalTaxAmount: calc.totalTaxAmount,
      grandTotal: calc.grandTotal,
      amountPaid: calc.amountPaid,
      balanceDue: calc.balanceDue,
    };
  }, [receipt]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!receipt.business.name.trim()) {
      newErrors.businessName = 'Business name is required.';
    }

    if (!receipt.receiptNumber.trim()) {
      newErrors.receiptNumber = 'Receipt number is required.';
    }

    if (!receipt.date) {
      newErrors.date = 'Receipt date is required.';
    }

    if (receipt.items.length === 0) {
      newErrors.items = 'Please add at least one line item.';
    } else {
      const hasEmptyName = receipt.items.some((item) => !item.name.trim());
      if (hasEmptyName) {
        newErrors.items = 'All items must have a valid name or title.';
      }
      const hasInvalidQty = receipt.items.some((item) => isNaN(item.quantity) || item.quantity <= 0);
      if (hasInvalidQty) {
        newErrors.items = 'Item quantity must be greater than 0.';
      }
      const hasNegativePrice = receipt.items.some((item) => isNaN(item.unitPrice) || item.unitPrice < 0);
      if (hasNegativePrice) {
        newErrors.items = 'Item unit price cannot be negative.';
      }
    }

    if (receipt.discountValue < 0) {
      newErrors.discount = 'Discount cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveReceipt = () => {
    if (!validateForm()) {
      showError('Please fix the validation errors before saving.');
      return;
    }

    StorageService.saveReceipt(calculatedReceipt);
    success('Receipt saved successfully!');
    router.push('/receipts');
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 animate-pulse">
          <Sparkles className="w-5 h-5 text-orange-400" />
          Loading BillMate Studio...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center justify-center p-1 bg-[#181329] border border-[#3b2d5f] rounded-2xl max-w-xs mx-auto no-print">
        <button
          type="button"
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeMobileTab === 'editor'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeMobileTab === 'preview'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div
          className={`lg:col-span-6 xl:col-span-7 space-y-5 ${
            activeMobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">
              {editId ? `Edit Receipt: ${calculatedReceipt.receiptNumber}` : 'Create New Receipt'}
            </h1>
            <p className="text-xs text-slate-400">
              Fill in business, client, and item details. Live receipt preview updates instantaneously.
            </p>
          </div>

          <ReceiptForm
            receipt={receipt}
            onChange={(updated) => setReceipt(updated)}
            onSave={handleSaveReceipt}
            errors={errors}
          />
        </div>

        {/* Right Column: Sticky Live Receipt Preview */}
        <div
          className={`lg:col-span-6 xl:col-span-5 ${
            activeMobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="flex items-center justify-between px-1 no-print">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm shadow-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                  Live Preview ({calculatedReceipt.template} • {calculatedReceipt.size?.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Print-Ready</span>
            </div>

            <div className="rounded-3xl shadow-2xl border border-[#3b2d5f] overflow-hidden bg-[#100c1d] p-3 sm:p-5">
              <ReceiptPreview receipt={calculatedReceipt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateReceiptPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-xs font-bold uppercase tracking-wider text-violet-400">
          Loading Creator...
        </div>
      }
    >
      <ReceiptCreatorContent />
    </Suspense>
  );
}
