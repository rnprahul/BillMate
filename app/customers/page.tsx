'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  X
} from 'lucide-react';
import { Customer } from '@/types';
import { StorageService } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations/receipt';
import { useToast } from '@/components/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function CustomersPage() {
  const { success } = useToast();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Form fields for Add / Edit
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    StorageService.initialize();
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    setCustomers(StorageService.getCustomers());
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormCity('');
    setFormState('');
    setFormPostalCode('');
    setNameError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormPhone(cust.phone || '');
    setFormEmail(cust.email || '');
    setFormAddress(cust.address || '');
    setFormCity(cust.city || '');
    setFormState(cust.state || '');
    setFormPostalCode(cust.postalCode || '');
    setNameError('');
    setIsAddModalOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formName.trim()) {
      setNameError('Customer name is required.');
      return;
    }

    const customerData: Customer = {
      id: editingCustomer?.id || `cust-${Date.now()}`,
      name: formName.trim(),
      phone: formPhone.trim() || undefined,
      email: formEmail.trim() || undefined,
      address: formAddress.trim() || undefined,
      city: formCity.trim() || undefined,
      state: formState.trim() || undefined,
      postalCode: formPostalCode.trim() || undefined,
      totalSpent: editingCustomer?.totalSpent || 0,
      receiptCount: editingCustomer?.receiptCount || 0,
      createdAt: editingCustomer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveCustomer(customerData);
    loadCustomers();
    success(editingCustomer ? 'Customer updated.' : 'Customer added successfully.');
    setIsAddModalOpen(false);
  };

  const confirmDelete = () => {
    if (!customerToDelete) return;
    StorageService.deleteCustomer(customerToDelete.id);
    loadCustomers();
    success('Customer deleted.');
    setCustomerToDelete(null);
  };

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#29203f] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Clients & Customers ({customers.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your client directory, contact records, and total transaction spend.
          </p>
        </div>

        <Button variant="accent" size="md" onClick={openAddModal} icon={<PlusCircle className="w-4 h-4" />}>
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-violet-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email..."
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
        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredCustomers.length}</strong> clients
        </div>
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#120e20] border border-dashed border-[#3b2d5f] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#181329] text-violet-400 flex items-center justify-center mx-auto border border-[#3b2d5f]">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No clients found</h3>
            <p className="text-xs text-slate-400">
              Add your first customer to quickly auto-populate their info during receipt generation.
            </p>
          </div>
          <Button variant="accent" size="sm" onClick={openAddModal} icon={<PlusCircle className="w-4 h-4" />}>
            Add Customer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="p-5 rounded-2xl bg-[#120e20] border border-[#2d2448] shadow-lg hover:border-violet-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-800/60 text-violet-300 font-black text-sm flex items-center justify-center">
                      {cust.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">
                        {cust.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">ID: {cust.id.slice(-6)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(cust)}
                      className="p-1.5 text-slate-400 hover:text-violet-300 hover:bg-[#251c40] rounded-lg transition-colors"
                      title="Edit Customer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerToDelete(cust)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-[#231a3d]">
                  {cust.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                  )}
                  {cust.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {(cust.address || cust.city) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        {[cust.address, cust.city, cust.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Spend & Receipts Footer */}
              <div className="pt-3 border-t border-[#231a3d] flex items-center justify-between text-xs bg-[#181329] -mx-5 -mb-5 p-3.5 rounded-b-2xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-violet-400">Total Spent</p>
                  <p className="font-mono font-black text-white">
                    {formatCurrency(cust.totalSpent || 0, 'INR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-orange-400">Receipts</p>
                  <p className="font-bold text-orange-300">
                    {cust.receiptCount || 0} invoice{cust.receiptCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        description="Saved customer details will auto-fill in receipt creator"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Input
            label="Customer / Company Name"
            placeholder="e.g. Acme Innovations Ltd."
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={nameError}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
            <Input
              label="Email Address"
              placeholder="e.g. billing@acme.com"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          <Input
            label="Street Address"
            placeholder="e.g. Flat 301, Lakeview Residency"
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="City"
              placeholder="e.g. Bengaluru"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
            />
            <Input
              label="State"
              placeholder="e.g. Karnataka"
              value={formState}
              onChange={(e) => setFormState(e.target.value)}
            />
            <Input
              label="Postal Code"
              placeholder="e.g. 560001"
              value={formPostalCode}
              onChange={(e) => setFormPostalCode(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#29203f]">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION DIALOG */}
      <Modal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        title="Delete Customer?"
        description="This action will remove the customer profile from your directory."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete{' '}
            <strong className="text-white">{customerToDelete?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCustomerToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
