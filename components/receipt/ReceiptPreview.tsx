'use client';

import React from 'react';
import { Receipt } from '@/types';
import { formatCurrency } from '@/lib/calculations/receipt';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface ReceiptPreviewProps {
  receipt: Receipt;
  className?: string;
}

export function ReceiptPreview({ receipt, className = '' }: ReceiptPreviewProps) {
  const {
    receiptNumber,
    date,
    time,
    currency,
    business,
    customer,
    items,
    subtotal,
    discountAmount,
    discountType,
    discountValue,
    isGstEnabled,
    gstMode,
    gstType,
    cgstAmount,
    sgstAmount,
    igstAmount,
    cgstRate,
    sgstRate,
    igstRate,
    generalTaxAmount,
    generalTaxRate,
    grandTotal,
    paymentMethod,
    paymentStatus,
    amountPaid,
    balanceDue,
    notes,
    terms,
    template = 'modern',
    size = 'a4',
  } = receipt;

  const paymentMethodLabels: Record<string, string> = {
    cash: 'Cash',
    card: 'Credit / Debit Card',
    upi: 'UPI / QR',
    bank_transfer: 'Bank Transfer',
    cheque: 'Cheque',
    other: 'Other',
  };

  // Thermal Receipt Layout (80mm)
  if (size === 'thermal') {
    return (
      <div
        className={`print-receipt-container bg-white text-slate-900 font-mono p-6 max-w-[380px] mx-auto shadow-2xl rounded-xl border border-slate-300 text-xs leading-relaxed ${className}`}
      >
        {/* Business Header */}
        <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
          {business.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo}
              alt={business.name}
              className="max-h-12 max-w-[120px] mx-auto object-contain mb-1"
            />
          )}
          <h1 className="font-bold text-sm uppercase tracking-wider text-slate-900">{business.name || 'BUSINESS NAME'}</h1>
          {business.address && <p className="text-[11px] text-slate-600">{business.address}</p>}
          {(business.city || business.state || business.postalCode) && (
            <p className="text-[11px] text-slate-600">
              {[business.city, business.state, business.postalCode].filter(Boolean).join(', ')}
            </p>
          )}
          {business.phone && <p className="text-[11px] text-slate-600">Tel: {business.phone}</p>}
          {business.gstin && <p className="text-[11px] font-semibold text-slate-900">GSTIN: {business.gstin}</p>}
        </div>

        {/* Receipt Meta */}
        <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="font-semibold">Receipt No:</span>
            <span className="font-bold text-purple-900">{receiptNumber || 'REC-0001'}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span>{date} {time ? `• ${time}` : ''}</span>
          </div>
          {customer.name && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-semibold">{customer.name}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex justify-between">
              <span>Cust Phone:</span>
              <span>{customer.phone}</span>
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="py-2.5 border-b border-dashed border-slate-400">
          <div className="flex justify-between font-bold text-[11px] uppercase pb-1 border-b border-slate-300">
            <span>Item</span>
            <span className="text-right">Qty x Price</span>
            <span className="text-right">Total</span>
          </div>
          <div className="divide-y divide-slate-100 pt-1 space-y-1.5">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="text-[11px] pt-1">
                <div className="font-semibold">{item.name || 'Item'}</div>
                <div className="flex justify-between text-slate-600">
                  <span>{item.quantity} × {formatCurrency(item.unitPrice, currency)}</span>
                  <span className="font-medium text-slate-900">{formatCurrency(item.total, currency)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currency)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}</span>
              <span>-{formatCurrency(discountAmount, currency)}</span>
            </div>
          )}

          {isGstEnabled ? (
            <>
              {gstType === 'cgst_sgst' ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST ({cgstRate}%)</span>
                    <span>{formatCurrency(cgstAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST ({sgstRate}%)</span>
                    <span>{formatCurrency(sgstAmount, currency)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-600">
                  <span>IGST ({igstRate}%)</span>
                  <span>{formatCurrency(igstAmount, currency)}</span>
                </div>
              )}
              {gstMode === 'inclusive' && (
                <div className="text-[10px] text-slate-500 text-right italic">(GST Inclusive)</div>
              )}
            </>
          ) : generalTaxAmount > 0 ? (
            <div className="flex justify-between text-slate-600">
              <span>Tax ({generalTaxRate}%)</span>
              <span>{formatCurrency(generalTaxAmount, currency)}</span>
            </div>
          ) : null}

          <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-300">
            <span>GRAND TOTAL</span>
            <span className="text-purple-900">{formatCurrency(grandTotal, currency)}</span>
          </div>

          <div className="flex justify-between text-slate-700 pt-1">
            <span>Payment ({paymentMethodLabels[paymentMethod] || paymentMethod})</span>
            <span className="font-semibold uppercase">{paymentStatus.replace('_', ' ')}</span>
          </div>

          {paymentStatus === 'partially_paid' && (
            <>
              <div className="flex justify-between text-slate-600">
                <span>Paid Amount:</span>
                <span>{formatCurrency(amountPaid, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-orange-700">
                <span>Balance Due:</span>
                <span>{formatCurrency(balanceDue, currency)}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Notes */}
        <div className="pt-3 text-center space-y-1.5 text-[10px] text-slate-600">
          {notes && <p className="font-medium text-slate-800">{notes}</p>}
          {terms && <p>{terms}</p>}
          <p className="font-semibold tracking-wider pt-1">*** THANK YOU ***</p>
        </div>
      </div>
    );
  }

  // A4 Layouts: Minimal, Modern, or Classic
  return (
    <div
      className={`print-receipt-container bg-white text-slate-900 p-8 sm:p-10 max-w-3xl mx-auto shadow-2xl rounded-2xl border border-slate-200 min-h-[750px] flex flex-col justify-between transition-all ${className}`}
    >
      <div>
        {/* TEMPLATE 1: MODERN */}
        {template === 'modern' && (
          <div>
            {/* Top Violet to Dark Orange Accent Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 rounded-full mb-6" />

            {/* Header: Business info left, Receipt info right */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-2">
                {business.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="max-h-14 max-w-[180px] object-contain mb-2"
                  />
                )}
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {business.name || 'Your Business Name'}
                </h1>
                <div className="text-xs text-slate-600 space-y-0.5 max-w-xs leading-relaxed">
                  {business.address && <p>{business.address}</p>}
                  {(business.city || business.state || business.postalCode) && (
                    <p>{[business.city, business.state, business.postalCode].filter(Boolean).join(', ')}</p>
                  )}
                  {business.phone && <p>Phone: {business.phone}</p>}
                  {business.email && <p>Email: {business.email}</p>}
                  {business.website && <p>Web: {business.website}</p>}
                  {business.gstin && (
                    <p className="font-semibold text-slate-800">GSTIN / Tax ID: {business.gstin}</p>
                  )}
                </div>
              </div>

              <div className="sm:text-right space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                  Official Receipt
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Receipt No.</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{receiptNumber || 'REC-1001'}</p>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="text-slate-400">Date: </span>
                    <span className="font-semibold text-slate-800">{date}</span>
                    {time && <span className="text-slate-500 ml-1">({time})</span>}
                  </p>
                  <p>
                    <span className="text-slate-400">Payment: </span>
                    <span className="font-semibold text-slate-800">
                      {paymentMethodLabels[paymentMethod] || paymentMethod}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider mb-1">Billed To</p>
                <h2 className="text-sm font-bold text-slate-900">{customer.name || 'Valued Customer'}</h2>
                {customer.phone && <p className="text-xs text-slate-600 mt-0.5">Phone: {customer.phone}</p>}
                {customer.email && <p className="text-xs text-slate-600">Email: {customer.email}</p>}
              </div>
              {(customer.address || customer.city || customer.state) && (
                <div className="sm:text-right text-xs text-slate-600 max-w-xs space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Billing Address</p>
                  {customer.address && <p>{customer.address}</p>}
                  <p>{[customer.city, customer.state, customer.postalCode].filter(Boolean).join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TEMPLATE 2: CLASSIC */}
        {template === 'classic' && (
          <div>
            <div className="text-center pb-6 border-b-2 border-slate-900">
              {business.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logo}
                  alt={business.name}
                  className="max-h-16 max-w-[200px] mx-auto object-contain mb-2"
                />
              )}
              <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase">
                {business.name || 'Your Business Name'}
              </h1>
              <div className="text-xs text-slate-600 flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 font-serif">
                {business.address && <span>{business.address}</span>}
                {(business.city || business.state) && <span>{[business.city, business.state, business.postalCode].filter(Boolean).join(', ')}</span>}
                {business.phone && <span>Tel: {business.phone}</span>}
                {business.email && <span>Email: {business.email}</span>}
                {business.gstin && <span className="font-bold">GSTIN: {business.gstin}</span>}
              </div>
            </div>

            <div className="py-4 border-b border-slate-300 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <p><span className="font-bold text-slate-700">RECEIPT NO:</span> <span className="font-mono font-bold">{receiptNumber}</span></p>
                <p><span className="font-bold text-slate-700">DATE:</span> {date} {time ? `(${time})` : ''}</p>
              </div>
              <div className="text-right space-y-1">
                <p><span className="font-bold text-slate-700">PAYMENT METHOD:</span> {paymentMethodLabels[paymentMethod] || paymentMethod}</p>
                <p><span className="font-bold text-slate-700">STATUS:</span> <span className="uppercase font-bold">{paymentStatus.replace('_', ' ')}</span></p>
              </div>
            </div>

            {customer.name && (
              <div className="py-3 border-b border-slate-200 text-xs">
                <span className="font-bold text-slate-700">RECEIVED WITH THANKS FROM:</span>{' '}
                <span className="font-semibold text-slate-900">{customer.name}</span>
                {customer.phone && <span className="text-slate-600 ml-2">({customer.phone})</span>}
                {customer.address && <span className="text-slate-600 ml-2">— {customer.address}</span>}
              </div>
            )}
          </div>
        )}

        {/* TEMPLATE 3: MINIMAL */}
        {template === 'minimal' && (
          <div>
            <div className="flex justify-between items-start pb-8">
              <div className="space-y-1">
                {business.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="max-h-12 max-w-[160px] object-contain mb-3"
                  />
                )}
                <h1 className="text-xl font-medium tracking-tight text-slate-900">
                  {business.name || 'Business Name'}
                </h1>
                <p className="text-xs text-slate-400">{business.email || business.phone || business.address}</p>
                {business.gstin && <p className="text-xs text-slate-500 font-mono">Tax ID: {business.gstin}</p>}
              </div>

              <div className="text-right space-y-1">
                <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">RECEIPT</span>
                <p className="text-lg font-mono font-semibold text-slate-900">{receiptNumber}</p>
                <p className="text-xs text-slate-400">{date}</p>
              </div>
            </div>

            <div className="pb-6 border-b border-slate-100 flex justify-between text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">CLIENT</p>
                <p className="font-medium text-slate-900 mt-0.5">{customer.name || '—'}</p>
                {customer.phone && <p className="text-slate-500">{customer.phone}</p>}
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[11px]">PAYMENT</p>
                <p className="font-medium text-slate-900 mt-0.5">{paymentMethodLabels[paymentMethod]}</p>
                <p className="text-slate-500 capitalize">{paymentStatus.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Common Items Table */}
        <div className="mt-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5 pr-2 w-10 text-center">#</th>
                <th className="py-2.5 px-2">Item & Description</th>
                <th className="py-2.5 px-2 text-center w-16">Qty</th>
                <th className="py-2.5 px-2 text-right w-24">Unit Price</th>
                <th className="py-2.5 pl-2 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {items.map((item, index) => (
                <tr key={item.id || index} className="align-top">
                  <td className="py-3 pr-2 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-slate-900">{item.name || 'Untitled Item'}</p>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-600">
                    {formatCurrency(item.unitPrice, currency)}
                  </td>
                  <td className="py-3 pl-2 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(item.total, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Block */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Notes & Status Left */}
          <div className="w-full sm:max-w-xs space-y-3">
            <div className="flex items-center gap-2">
              {paymentStatus === 'paid' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> FULLY PAID
                </span>
              )}
              {paymentStatus === 'partially_paid' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  <Clock className="w-3.5 h-3.5" /> PARTIALLY PAID
                </span>
              )}
              {paymentStatus === 'pending' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5" /> PAYMENT PENDING
                </span>
              )}
            </div>

            {notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                <p className="font-bold text-slate-800 text-[11px] uppercase mb-1">Notes</p>
                <p className="leading-relaxed">{notes}</p>
              </div>
            )}

            {terms && (
              <div className="text-[11px] text-slate-500 leading-relaxed">
                <p className="font-semibold text-slate-700 uppercase text-[10px]">Terms & Conditions:</p>
                <p>{terms}</p>
              </div>
            )}
          </div>

          {/* Totals Breakdown Right */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 py-0.5">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(subtotal, currency)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 py-0.5">
                <span>
                  Discount {discountType === 'percentage' ? `(${discountValue}%)` : ''}:
                </span>
                <span className="font-mono font-semibold">-{formatCurrency(discountAmount, currency)}</span>
              </div>
            )}

            {/* GST / Tax Line Items */}
            {isGstEnabled ? (
              <>
                {gstType === 'cgst_sgst' ? (
                  <>
                    <div className="flex justify-between text-slate-600 py-0.5">
                      <span>CGST ({cgstRate}%):</span>
                      <span className="font-mono">{formatCurrency(cgstAmount, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 py-0.5">
                      <span>SGST ({sgstRate}%):</span>
                      <span className="font-mono">{formatCurrency(sgstAmount, currency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-600 py-0.5">
                    <span>IGST ({igstRate}%):</span>
                    <span className="font-mono">{formatCurrency(igstAmount, currency)}</span>
                  </div>
                )}
                {gstMode === 'inclusive' && (
                  <p className="text-[10px] text-slate-400 text-right italic">(GST inclusive)</p>
                )}
              </>
            ) : generalTaxAmount > 0 ? (
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>Tax ({generalTaxRate}%):</span>
                <span className="font-mono">{formatCurrency(generalTaxAmount, currency)}</span>
              </div>
            ) : null}

            {/* Grand Total */}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t-2 border-slate-900">
              <span>Total:</span>
              <span className="font-mono tracking-tight text-purple-900">
                {formatCurrency(grandTotal, currency)}
              </span>
            </div>

            {paymentStatus === 'partially_paid' && (
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Amount Paid:</span>
                  <span className="font-mono">{formatCurrency(amountPaid, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-orange-700">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(balanceDue, currency)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature & Bottom Brand */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-slate-400">
        <div>
          <p className="font-semibold text-slate-700">Thank you for your business!</p>
          <p className="text-[11px]">Computer-generated receipt powered by BillMate Studio.</p>
        </div>

        <div className="text-center sm:text-right">
          <div className="w-40 border-b border-slate-300 pb-1 mb-1" />
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Authorized Signatory</p>
        </div>
      </div>
    </div>
  );
}
