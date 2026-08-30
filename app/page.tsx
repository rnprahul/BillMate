'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Receipt as ReceiptIcon, 
  TrendingUp, 
  Calendar, 
  Users, 
  LayoutTemplate, 
  Settings, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Printer, 
  ArrowUpRight, 
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Receipt } from '@/types';
import { StorageService } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations/receipt';
import { useToast } from '@/components/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';

export default function DashboardPage() {
  const router = useRouter();
  const { success } = useToast();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    StorageService.initialize();
    loadDashboardData();
    setMounted(true);
  }, []);

  const loadDashboardData = () => {
    const loadedReceipts = StorageService.getReceipts();
    const loadedCustomers = StorageService.getCustomers();
    setReceipts(loadedReceipts);
    setCustomerCount(loadedCustomers.length);
  };

  // Calculate live statistics
  const totalReceipts = receipts.length;
  const totalSales = receipts.reduce((sum, r) => sum + (r.grandTotal || 0), 0);

  // This Month's Sales
  const currentYearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const thisMonthSales = receipts
    .filter((r) => r.date && r.date.startsWith(currentYearMonth))
    .reduce((sum, r) => sum + (r.grandTotal || 0), 0);

  // Duplicate Receipt
  const handleDuplicate = (receipt: Receipt) => {
    const nextNum = StorageService.getNextReceiptNumber();
    const duplicated: Receipt = {
      ...receipt,
      id: `rec-${Date.now()}`,
      receiptNumber: nextNum,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveReceipt(duplicated);
    loadDashboardData();
    success(`Receipt duplicated as ${nextNum}`);
  };

  // Delete Receipt
  const confirmDelete = () => {
    if (!receiptToDelete) return;
    StorageService.deleteReceipt(receiptToDelete.id);
    loadDashboardData();
    success('Receipt deleted successfully.');
    setReceiptToDelete(null);
    if (selectedReceipt?.id === receiptToDelete.id) {
      setSelectedReceipt(null);
    }
  };

  const recentReceipts = receipts.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#120e22] via-[#1a142e] to-[#25103a] p-8 sm:p-12 border border-[#3b2d5f] shadow-2xl shadow-purple-950/60">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-700/50 text-xs font-bold shadow-sm shadow-purple-950">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Fast, Private & Offline-First Receipt Generator
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Create professional receipts in seconds.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create, customize, print, and manage digital receipts for your business with automated tax & GST calculations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 via-purple-600 to-orange-600 text-white shadow-xl shadow-purple-950/50 hover:opacity-95 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Create Receipt
            </Link>

            <Link
              href="/receipts"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#181329] hover:bg-[#231b3c] text-violet-200 border border-[#3b2d5f] active:scale-95 transition-all"
            >
              <ReceiptIcon className="w-4 h-4 text-violet-400" />
              View Receipts
            </Link>
          </div>
        </div>
      </section>

      {/* KPI METRICS SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Receipts */}
        <div className="p-6 rounded-2xl bg-[#120e20] border border-[#2d2448] shadow-lg flex items-center justify-between hover:border-violet-500/40 transition-colors">
          <div>
            <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">
              Total Receipts
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {mounted ? totalReceipts : '...'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-950/70 border border-violet-800/60 text-violet-400 flex items-center justify-center shadow-inner">
            <ReceiptIcon className="w-6 h-6" />
          </div>
        </div>

        {/* This Month */}
        <div className="p-6 rounded-2xl bg-[#120e20] border border-[#2d2448] shadow-lg flex items-center justify-between hover:border-orange-500/40 transition-colors">
          <div>
            <p className="text-xs font-bold text-orange-300 uppercase tracking-wider">
              This Month
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {mounted ? formatCurrency(thisMonthSales, 'INR') : '...'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-950/70 border border-orange-800/60 text-orange-400 flex items-center justify-center shadow-inner">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="p-6 rounded-2xl bg-[#120e20] border border-[#2d2448] shadow-lg flex items-center justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <p className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              Total Sales
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {mounted ? formatCurrency(totalSales, 'INR') : '...'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-950/70 border border-purple-800/60 text-purple-400 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Saved Customers */}
        <div className="p-6 rounded-2xl bg-[#120e20] border border-[#2d2448] shadow-lg flex items-center justify-between hover:border-violet-500/40 transition-colors">
          <div>
            <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">
              Saved Clients
            </p>
            <p className="text-2xl font-black text-white mt-1">
              {mounted ? customerCount : '...'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-950/70 border border-violet-800/60 text-violet-400 flex items-center justify-center shadow-inner">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="space-y-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-violet-200">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/create"
            className="p-5 rounded-2xl bg-[#120e20] border border-[#2d2448] hover:border-violet-500 shadow-lg hover:shadow-purple-950/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-950/80 text-violet-400 border border-violet-800/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <PlusCircle className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
              New Receipt
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Generate digital receipt</p>
          </Link>

          <Link
            href="/receipts"
            className="p-5 rounded-2xl bg-[#120e20] border border-[#2d2448] hover:border-orange-500 shadow-lg hover:shadow-orange-950/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-950/80 text-orange-400 border border-orange-800/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <ReceiptIcon className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors">
              Recent Receipts
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Browse history & filters</p>
          </Link>

          <Link
            href="/templates"
            className="p-5 rounded-2xl bg-[#120e20] border border-[#2d2448] hover:border-purple-500 shadow-lg hover:shadow-purple-950/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
              Templates
            </p>
            <p className="text-xs text-slate-400 mt-0.5">A4 & Thermal formats</p>
          </Link>

          <Link
            href="/settings"
            className="p-5 rounded-2xl bg-[#120e20] border border-[#2d2448] hover:border-violet-500 shadow-lg hover:shadow-purple-950/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-950/80 text-violet-400 border border-violet-800/50 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors">
              Business Settings
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Profile, GST & defaults</p>
          </Link>
        </div>
      </section>

      {/* RECENT RECEIPTS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-violet-200">Recent Receipts</h2>
            <p className="text-xs text-slate-400">Your latest created and saved invoices</p>
          </div>

          <Link
            href="/receipts"
            className="text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 transition-colors"
          >
            View All Receipts ({receipts.length})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentReceipts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-14 px-4 rounded-2xl bg-[#120e20] border border-dashed border-[#3b2d5f] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#181329] text-violet-400 flex items-center justify-center mx-auto border border-[#3b2d5f]">
              <ReceiptIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No receipts generated yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start generating professional digital receipts with instant tax & GST calculation for your clients.
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-orange-600 text-white shadow-lg shadow-purple-950"
            >
              <PlusCircle className="w-4 h-4" />
              Create First Receipt
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#2d2448] bg-[#120e20] shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#29203f] bg-[#161127] text-violet-300 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#231a3d] text-slate-200">
                {recentReceipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#181329]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-violet-300">
                      {rec.receiptNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{rec.customer?.name || 'Walk-in Customer'}</p>
                      {rec.customer?.phone && (
                        <p className="text-[11px] text-slate-400">{rec.customer.phone}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{rec.date}</td>
                    <td className="py-3 px-4 font-mono font-black text-white">
                      {formatCurrency(rec.grandTotal, rec.currency)}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-400">
                      {rec.paymentMethod.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      {rec.paymentStatus === 'paid' && <Badge variant="emerald">Paid</Badge>}
                      {rec.paymentStatus === 'pending' && <Badge variant="amber">Pending</Badge>}
                      {rec.paymentStatus === 'partially_paid' && <Badge variant="orange">Partial</Badge>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(rec)}
                          className="p-1.5 text-slate-400 hover:text-violet-300 hover:bg-[#251c40] rounded-lg transition-colors"
                          title="View receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/create?edit=${rec.id}`)}
                          className="p-1.5 text-slate-400 hover:text-violet-300 hover:bg-[#251c40] rounded-lg transition-colors"
                          title="Edit receipt"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(rec)}
                          className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-[#251c40] rounded-lg transition-colors"
                          title="Duplicate receipt"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReceiptToDelete(rec)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete receipt"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* VIEW RECEIPT MODAL */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={`Receipt ${selectedReceipt?.receiptNumber || ''}`}
        description="Print or save as PDF directly from the browser"
        maxWidth="4xl"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="flex justify-end gap-2 no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/create?edit=${selectedReceipt.id}`)}
                icon={<Edit3 className="w-4 h-4" />}
              >
                Edit
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-4 h-4" />}
              >
                Print / Save PDF
              </Button>
            </div>
            <ReceiptPreview receipt={selectedReceipt} />
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <Modal
        isOpen={!!receiptToDelete}
        onClose={() => setReceiptToDelete(null)}
        title="Delete Receipt?"
        description="This action cannot be undone."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete receipt{' '}
            <strong className="text-violet-300 font-mono">{receiptToDelete?.receiptNumber}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setReceiptToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
