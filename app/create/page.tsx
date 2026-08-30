'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Receipt } from '@/types';
import { StorageService } from '@/lib/storage';
import { ReceiptForm } from '@/components/forms/ReceiptForm';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';
import { Edit3, Eye, Sparkles } from 'lucide-react';

function ReceiptCreatorContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [initialReceipt, setInitialReceipt] = useState<Receipt | null>(null);
  const [liveReceipt, setLiveReceipt] = useState<Receipt | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StorageService.initialize();
    if (editId) {
      const found = StorageService.getReceiptById(editId);
      if (found) {
        setInitialReceipt(found);
        setLiveReceipt(found);
      }
    }
    setLoading(false);
  }, [editId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 animate-pulse">
          <Sparkles className="w-5 h-5 text-orange-400" />
          Loading BillMate Studio...
        </div>
      </div>
    );
  }

  const handleReceiptChange = React.useCallback((updated: Receipt) => {
    setLiveReceipt(updated);
  }, []);

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
              {initialReceipt ? `Edit Receipt: ${initialReceipt.receiptNumber}` : 'Create New Receipt'}
            </h1>
            <p className="text-xs text-slate-400">
              Fill in business, client, and item details. Live receipt preview updates instantaneously.
            </p>
          </div>

          <ReceiptForm
            initialReceipt={initialReceipt}
            onReceiptChange={handleReceiptChange}
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
                  Live Preview ({liveReceipt?.template} • {liveReceipt?.size?.toUpperCase()})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Print-Ready</span>
            </div>

            {liveReceipt && (
              <div className="rounded-3xl shadow-2xl border border-[#3b2d5f] overflow-hidden bg-[#100c1d] p-3 sm:p-5">
                <ReceiptPreview receipt={liveReceipt} />
              </div>
            )}
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
