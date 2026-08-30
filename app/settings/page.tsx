'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Receipt as ReceiptIcon, 
  Palette, 
  Database, 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { AppSettings, CURRENCIES, CurrencyCode, PAYMENT_METHODS, PaymentMethod, ReceiptSize, ReceiptTemplate } from '@/types';
import { StorageService, DEFAULT_SETTINGS } from '@/lib/storage';
import { useToast } from '@/components/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

export default function SettingsPage() {
  const { success, error: showError, info } = useToast();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isImportConfirmOpen, setIsImportConfirmOpen] = useState(false);
  const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);

  useEffect(() => {
    StorageService.initialize();
    loadSettings();
  }, []);

  const loadSettings = () => {
    const loaded = StorageService.getSettings();
    setSettings(loaded);
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showError('Logo must be smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSettings((prev) => ({
        ...prev,
        savedBusiness: {
          ...prev.savedBusiness,
          logo: reader.result as string,
        },
      }));
      info('Logo uploaded.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    StorageService.saveSettings(settings);
    success('Settings saved successfully.');
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataString = StorageService.exportAllData();
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billmate-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Receipt data exported successfully.');
  };

  // Trigger import
  const handleFileSelectForImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPendingImportJson(content);
      setIsImportConfirmOpen(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (!pendingImportJson) return;
    const result = StorageService.importAllData(pendingImportJson);
    if (result.success) {
      success(`Import complete! Loaded ${result.counts?.receipts || 0} receipts.`);
      loadSettings();
    } else {
      showError(result.message);
    }
    setIsImportConfirmOpen(false);
    setPendingImportJson(null);
  };

  // Clear data
  const confirmClearAll = () => {
    StorageService.clearAllData();
    StorageService.initialize();
    loadSettings();
    success('All data has been reset to defaults.');
    setIsClearModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#29203f] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Application Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure business profiles, receipt defaults, templates, and data backup.
          </p>
        </div>

        <Button variant="accent" size="md" onClick={handleSaveAll} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>

      {/* SECTION 1: BUSINESS PROFILE DEFAULTS */}
      <div className="p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-[#29203f] pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Building2 className="w-4 h-4 text-violet-400" />
            Default Business Profile
          </div>
          <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-violet-300">
            <input
              type="checkbox"
              checked={settings.useSavedBusinessByDefault}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, useSavedBusinessByDefault: e.target.checked }))
              }
              className="rounded text-violet-600 focus:ring-violet-500"
            />
            <span>Auto-fill on new receipts</span>
          </label>
        </div>

        {/* Logo Upload */}
        <div className="flex items-center gap-4">
          {settings.savedBusiness?.logo ? (
            <div className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.savedBusiness.logo}
                alt="Saved Business Logo"
                className="h-16 w-28 object-contain rounded-xl border border-[#3b2d5f] bg-[#181329] p-1"
              />
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    savedBusiness: { ...prev.savedBusiness, logo: '' },
                  }))
                }
                className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors"
                title="Remove logo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="h-16 px-4 rounded-xl border-2 border-dashed border-[#3b2d5f] hover:border-violet-500 text-slate-400 hover:text-violet-300 flex items-center gap-2 text-xs font-bold transition-all bg-[#181329]/50"
            >
              <Upload className="w-4 h-4 text-violet-400" />
              Upload Default Logo
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <span className="text-xs text-slate-400">Appears on every generated receipt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            placeholder="e.g. Apex Tech Labs"
            value={settings.savedBusiness?.name || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, name: e.target.value },
              }))
            }
          />
          <Input
            label="GSTIN / Tax ID"
            placeholder="e.g. 29ABCDE1234F1Z5"
            value={settings.savedBusiness?.gstin || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, gstin: e.target.value },
              }))
            }
          />
          <Input
            label="Phone"
            placeholder="e.g. +91 98765 43210"
            value={settings.savedBusiness?.phone || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, phone: e.target.value },
              }))
            }
          />
          <Input
            label="Email"
            placeholder="e.g. billing@apex.io"
            type="email"
            value={settings.savedBusiness?.email || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, email: e.target.value },
              }))
            }
          />
          <Input
            label="Website"
            placeholder="e.g. https://apex.io"
            value={settings.savedBusiness?.website || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, website: e.target.value },
              }))
            }
          />
          <Input
            label="Street Address"
            placeholder="e.g. Suite 402, Cyber Tower"
            value={settings.savedBusiness?.address || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, address: e.target.value },
              }))
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            placeholder="e.g. Bengaluru"
            value={settings.savedBusiness?.city || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, city: e.target.value },
              }))
            }
          />
          <Input
            label="State"
            placeholder="e.g. Karnataka"
            value={settings.savedBusiness?.state || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, state: e.target.value },
              }))
            }
          />
          <Input
            label="Postal Code"
            placeholder="e.g. 560100"
            value={settings.savedBusiness?.postalCode || ''}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                savedBusiness: { ...prev.savedBusiness, postalCode: e.target.value },
              }))
            }
          />
        </div>
      </div>

      {/* SECTION 2: RECEIPT NUMBERING & DEFAULTS */}
      <div className="p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-5">
        <div className="flex items-center gap-2 font-bold text-sm text-white border-b border-[#29203f] pb-3">
          <ReceiptIcon className="w-4 h-4 text-violet-400" />
          Receipt Defaults & Numbering
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Receipt Prefix"
            placeholder="e.g. REC-"
            value={settings.receiptPrefix}
            onChange={(e) => setSettings((prev) => ({ ...prev, receiptPrefix: e.target.value }))}
          />
          <Input
            label="Next Receipt Number"
            type="number"
            value={settings.nextReceiptNumber}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, nextReceiptNumber: parseInt(e.target.value) || 1001 }))
            }
          />
          <Select
            label="Default Currency"
            value={settings.defaultCurrency}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, defaultCurrency: e.target.value as CurrencyCode }))
            }
            options={Object.values(CURRENCIES).map((c) => ({
              value: c.code,
              label: c.label,
            }))}
          />
          <Select
            label="Default Payment Method"
            value={settings.defaultPaymentMethod}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                defaultPaymentMethod: e.target.value as PaymentMethod,
              }))
            }
            options={PAYMENT_METHODS.map((m) => ({
              value: m.id,
              label: m.label,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Default Notes
            </label>
            <textarea
              rows={2}
              value={settings.defaultNotes || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultNotes: e.target.value }))}
              placeholder="e.g. Thank you for your business!"
              className="w-full rounded-xl border border-[#2d2448] bg-[#120e20] text-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Default Terms & Conditions
            </label>
            <textarea
              rows={2}
              value={settings.defaultTerms || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, defaultTerms: e.target.value }))}
              placeholder="e.g. Payment due within 15 days."
              className="w-full rounded-xl border border-[#2d2448] bg-[#120e20] text-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: TEMPLATE PREFERENCES */}
      <div className="p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-5">
        <div className="flex items-center gap-2 font-bold text-sm text-white border-b border-[#29203f] pb-3">
          <Palette className="w-4 h-4 text-violet-400" />
          Default Receipt Format & Template
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Default Template"
            value={settings.defaultTemplate}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                defaultTemplate: e.target.value as ReceiptTemplate,
              }))
            }
            options={[
              { value: 'modern', label: 'Modern Pro' },
              { value: 'classic', label: 'Classic Corporate' },
              { value: 'minimal', label: 'Minimal Clean' },
            ]}
          />

          <Select
            label="Default Format / Size"
            value={settings.defaultSize}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                defaultSize: e.target.value as ReceiptSize,
              }))
            }
            options={[
              { value: 'a4', label: 'A4 Document' },
              { value: 'thermal', label: 'Thermal Slip (80mm)' },
            ]}
          />
        </div>
      </div>

      {/* SECTION 4: DATA MANAGEMENT & BACKUP */}
      <div className="p-6 bg-[#120e20] rounded-2xl border border-[#2d2448] shadow-lg space-y-5">
        <div className="flex items-center gap-2 font-bold text-sm text-white border-b border-[#29203f] pb-3">
          <Database className="w-4 h-4 text-violet-400" />
          Data Backup, Export & Reset
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#181329] border border-[#3b2d5f] space-y-3 flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-white">Export Data</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Download a complete JSON snapshot of all receipts, customers, and settings.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Export JSON Backup
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[#181329] border border-[#3b2d5f] space-y-3 flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-white">Import Data</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Restore application data from a previously exported BillMate backup file.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => backupFileInputRef.current?.click()}
              icon={<Upload className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Import Backup
            </Button>
            <input
              ref={backupFileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelectForImport}
            />
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/60 space-y-3 flex flex-col justify-between">
            <div>
              <p className="font-bold text-xs text-rose-300">Clear Application Data</p>
              <p className="text-[11px] text-rose-400/80 mt-1 leading-relaxed">
                Permanently purge all stored receipts, customers, and business profiles.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsClearModalOpen(true)}
              icon={<Trash2 className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>

      {/* CONFIRM IMPORT MODAL */}
      <Modal
        isOpen={isImportConfirmOpen}
        onClose={() => setIsImportConfirmOpen(false)}
        title="Restore Data Backup?"
        description="This will merge and update your receipts and customer database."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to restore data from this file? Existing receipts and settings will be updated.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsImportConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={confirmImport}>
              Confirm Import
            </Button>
          </div>
        </div>
      </Modal>

      {/* CLEAR DATA CONFIRMATION MODAL */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Reset All BillMate Data?"
        description="Warning: Destructive action."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-950/50 rounded-xl border border-rose-900 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <span>
              This will erase all locally saved receipts and customer profiles from your browser.
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmClearAll}>
              Erase & Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
