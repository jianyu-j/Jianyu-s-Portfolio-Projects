import React from 'react';
import { CoachInvoice } from '../../../types';
import { Button } from '../../ui/Button';

interface InvoicePreviewModalProps {
    invoice: CoachInvoice;
    onClose: () => void;
    onSend: () => void;
    onDownload: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
    invoice,
    onClose,
    onSend,
    onDownload
}) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const statusConfig: Record<CoachInvoice['status'], { label: string; color: string; bgColor: string }> = {
        draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
        sent: { label: 'Sent', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        paid: { label: 'Paid', color: 'text-green-600', bgColor: 'bg-green-100' },
        overdue: { label: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' }
    };

    const status = statusConfig[invoice.status];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slideDown">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-portal-club/10 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📄</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Invoice Preview</h2>
                            <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bgColor} ${status.color}`}>
                            {status.label}
                        </span>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                            ✕
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
                        {/* Invoice Document */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Invoice Header */}
                            <div className="p-6 bg-gradient-to-r from-portal-club to-teal-600 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold">INVOICE</h1>
                                        <p className="text-white/80 mt-1">{invoice.invoiceNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">Vancouver Tennis Club</p>
                                        <p className="text-sm text-white/80">Premium Tennis Training</p>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    {/* Bill To */}
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Bill To</p>
                                        <p className="font-bold text-gray-800">{invoice.coachName}</p>
                                        <p className="text-sm text-gray-600">{invoice.coachEmail}</p>
                                    </div>
                                    {/* Invoice Info */}
                                    <div className="text-right">
                                        <div className="space-y-1">
                                            <div className="flex justify-end gap-4">
                                                <span className="text-sm text-gray-500">Invoice Date:</span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {formatDate(invoice.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-end gap-4">
                                                <span className="text-sm text-gray-500">Period:</span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                                                </span>
                                            </div>
                                            {invoice.dueDate && (
                                                <div className="flex justify-end gap-4">
                                                    <span className="text-sm text-gray-500">Due Date:</span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {formatDate(invoice.dueDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Line Items Table */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr className="text-xs font-bold uppercase text-gray-500">
                                                <th className="text-left p-4">Description</th>
                                                <th className="text-center p-4">Sessions</th>
                                                <th className="text-right p-4">Rate</th>
                                                <th className="text-right p-4">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {invoice.lineItems.map((item, i) => (
                                                <tr key={i} className="text-sm">
                                                    <td className="p-4">
                                                        <p className="font-medium text-gray-800">{item.description}</p>
                                                        <p className="text-xs text-gray-500">{item.programType}</p>
                                                    </td>
                                                    <td className="p-4 text-center text-gray-600">{item.sessionCount}</td>
                                                    <td className="p-4 text-right text-gray-600">
                                                        {formatCurrency(item.rate)}
                                                    </td>
                                                    <td className="p-4 text-right font-medium text-gray-800">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between py-2">
                                            <span className="text-sm text-gray-500">Subtotal</span>
                                            <span className="text-sm font-medium text-gray-800">
                                                {formatCurrency(invoice.subtotal)}
                                            </span>
                                        </div>
                                        {invoice.platformFee > 0 && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-sm text-gray-500">Platform Fee</span>
                                                <span className="text-sm text-gray-600">
                                                    -{formatCurrency(invoice.platformFee)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-3 border-t-2 border-gray-800">
                                            <span className="font-bold text-gray-800">Total Due</span>
                                            <span className="text-xl font-bold text-portal-club">
                                                {formatCurrency(invoice.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Note */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 text-center">
                                        Thank you for your excellent coaching services. Payment is due within 14 days of invoice date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onDownload}>
                            📥 Download PDF
                        </Button>
                        <Button onClick={onSend}>
                            ✉️ Send to {invoice.coachName.split(' ')[0]}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreviewModal;
