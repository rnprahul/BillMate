'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Upload, 
  Building2, 
  User, 
  Receipt as ReceiptIcon, 
  Percent, 
  CreditCard, 
  FileText, 
  Save, 
  Printer, 
  Sparkles, 
  Search, 
  X 
} from 'lucide-react';
import { 
  CURRENCIES, 
  CurrencyCode, 
  Customer, 
  DiscountType, 
  GstCalculationMode, 
  GstType, 
  PAYMENT_METHODS, 
  PAYMENT_STATUSES, 
  PaymentMethod, 
  PaymentStatus, 
  Receipt, 
  ReceiptItem, 
  ReceiptSize, 
  ReceiptTemplate 
} from '@/types';
import { StorageService } from '@/lib/storage';
import { useToast } from '@/components/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ReceiptFormProps {
  receipt: Receipt;
  onChange: (receipt: Receipt) => void;
  onSave: () => void;
  errors?: Record<string, string>;
}

export function ReceiptForm({ receipt, onChange, onSave, errors = {} }: ReceiptFormProps) {
  const router = useRouter();
  const { info, error: showError } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedCustomers, setSavedCustomers] = useState<Customer[]>([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  useEffect(() => {
    StorageService.initialize();
    setSavedCustomers(StorageService.getCustomers());
  }, []);

  const updateField = <K extends keyof Receipt>(field: K, value: Receipt[K]) => {
    onChange({
      ...receipt,
      [field]: value,
    });
  };

  const updateBusiness = (field: keyof Receipt['business'], value: string) => {
    onChange({
      ...receipt,
      business: {
        ...receipt.business,
        [field]: value,
      },
    });
  };

  const updateCustomer = (field: keyof Receipt['customer'], value: string | undefined) => {
    onChange({
      ...receipt,
      customer: {
        ...receipt.customer,
        [field]: value,
      },
    });
  };

  // Load Saved Business Profile
  const handleLoadSavedBusiness = () => {
    const settings = StorageService.getSettings();
    if (settings.savedBusiness) {
      const b = settings.savedBusiness;
      onChange({
        ...receipt,
        business: {
          name: b.name || '',
          logo: b.logo || '',
          phone: b.phone || '',
          email: b.email || '',
          website: b.website || '',
          address: b.address || '',
          city: b.city || '',
          state: b.state || '',
          postalCode: b.postalCode || '',
          gstin: b.gstin || '',
        },
      });
      info('Loaded default business profile.');
    }
  };

  // Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showError('Logo image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateBusiness('logo', reader.result as string);
      info('Business logo uploaded.');
    };
    reader.readAsDataURL(file);
  };

  // Select Customer from Saved list
  const handleSelectCustomer = (cust: Customer) => {
    onChange({
      ...receipt,
      customer: {
        id: cust.id,
        name: cust.name,
        phone: cust.phone || '',
        email: cust.email || '',
        address: cust.address || '',
        city: cust.city || '',
        state: cust.state || '',
        postalCode: cust.postalCode || '',
      },
    });
    setShowCustomerDropdown(false);
    info(`Selected client: ${cust.name}`);
  };

  // Add Item
  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: receipt.isGstEnabled ? receipt.gstRate : receipt.generalTaxRate,
      total: 0,
    };
    updateField('items', [...receipt.items, newItem]);
  };

  // Duplicate Item
  const handleDuplicateItem = (index: number) => {
    const target = receipt.items[index];
    const duplicated: ReceiptItem = {
      ...target,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const updated = [...receipt.items];
    updated.splice(index + 1, 0, duplicated);
    updateField('items', updated);
    info(`Duplicated "${target.name || 'item'}"`);
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    if (receipt.items.length <= 1) {
      showError('Receipt must contain at least one item.');
      return;
    }
    updateField(
      'items',
      receipt.items.filter((_, i) => i !== index)
    );
  };

  // Update Item field
  const handleUpdateItem = (index: number, field: keyof ReceiptItem, value: any) => {
    const updated = [...receipt.items];
    updated[index] = { ...updated[index], [field]: value };
    updateField('items', updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredCustomers = savedCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.phone?.includes(customerSearchQuery) ||
      c.email?.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Toolbar / Template & Size Selector */}
      <div className="p-4 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wider mb-1">
              Template Design
            </label>
            <div className="flex items-center gap-1 bg-[#181329] p-1 rounded-xl border border-[#3b2d5f]">
              {(['modern', 'classic', 'minimal'] as ReceiptTemplate[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => updateField('template', t)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                    receipt.template === t
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-violet-300 uppercase tracking-wider mb-1">
              Receipt Size
            </label>
            <div className="flex items-center gap-1 bg-[#181329] p-1 rounded-xl border border-[#3b2d5f]">
              <button
                type="button"
                onClick={() => updateField('size', 'a4')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  receipt.size === 'a4'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Document
              </button>
              <button
                type="button"
                onClick={() => updateField('size', 'thermal')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  receipt.size === 'thermal'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Thermal Slip (80mm)
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} icon={<Save className="w-4 h-4" />}>
            Save Receipt
          </Button>
        </div>
      </div>

      {/* SECTION 1: BUSINESS INFORMATION */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#29203f] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Building2 className="w-4 h-4 text-violet-400" />
            1. Business Information
          </div>
          <button
            type="button"
            onClick={handleLoadSavedBusiness}
            className="text-xs text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Saved Profile
          </button>
        </div>

        {/* Business Logo Upload */}
        <div className="flex items-center gap-4">
          {receipt.business.logo ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={receipt.business.logo}
                alt="Business Logo"
                className="h-16 w-28 object-contain rounded-xl border border-[#3b2d5f] bg-[#181329] p-1"
              />
              <button
                type="button"
                onClick={() => updateBusiness('logo', '')}
                className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                title="Remove logo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-16 px-4 rounded-xl border-2 border-dashed border-[#3b2d5f] hover:border-violet-500 text-slate-400 hover:text-violet-300 flex items-center gap-2 text-xs font-bold transition-all bg-[#181329]/50"
            >
              <Upload className="w-4 h-4 text-violet-400" />
              Upload Logo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <div className="text-xs text-slate-400">
            Recommended: PNG, JPG, or SVG with transparent background (Max 2MB).
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            placeholder="e.g. Acme Creative Studio"
            value={receipt.business.name}
            onChange={(e) => updateBusiness('name', e.target.value)}
            error={errors.businessName}
            required
          />
          <Input
            label="GSTIN / Tax ID"
            placeholder="e.g. 29ABCDE1234F1Z5"
            value={receipt.business.gstin || ''}
            onChange={(e) => updateBusiness('gstin', e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +91 98765 43210"
            value={receipt.business.phone || ''}
            onChange={(e) => updateBusiness('phone', e.target.value)}
          />
          <Input
            label="Email Address"
            placeholder="e.g. billing@acme.com"
            type="email"
            value={receipt.business.email || ''}
            onChange={(e) => updateBusiness('email', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <Input
              label="Street Address"
              placeholder="e.g. 402 Silicon Heights, MG Road"
              value={receipt.business.address || ''}
              onChange={(e) => updateBusiness('address', e.target.value)}
            />
          </div>
          <Input
            label="City"
            placeholder="e.g. Bengaluru"
            value={receipt.business.city || ''}
            onChange={(e) => updateBusiness('city', e.target.value)}
          />
          <Input
            label="State / Province"
            placeholder="e.g. Karnataka"
            value={receipt.business.state || ''}
            onChange={(e) => updateBusiness('state', e.target.value)}
          />
          <Input
            label="Postal / Zip Code"
            placeholder="e.g. 560001"
            value={receipt.business.postalCode || ''}
            onChange={(e) => updateBusiness('postalCode', e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 2: CUSTOMER INFORMATION */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#29203f] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <User className="w-4 h-4 text-violet-400" />
            2. Customer / Client Information
          </div>
          {savedCustomers.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Select Saved Client ({savedCustomers.length})
              </button>

              {showCustomerDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#181329] border border-[#3b2d5f] rounded-2xl shadow-2xl shadow-purple-950/80 z-30 p-2 space-y-1.5 animate-in fade-in zoom-in-95">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#3b2d5f] bg-[#100c1d] text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredCustomers.length === 0 ? (
                      <p className="text-xs text-slate-400 p-2 text-center">No clients found</p>
                    ) : (
                      filteredCustomers.map((cust) => (
                        <button
                          key={cust.id}
                          type="button"
                          onClick={() => handleSelectCustomer(cust)}
                          className="w-full text-left p-2 rounded-xl hover:bg-[#251c40] text-xs transition-colors"
                        >
                          <p className="font-bold text-white">{cust.name}</p>
                          <p className="text-[11px] text-violet-300">{cust.phone || cust.email || 'No contact info'}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Customer Name"
            placeholder="e.g. John Doe / Acme Corp"
            value={receipt.customer.name}
            onChange={(e) => updateCustomer('name', e.target.value)}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +91 91234 56789"
            value={receipt.customer.phone || ''}
            onChange={(e) => updateCustomer('phone', e.target.value)}
          />
          <Input
            label="Email Address"
            placeholder="e.g. client@example.com"
            type="email"
            value={receipt.customer.email || ''}
            onChange={(e) => updateCustomer('email', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <Input
              label="Billing Address (Optional)"
              placeholder="e.g. 101 Marine Drive"
              value={receipt.customer.address || ''}
              onChange={(e) => updateCustomer('address', e.target.value)}
            />
          </div>
          <Input
            label="City"
            placeholder="e.g. Mumbai"
            value={receipt.customer.city || ''}
            onChange={(e) => updateCustomer('city', e.target.value)}
          />
          <Input
            label="State"
            placeholder="e.g. Maharashtra"
            value={receipt.customer.state || ''}
            onChange={(e) => updateCustomer('state', e.target.value)}
          />
          <Input
            label="Postal Code"
            placeholder="e.g. 400020"
            value={receipt.customer.postalCode || ''}
            onChange={(e) => updateCustomer('postalCode', e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 3: RECEIPT DETAILS */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-[#29203f] pb-3">
          <ReceiptIcon className="w-4 h-4 text-violet-400" />
          3. Receipt Details & Currency
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Receipt Number"
            placeholder="e.g. REC-1001"
            value={receipt.receiptNumber}
            onChange={(e) => updateField('receiptNumber', e.target.value)}
            error={errors.receiptNumber}
            required
          />
          <Input
            label="Date"
            type="date"
            value={receipt.date}
            onChange={(e) => updateField('date', e.target.value)}
            error={errors.date}
            required
          />
          <Input
            label="Time"
            type="time"
            value={receipt.time}
            onChange={(e) => updateField('time', e.target.value)}
          />
          <Select
            label="Currency"
            value={receipt.currency}
            onChange={(e) => updateField('currency', e.target.value as CurrencyCode)}
            options={Object.values(CURRENCIES).map((c) => ({
              value: c.code,
              label: c.label,
            }))}
          />
        </div>
      </div>

      {/* SECTION 4: ITEMS / SERVICES TABLE */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#29203f] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FileText className="w-4 h-4 text-violet-400" />
            4. Line Items & Services ({receipt.items.length})
          </div>
          <Button size="sm" variant="secondary" onClick={handleAddItem} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Item
          </Button>
        </div>

        {errors.items && (
          <p className="text-xs text-rose-300 font-bold bg-rose-950/60 p-3 rounded-xl border border-rose-800">
            {errors.items}
          </p>
        )}

        <div className="space-y-3">
          {receipt.items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 rounded-xl bg-[#181329] border border-[#3b2d5f] space-y-3 hover:border-violet-500/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                {/* Item Name & Description */}
                <div className="md:col-span-6 space-y-2">
                  <Input
                    placeholder="Item / Service Name (e.g. Web Development)"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={item.description || ''}
                    onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#2d2448] bg-[#120e20] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* Qty */}
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Price */}
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Row Total & Actions */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-1">
                  <span className="text-xs font-black text-violet-300 font-mono">
                    {CURRENCIES[receipt.currency]?.symbol || '₹'} {(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicateItem(index)}
                      className="p-1.5 text-slate-400 hover:text-violet-300 hover:bg-[#251c40] rounded-lg transition-colors"
                      title="Duplicate item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button size="sm" variant="outline" onClick={handleAddItem} className="w-full" icon={<Plus className="w-4 h-4" />}>
          Add Another Line Item
        </Button>
      </div>

      {/* SECTION 5: DISCOUNTS, TAXES & GST */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-[#29203f] pb-3">
          <Percent className="w-4 h-4 text-violet-400" />
          5. Discounts & GST / Tax Settings
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Discount Section */}
          <div className="p-4 rounded-xl bg-[#181329] border border-[#3b2d5f] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-violet-200 uppercase tracking-wider">Discount</label>
              <div className="flex items-center gap-1 bg-[#100c1d] p-0.5 rounded-lg border border-[#2d2448] text-xs">
                <button
                  type="button"
                  onClick={() => updateField('discountType', 'percentage')}
                  className={`px-2.5 py-1 rounded font-bold ${
                    receipt.discountType === 'percentage'
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  % Percent
                </button>
                <button
                  type="button"
                  onClick={() => updateField('discountType', 'fixed')}
                  className={`px-2.5 py-1 rounded font-bold ${
                    receipt.discountType === 'fixed'
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fixed Amount
                </button>
              </div>
            </div>

            <Input
              type="number"
              min="0"
              step="any"
              placeholder={receipt.discountType === 'percentage' ? 'e.g. 10 (%)' : 'e.g. 500 (Fixed)'}
              value={receipt.discountValue}
              onChange={(e) => updateField('discountValue', parseFloat(e.target.value) || 0)}
              error={errors.discount}
            />
          </div>

          {/* GST vs Standard Tax Toggle */}
          <div className="p-4 rounded-xl bg-[#181329] border border-[#3b2d5f] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-violet-200 uppercase tracking-wider">GST / Tax Mode</label>
              <button
                type="button"
                onClick={() => updateField('isGstEnabled', !receipt.isGstEnabled)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  receipt.isGstEnabled
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : 'bg-[#100c1d] text-slate-400 border border-[#2d2448]'
                }`}
              >
                {receipt.isGstEnabled ? '✓ GST Mode Active' : 'Standard Tax Mode'}
              </button>
            </div>

            {receipt.isGstEnabled ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    label="GST Rate (%)"
                    value={receipt.gstRate}
                    onChange={(e) => updateField('gstRate', parseFloat(e.target.value) || 0)}
                    options={[
                      { value: 0, label: '0% (Exempt)' },
                      { value: 5, label: '5% GST' },
                      { value: 12, label: '12% GST' },
                      { value: 18, label: '18% GST (Standard)' },
                      { value: 28, label: '28% GST' },
                    ]}
                  />
                  <Select
                    label="Calculation Mode"
                    value={receipt.gstMode}
                    onChange={(e) => updateField('gstMode', e.target.value as GstCalculationMode)}
                    options={[
                      { value: 'exclusive', label: 'Exclusive (Add GST)' },
                      { value: 'inclusive', label: 'Inclusive (Inside Total)' },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-4 pt-1 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="gstType"
                      checked={receipt.gstType === 'cgst_sgst'}
                      onChange={() => updateField('gstType', 'cgst_sgst')}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <span>CGST + SGST (Intra-state)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="gstType"
                      checked={receipt.gstType === 'igst'}
                      onChange={() => updateField('gstType', 'igst')}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <span>IGST (Inter-state)</span>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  placeholder="e.g. 10 (%)"
                  value={receipt.generalTaxRate}
                  onChange={(e) => updateField('generalTaxRate', parseFloat(e.target.value) || 0)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 6: PAYMENT INFORMATION */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-[#29203f] pb-3">
          <CreditCard className="w-4 h-4 text-violet-400" />
          6. Payment Information & Status
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Payment Method"
            value={receipt.paymentMethod}
            onChange={(e) => updateField('paymentMethod', e.target.value as PaymentMethod)}
            options={PAYMENT_METHODS.map((m) => ({
              value: m.id,
              label: m.label,
            }))}
          />

          <Select
            label="Payment Status"
            value={receipt.paymentStatus}
            onChange={(e) => updateField('paymentStatus', e.target.value as PaymentStatus)}
            options={PAYMENT_STATUSES.map((s) => ({
              value: s.id,
              label: s.label,
            }))}
          />

          {receipt.paymentStatus === 'partially_paid' && (
            <Input
              label="Amount Paid"
              type="number"
              min="0"
              step="any"
              value={receipt.amountPaid}
              onChange={(e) => updateField('amountPaid', parseFloat(e.target.value) || 0)}
            />
          )}
        </div>
      </div>

      {/* SECTION 7: NOTES & TERMS */}
      <div className="p-5 sm:p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-[#29203f] pb-3">
          <FileText className="w-4 h-4 text-violet-400" />
          7. Notes & Terms
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Receipt Notes
            </label>
            <textarea
              rows={3}
              value={receipt.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="e.g. Thank you for your business!"
              className="w-full rounded-xl border border-[#2d2448] bg-[#120e20] text-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Terms & Conditions (Optional)
            </label>
            <textarea
              rows={3}
              value={receipt.terms || ''}
              onChange={(e) => updateField('terms', e.target.value)}
              placeholder="e.g. Payment due within 15 days."
              className="w-full rounded-xl border border-[#2d2448] bg-[#120e20] text-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex items-center justify-between p-4 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-xl">
        <Button variant="outline" size="md" onClick={() => router.push('/receipts')}>
          Cancel
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print / PDF
          </Button>
          <Button variant="accent" size="md" onClick={onSave} icon={<Save className="w-4 h-4" />}>
            Save Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
