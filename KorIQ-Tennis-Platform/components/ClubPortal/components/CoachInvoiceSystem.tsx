import React, { useState, useMemo } from 'react';
import { Coach, CoachInvoice } from '../../../types';
import { Button } from '../../ui/Button';
import InvoicePreviewModal from './InvoicePreviewModal';

interface CoachInvoiceSystemProps {
  clubId: string;
  coaches: Coach[];
  onPayInvoice?: (invoiceId: string) => void;
}

type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'rejected';
type InvoiceTab = 'pending' | 'approved' | 'paid' | 'all';

interface CoachSubmittedInvoice {
  id: string;
  invoiceNumber: string;
  coachId: string;
  coachName: string;
  coachEmail: string;
  submittedAt: string;
  periodStart: string;
  periodEnd: string;
  lineItems: {
    description: string;
    programType: string;
    hours: number;
    rate: number;
    amount: number;
  }[];
  totalHours: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  approvedAt?: string;
  paidAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

// Generate mock invoices
const generateMockInvoices = (coaches: Coach[]): CoachSubmittedInvoice[] => {
  const invoices: CoachSubmittedInvoice[] = [];
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  coaches.forEach((coach, idx) => {
    // Pending invoice for this month
    if (idx < 2) {
      const privateHours = Math.floor(15 + Math.random() * 20);
      const groupHours = Math.floor(5 + Math.random() * 10);
      invoices.push({
        id: `inv_pending_${coach.id}`,
        invoiceNumber: `INV-2026-${String(100 + idx).padStart(3, '0')}`,
        coachId: coach.id,
        coachName: coach.name,
        coachEmail: coach.email,
        submittedAt: new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        periodStart: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
        lineItems: [
          { description: 'Private Lessons', programType: 'Private Lesson', hours: privateHours, rate: 85, amount: privateHours * 85 },
          { description: 'Group Classes', programType: 'Group Class', hours: groupHours, rate: 50, amount: groupHours * 50 }
        ],
        totalHours: privateHours + groupHours,
        total: privateHours * 85 + groupHours * 50,
        status: 'pending',
        notes: idx === 0 ? 'Please review - I had 2 extra private lessons this month due to tournament prep requests.' : undefined
      });
    }
    
    // Approved invoice waiting for payment
    if (idx === 0) {
      const privateHours = Math.floor(18 + Math.random() * 15);
      const groupHours = Math.floor(8 + Math.random() * 8);
      invoices.push({
        id: `inv_approved_${coach.id}`,
        invoiceNumber: `INV-2026-${String(90 + idx).padStart(3, '0')}`,
        coachId: coach.id,
        coachName: coach.name,
        coachEmail: coach.email,
        submittedAt: new Date(lastMonth.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        periodStart: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString().split('T')[0],
        periodEnd: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).toISOString().split('T')[0],
        lineItems: [
          { description: 'Private Lessons', programType: 'Private Lesson', hours: privateHours, rate: 85, amount: privateHours * 85 },
          { description: 'Group Classes', programType: 'Group Class', hours: groupHours, rate: 50, amount: groupHours * 50 }
        ],
        totalHours: privateHours + groupHours,
        total: privateHours * 85 + groupHours * 50,
        status: 'approved',
        approvedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Paid invoice from last month
    const privateHours = Math.floor(20 + Math.random() * 15);
    const groupHours = Math.floor(10 + Math.random() * 10);
    invoices.push({
      id: `inv_paid_${coach.id}`,
      invoiceNumber: `INV-2026-${String(80 + idx).padStart(3, '0')}`,
      coachId: coach.id,
      coachName: coach.name,
      coachEmail: coach.email,
      submittedAt: new Date(lastMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      periodStart: new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, 1).toISOString().split('T')[0],
      periodEnd: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 0).toISOString().split('T')[0],
      lineItems: [
        { description: 'Private Lessons', programType: 'Private Lesson', hours: privateHours, rate: 85, amount: privateHours * 85 },
        { description: 'Group Classes', programType: 'Group Class', hours: groupHours, rate: 50, amount: groupHours * 50 }
      ],
      totalHours: privateHours + groupHours,
      total: privateHours * 85 + groupHours * 50,
      status: 'paid',
      approvedAt: new Date(lastMonth.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date(lastMonth.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString()
    });
  });
  
  return invoices;
};

const CoachInvoiceSystem: React.FC<CoachInvoiceSystemProps> = ({
  clubId,
  coaches,
  onPayInvoice
}) => {
  const [invoices, setInvoices] = useState<CoachSubmittedInvoice[]>(() => generateMockInvoices(coaches));
  const [activeTab, setActiveTab] = useState<InvoiceTab>('pending');
  const [selectedInvoice, setSelectedInvoice] = useState<CoachSubmittedInvoice | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter invoices by tab
  const filteredInvoices = useMemo(() => {
    if (activeTab === 'all') return invoices;
    return invoices.filter(inv => inv.status === activeTab);
  }, [invoices, activeTab]);

  // Calculate totals
  const totals = useMemo(() => {
    const pending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0);
    const approved = invoices.filter(i => i.status === 'approved').reduce((s, i) => s + i.total, 0);
    const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
    return { pending, approved, paid };
  }, [invoices]);

  const handleApprove = (invoice: CoachSubmittedInvoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'approved' as const, approvedAt: new Date().toISOString() }
        : inv
    ));
    setShowApprovalModal(false);
    setSelectedInvoice(null);
  };

  const handleReject = (invoice: CoachSubmittedInvoice) => {
    if (!rejectionReason.trim()) return;
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'rejected' as const, rejectedAt: new Date().toISOString(), rejectionReason }
        : inv
    ));
    setShowRejectModal(false);
    setSelectedInvoice(null);
    setRejectionReason('');
  };

  const handleMarkPaid = (invoice: CoachSubmittedInvoice) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoice.id 
        ? { ...inv, status: 'paid' as const, paidAt: new Date().toISOString() }
        : inv
    ));
    if (onPayInvoice) onPayInvoice(invoice.id);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Pending Review</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Approved - Awaiting Payment</span>;
      case 'paid':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Paid</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Rejected</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const tabs: { id: InvoiceTab; label: string; count: number; color: string }[] = [
    { id: 'pending', label: 'Pending Review', count: invoices.filter(i => i.status === 'pending').length, color: 'text-yellow-600' },
    { id: 'approved', label: 'Ready to Pay', count: invoices.filter(i => i.status === 'approved').length, color: 'text-blue-600' },
    { id: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length, color: 'text-green-600' },
    { id: 'all', label: 'All Invoices', count: invoices.length, color: 'text-gray-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Coach Invoice Management</h2>
          <p className="text-sm text-gray-500 mt-1">Review and process coach payout invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-xs text-yellow-600 uppercase font-bold">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">${totals.pending.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status === 'pending').length} invoice(s)</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-xs text-blue-600 uppercase font-bold">Ready to Pay</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">${totals.approved.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status === 'approved').length} invoice(s)</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-xs text-green-600 uppercase font-bold">Paid This Month</p>
          <p className="text-2xl font-bold text-green-700 mt-1">${totals.paid.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{invoices.filter(i => i.status === 'paid').length} invoice(s)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-portal-club text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === tab.id ? 'bg-portal-club text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            <p className="text-gray-600 mt-4 font-medium">No invoices in this category</p>
            <p className="text-sm text-gray-400 mt-1">Invoices will appear here when coaches submit them</p>
          </div>
        ) : (
          filteredInvoices.map(invoice => (
            <div 
              key={invoice.id}
              className={`bg-white rounded-xl border-2 p-5 transition-all ${
                invoice.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' :
                invoice.status === 'approved' ? 'border-blue-200 bg-blue-50/30' :
                invoice.status === 'paid' ? 'border-green-200' :
                'border-gray-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-portal-club/10 rounded-full flex items-center justify-center">
                      <span className="text-portal-club font-bold text-sm">
                        {invoice.coachName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{invoice.coachName}</h4>
                      <p className="text-xs text-gray-500">{invoice.invoiceNumber} • Submitted {formatDate(invoice.submittedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Period:</span>
                      <span className="font-medium text-gray-800 ml-1">
                        {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hours:</span>
                      <span className="font-medium text-gray-800 ml-1">{invoice.totalHours}h</span>
                    </div>
                  </div>

                  {/* Line Items Preview */}
                  <div className="mt-3 space-y-1">
                    {invoice.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.description} ({item.hours}h × ${item.rate}/hr)</span>
                        <span className="font-medium text-gray-800">${item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {invoice.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-bold">Coach Note:</span> {invoice.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                    <p className="text-2xl font-bold text-gray-800">${invoice.total.toLocaleString()}</p>
                  </div>
                  {getStatusBadge(invoice.status)}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    {invoice.status === 'pending' && (
                      <>
                        <Button
                          className="text-xs py-1.5 px-3 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowApprovalModal(true);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs py-1.5 px-3"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowRejectModal(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {invoice.status === 'approved' && (
                      <Button
                        className="text-xs py-1.5 px-3"
                        onClick={() => handleMarkPaid(invoice)}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-xs text-portal-club hover:underline font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Approval Confirmation Modal */}
      {showApprovalModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Approve Invoice?</h3>
            <p className="text-gray-600 mb-4">
              Approve invoice <span className="font-bold">{selectedInvoice.invoiceNumber}</span> from{' '}
              <span className="font-bold">{selectedInvoice.coachName}</span> for{' '}
              <span className="font-bold text-green-600">${selectedInvoice.total.toLocaleString()}</span>?
            </p>
            <div className="flex gap-3 mt-6">
              <Button
                fullWidth
                onClick={() => handleApprove(selectedInvoice)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve Invoice
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedInvoice(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Reject Invoice</h3>
            <p className="text-gray-600 mb-4">
              Reject invoice <span className="font-bold">{selectedInvoice.invoiceNumber}</span> from{' '}
              <span className="font-bold">{selectedInvoice.coachName}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Reason for Rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                fullWidth
                onClick={() => handleReject(selectedInvoice)}
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectionReason.trim()}
              >
                Reject Invoice
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedInvoice(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal - Simple View */}
      {selectedInvoice && !showApprovalModal && !showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">{selectedInvoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500">{selectedInvoice.coachName}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Period</span>
                <span className="font-medium">{formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted</span>
                <span className="font-medium">{formatDate(selectedInvoice.submittedAt)}</span>
              </div>
              {selectedInvoice.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Approved</span>
                  <span className="font-medium">{formatDate(selectedInvoice.approvedAt)}</span>
                </div>
              )}
              {selectedInvoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid</span>
                  <span className="font-medium">{formatDate(selectedInvoice.paidAt)}</span>
                </div>
              )}
              
              <hr className="border-gray-200" />
              
              <div>
                <p className="text-xs uppercase font-bold text-gray-500 mb-2">Line Items</p>
                {selectedInvoice.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-xs text-gray-500">{item.hours} hours × ${item.rate}/hr</p>
                    </div>
                    <span className="font-bold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-green-600">${selectedInvoice.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button fullWidth variant="secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachInvoiceSystem;
