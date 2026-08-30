'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutTemplate, PlusCircle, Check, Printer } from 'lucide-react';
import { Receipt, ReceiptSize, ReceiptTemplate } from '@/types';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { Button } from '@/components/ui/Button';

const SAMPLE_DEMO_RECEIPT: Receipt = {
  id: 'template-sample',
  receiptNumber: 'REC-2026',
  date: '2026-08-30',
  time: '15:30',
  currency: 'INR',
  business: {
    name: 'Horizon Digital Studios',
    phone: '+91 98765 00123',
    email: 'hello@horizondigital.io',
    website: 'https://horizondigital.io',
    address: 'Level 8, Nexus Tech Hub, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    gstin: '29AAACH7409R1ZZ',
  },
  customer: {
    name: 'Elena Rostova',
    phone: '+91 91234 56789',
    email: 'elena@novaproductions.com',
    address: 'Tower 4, Palm Grove Estates',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560066',
  },
  items: [
    {
      id: 'demo-1',
      name: 'Full Stack Web Application Development',
      description: 'Next.js, TypeScript, and Tailwind CSS responsive SaaS portal',
      quantity: 1,
      unitPrice: 45000,
      taxRate: 18,
      total: 45000,
    },
    {
      id: 'demo-2',
      name: 'Brand Identity & Visual Style Guide',
      description: 'Logos, vector typography, icons, color tokens, and export assets',
      quantity: 1,
      unitPrice: 15000,
      taxRate: 18,
      total: 15000,
    },
  ],
  subtotal: 60000,
  discountType: 'percentage',
  discountValue: 10,
  discountAmount: 6000,
  taxableAmount: 54000,
  isGstEnabled: true,
  gstMode: 'exclusive',
  gstType: 'cgst_sgst',
  gstRate: 18,
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 0,
  cgstAmount: 4860,
  sgstAmount: 4860,
  igstAmount: 0,
  generalTaxRate: 0,
  generalTaxAmount: 0,
  totalTaxAmount: 9720,
  grandTotal: 63720,
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  amountPaid: 63720,
  balanceDue: 0,
  notes: 'Thank you for choosing Horizon Digital Studios!',
  terms: 'Includes 30 days post-launch support and bug fixes.',
  template: 'modern',
  size: 'a4',
  createdAt: '2026-08-30T10:00:00Z',
  updatedAt: '2026-08-30T10:00:00Z',
};

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReceiptTemplate>('modern');
  const [selectedSize, setSelectedSize] = useState<ReceiptSize>('a4');

  const templates: {
    id: ReceiptTemplate;
    title: string;
    description: string;
    bestFor: string;
  }[] = [
    {
      id: 'modern',
      title: 'Modern Pro',
      description: 'Contemporary aesthetic with color accent banners, card layouts, and crisp typography.',
      bestFor: 'Agencies, SaaS, Tech Consultants, Freelancers',
    },
    {
      id: 'classic',
      title: 'Classic Corporate',
      description: 'Formal double-bordered header, traditional serif typography, and formal acknowledgment.',
      bestFor: 'Lawyers, Accountants, Retailers, Traditional Businesses',
    },
    {
      id: 'minimal',
      title: 'Minimal Clean',
      description: 'High whitespace, sleek dividers, and understated typography focusing on clarity.',
      bestFor: 'Designers, Photographers, Boutique Studios, Modern Shops',
    },
  ];

  const currentPreviewReceipt: Receipt = {
    ...SAMPLE_DEMO_RECEIPT,
    template: selectedTemplate,
    size: selectedSize,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#29203f] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
            <LayoutTemplate className="w-4 h-4" />
            Receipt Design Gallery
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Professional Receipt Templates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose a receipt design that matches your brand personality. All templates are 100% print & PDF compatible.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-orange-600 text-white shadow-lg shadow-purple-950 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create Receipt
        </Link>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelectedTemplate(tpl.id)}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              selectedTemplate === tpl.id
                ? 'bg-[#181329] border-violet-500 shadow-xl shadow-purple-950/60 ring-2 ring-violet-500/30'
                : 'bg-[#120e20] border-[#2d2448] hover:border-[#3b2d5f]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-base text-white">{tpl.title}</h2>
              {selectedTemplate === tpl.id && (
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {tpl.description}
            </p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-[#29203f]">
              <span className="font-bold text-violet-300">Ideal for:</span> {tpl.bestFor}
            </div>
          </div>
        ))}
      </div>

      {/* Live Interactive Preview Container */}
      <div className="space-y-4 pt-4 border-t border-[#29203f]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-white">
              Interactive Preview: {templates.find((t) => t.id === selectedTemplate)?.title}
            </h3>
            <p className="text-xs text-slate-400">Live render with realistic sample invoice data</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Format Toggle */}
            <div className="flex items-center gap-1 bg-[#181329] border border-[#3b2d5f] p-1 rounded-xl text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setSelectedSize('a4')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSize === 'a4'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Document
              </button>
              <button
                type="button"
                onClick={() => setSelectedSize('thermal')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedSize === 'thermal'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Thermal Slip (80mm)
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-4 h-4" />}
            >
              Test Print
            </Button>
          </div>
        </div>

        {/* Live Container */}
        <div className="p-4 sm:p-8 rounded-3xl bg-[#100c1d] border border-[#3b2d5f] shadow-2xl">
          <ReceiptPreview receipt={currentPreviewReceipt} />
        </div>
      </div>
    </div>
  );
}
