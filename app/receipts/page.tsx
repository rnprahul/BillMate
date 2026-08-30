'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Printer, 
  Receipt as ReceiptIcon, 
  X
} from 'lucide-react';
import { Receipt } from '@/types';
import { StorageService } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations/receipt';
import { useToast } from '@/components/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview';

export default function ReceiptsListPage() {
  const router = useRouter();
  const { success } = useToast();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);

  useEffect(() => {
    StorageService.initialize();
    loadReceipts();
  }, []);

  const loadReceipts = () => {
    setReceipts(StorageService.getReceipts());
  };

  // Filter & Sort Logic
  const filteredAndSortedReceipts = useMemo(() => {
    let result = [...receipts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.receiptNumber?.toLowerCase().includes(q) ||
          r.customer?.name?.toLowerCase().includes(q) ||
          r.business?.name?.toLowerCase().includes(q) ||
          r.items?.some((item) => item.name?.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.paymentStatus === statusFilter);
    }

    if (methodFilter !== 'all') {
      result = result.filter((r) => r.paymentMethod === methodFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return (b.grandTotal || 0) - (a.grandTotal || 0);
      }
      if (sortBy === 'lowest') {
        return (a.grandTotal || 0) - (b.grandTotal || 0);
      }
      return 0;
    });

    return result;
  }, [receipts, searchQuery, statusFilter, methodFilter, sortBy]);

  const handleDuplicate = (rec: Receipt) => {
    const nextNum = StorageService.getNextReceiptNumber();
    const duplicated: Receipt = {
      ...rec,
      id: `rec-${Date.now()}`,
      receiptNumber: nextNum,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveReceipt(duplicated);
    loadReceipts();
    success(`Receipt duplicated as ${nextNum}`);
  };

  const confirmDelete = () => {
    if (!receiptToDelete) return;
    StorageService.deleteReceipt(receiptToDelete.id);
    loadReceipts();
    success('Receipt deleted.');
    setReceiptToDelete(null);
    if (selectedReceipt?.id === receiptToDelete.id) {
      setSelectedReceipt(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#29203f] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Saved Receipts ({receipts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view, print, duplicate, or manage all generated invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 to-orange-600 text-white shadow-lg shadow-purple-950 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Create Receipt
          </Link>
        </div>
      </div>

      {/* SEARCH, FILTERS & CONTROLS */}
      <div className="p-4 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by receipt #, customer, item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#2d2448] bg-[#181329] text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#2d2448] bg-[#181329] text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#2d2448] bg-[#181329] text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Credit / Debit Card</option>
              <option value="upi">UPI / QR</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#2d2448] bg-[#181329] text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Amount</option>
              <option value="lowest">Sort: Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Filter Count summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#231a3d]">
          <span>
            Showing <strong className="text-white">{filteredAndSortedReceipts.length}</strong> of {receipts.length} receipts
          </span>
          {(searchQuery || statusFilter !== 'all' || methodFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setMethodFilter('all');
              }}
              className="text-orange-400 hover:text-orange-300 font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* RECEIPTS TABLE */}
      {filteredAndSortedReceipts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#120e20] border border-dashed border-[#3b2d5f] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#181329] text-violet-400 flex items-center justify-center mx-auto border border-[#3b2d5f]">
            <ReceiptIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No matching receipts found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search criteria or create a new receipt.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#2d2448] bg-[#120e20] shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#29203f] bg-[#161127] text-violet-300 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231a3d] text-slate-200">
              {filteredAndSortedReceipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#181329]/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-violet-300">
                    {rec.receiptNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{rec.customer?.name || 'Walk-in'}</p>
                    {rec.customer?.phone && (
                      <p className="text-[11px] text-slate-400">{rec.customer.phone}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{rec.date}</td>
                  <td className="py-3 px-4 text-slate-300">
                    {rec.items?.length || 0} item{rec.items?.length === 1 ? '' : 's'}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-white">
                    {formatCurrency(rec.grandTotal, rec.currency)}
                  </td>
                  <td className="py-3 px-4 uppercase text-[11px] font-semibold text-slate-400">
                    {rec.paymentMethod?.replace('_', ' ')}
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
                        title="View / Print receipt"
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

      {/* VIEW RECEIPT MODAL */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title={`Receipt ${selectedReceipt?.receiptNumber || ''}`}
        description="Print or save as PDF directly from your browser"
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
