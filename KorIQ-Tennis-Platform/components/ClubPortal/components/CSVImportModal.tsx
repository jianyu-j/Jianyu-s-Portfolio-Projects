import React, { useState, useRef, useCallback } from 'react';
import { Student, RevenueEntry, NtrpLevel } from '../../../types';
import { Button } from '../../ui/Button';

// ============================================
// TYPES
// ============================================
interface CSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  email: string;
  amount: string;
  date: string;
  description?: string;
  studentName?: string;
}

interface ParsedPayment {
  id: string;
  email: string;
  amount: number;
  date: string;
  description?: string;
  studentName?: string;
  // Match status
  matchedStudent?: Student;
  matchStatus: 'matched' | 'new' | 'skip' | 'manual';
  manualAssignStudentId?: string;
}

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubId: string;
  existingStudents: Student[];
  onImportComplete: (newStudents: Student[], newPayments: RevenueEntry[]) => void;
}

// ============================================
// COLUMN AUTO-DETECTION PATTERNS
// ============================================
const EMAIL_PATTERNS = ['email', 'customer_email', 'customer email', 'payer', 'payer_email', 'buyer_email', 'user_email', 'e-mail'];
const AMOUNT_PATTERNS = ['amount', 'total', 'price', 'net', 'gross', 'payment', 'sum', 'value', 'paid'];
const DATE_PATTERNS = ['date', 'created', 'created_at', 'timestamp', 'paid_at', 'payment_date', 'transaction_date'];
const NAME_PATTERNS = ['name', 'customer_name', 'student_name', 'full_name', 'customer', 'buyer'];
const DESC_PATTERNS = ['description', 'memo', 'note', 'notes', 'item', 'product', 'service'];

function detectColumn(headers: string[], patterns: string[]): string {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  for (const pattern of patterns) {
    const match = lowerHeaders.find(h => h.includes(pattern));
    if (match) {
      return headers[lowerHeaders.indexOf(match)];
    }
  }
  return '';
}

// ============================================
// CSV PARSER (Simple implementation without papaparse)
// ============================================
function parseCSV(text: string): { headers: string[]; rows: CSVRow[] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: CSVRow = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });
      rows.push(row);
    }
  }
  
  return { headers, rows };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

// ============================================
// COMPONENT
// ============================================
const CSVImportModal: React.FC<CSVImportModalProps> = ({
  isOpen,
  onClose,
  clubId,
  existingStudents,
  onImportComplete
}) => {
  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Upload
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<CSVRow[]>([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Step 2: Column Mapping
  const [mapping, setMapping] = useState<ColumnMapping>({
    email: '',
    amount: '',
    date: '',
    description: '',
    studentName: ''
  });
  
  // Step 3: Preview & Match
  const [parsedPayments, setParsedPayments] = useState<ParsedPayment[]>([]);
  const [autoCreateStudents, setAutoCreateStudents] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  // ============================================
  // STEP 1: FILE UPLOAD
  // ============================================
  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    setUploadError('');
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers: parsedHeaders, rows } = parseCSV(text);
      
      if (parsedHeaders.length === 0) {
        setUploadError('Could not parse CSV. Please check the file format.');
        return;
      }
      
      setHeaders(parsedHeaders);
      setRawRows(rows);
      
      // Auto-detect columns
      setMapping({
        email: detectColumn(parsedHeaders, EMAIL_PATTERNS),
        amount: detectColumn(parsedHeaders, AMOUNT_PATTERNS),
        date: detectColumn(parsedHeaders, DATE_PATTERNS),
        description: detectColumn(parsedHeaders, DESC_PATTERNS),
        studentName: detectColumn(parsedHeaders, NAME_PATTERNS)
      });
      
      setStep(2);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ============================================
  // STEP 2: COLUMN MAPPING
  // ============================================
  const canProceedToStep3 = mapping.email && mapping.amount && mapping.date;

  const processMapping = useCallback(() => {
    const payments: ParsedPayment[] = rawRows.map((row, idx) => {
      const email = row[mapping.email]?.toLowerCase().trim() || '';
      const amountStr = row[mapping.amount] || '0';
      const amount = parseFloat(amountStr.replace(/[^0-9.-]/g, '')) || 0;
      const date = row[mapping.date] || new Date().toISOString().split('T')[0];
      const description = mapping.description ? row[mapping.description] : undefined;
      const studentName = mapping.studentName ? row[mapping.studentName] : undefined;
      
      // Find matching student
      const matchedStudent = existingStudents.find(
        s => s.email.toLowerCase() === email
      );
      
      return {
        id: `import-${idx}-${Date.now()}`,
        email,
        amount,
        date,
        description,
        studentName,
        matchedStudent,
        matchStatus: matchedStudent ? 'matched' : (email ? 'new' : 'skip')
      } as ParsedPayment;
    }).filter(p => p.amount > 0); // Filter out zero amounts
    
    setParsedPayments(payments);
    setStep(3);
  }, [rawRows, mapping, existingStudents]);

  // ============================================
  // STEP 3: PREVIEW & IMPORT
  // ============================================
  const matchedCount = parsedPayments.filter(p => p.matchStatus === 'matched').length;
  const newCount = parsedPayments.filter(p => p.matchStatus === 'new').length;
  const skipCount = parsedPayments.filter(p => p.matchStatus === 'skip').length;
  const totalAmount = parsedPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleStatusChange = (paymentId: string, newStatus: ParsedPayment['matchStatus'], manualStudentId?: string) => {
    setParsedPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          matchStatus: newStatus,
          manualAssignStudentId: manualStudentId,
          matchedStudent: manualStudentId 
            ? existingStudents.find(s => s.id === manualStudentId) 
            : p.matchedStudent
        };
      }
      return p;
    }));
  };

  const handleImport = async () => {
    setIsImporting(true);
    
    const newStudents: Student[] = [];
    const newPayments: RevenueEntry[] = [];
    
    for (const payment of parsedPayments) {
      if (payment.matchStatus === 'skip') continue;
      
      let studentId = payment.matchedStudent?.id || payment.manualAssignStudentId;
      
      // Create new student if needed
      if (payment.matchStatus === 'new' && autoCreateStudents) {
        const emailPrefix = payment.email.split('@')[0];
        const displayName = payment.studentName || 
          emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1).replace(/[._]/g, ' ');
        
        const newStudent: Student = {
          id: `csv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: displayName,
          email: payment.email,
          age: 0,
          currentNtrp: NtrpLevel.L20_25,
          clubId,
          status: 'Unclaimed',
          joinedDate: new Date().toISOString().split('T')[0],
          createdFrom: 'CSV Import',
          totalPaid: payment.amount,
          lastPaymentDate: payment.date,
          paymentCount: 1
        };
        
        newStudents.push(newStudent);
        studentId = newStudent.id;
      }
      
      // Create payment entry
      if (studentId || payment.matchStatus === 'matched') {
        const revenueEntry: RevenueEntry = {
          id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          clubId,
          type: 'CSV Import',
          amount: payment.amount,
          date: payment.date,
          description: payment.description || `CSV Import - ${payment.email}`,
          studentId,
          studentEmail: payment.email,
          importedAt: new Date().toISOString()
        };
        
        newPayments.push(revenueEntry);
      }
    }
    
    // Call completion handler
    onImportComplete(newStudents, newPayments);
    
    setIsImporting(false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFileName('');
    setHeaders([]);
    setRawRows([]);
    setMapping({ email: '', amount: '', date: '', description: '', studentName: '' });
    setParsedPayments([]);
    setUploadError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">📤 Import CSV Payments</h2>
              <p className="text-green-100 text-sm mt-1">
                {step === 1 && 'Upload your payment export file'}
                {step === 2 && 'Map columns to payment fields'}
                {step === 3 && 'Review and confirm import'}
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step >= s ? 'bg-white text-green-600' : 'bg-white/30 text-white'}
                `}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 rounded ${step > s ? 'bg-white' : 'bg-white/30'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ===== STEP 1: UPLOAD ===== */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                  ${isDragging 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-5xl mb-4">📁</div>
                <p className="text-gray-700 font-medium">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file here'}
                </p>
                <p className="text-gray-400 text-sm mt-2">or click to browse</p>
                
                {fileName && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    <span>📄</span>
                    <span className="font-medium">{fileName}</span>
                  </div>
                )}
              </div>
              
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                  {uploadError}
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-2">Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Export payment data from Stripe, Square, PayPal, etc.</li>
                  <li>• CSV must include: Email, Amount, and Date columns</li>
                  <li>• Column names are auto-detected (flexible naming)</li>
                  <li>• New emails will create student profiles automatically</li>
                </ul>
              </div>
            </div>
          )}

          {/* ===== STEP 2: COLUMN MAPPING ===== */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required Fields */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <span className="text-red-500">*</span> Required Fields
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Column</label>
                    <select
                      value={mapping.email}
                      onChange={(e) => setMapping(m => ({ ...m, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Amount Column</label>
                    <select
                      value={mapping.amount}
                      onChange={(e) => setMapping(m => ({ ...m, amount: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date Column</label>
                    <select
                      value={mapping.date}
                      onChange={(e) => setMapping(m => ({ ...m, date: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select column...</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700">Optional Fields</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Student Name Column</label>
                    <select
                      value={mapping.studentName || ''}
                      onChange={(e) => setMapping(m => ({ ...m, studentName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">None (use email prefix)</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description Column</label>
                    <select
                      value={mapping.description || ''}
                      onChange={(e) => setMapping(m => ({ ...m, description: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">None</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-3">Preview (First 3 rows)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-2 pr-4">Email</th>
                        <th className="pb-2 pr-4">Amount</th>
                        <th className="pb-2 pr-4">Date</th>
                        {mapping.studentName && <th className="pb-2 pr-4">Name</th>}
                        {mapping.description && <th className="pb-2">Description</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {rawRows.slice(0, 3).map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 pr-4">{mapping.email ? row[mapping.email] : '-'}</td>
                          <td className="py-2 pr-4">{mapping.amount ? row[mapping.amount] : '-'}</td>
                          <td className="py-2 pr-4">{mapping.date ? row[mapping.date] : '-'}</td>
                          {mapping.studentName && <td className="py-2 pr-4">{row[mapping.studentName] || '-'}</td>}
                          {mapping.description && <td className="py-2">{row[mapping.description] || '-'}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">Total rows: {rawRows.length}</p>
              </div>
            </div>
          )}

          {/* ===== STEP 3: PREVIEW & MATCH ===== */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                  <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
                  <p className="text-xs text-green-600 font-medium">Matched</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                  <p className="text-2xl font-bold text-blue-600">{newCount}</p>
                  <p className="text-xs text-blue-600 font-medium">New Students</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-gray-600">{skipCount}</p>
                  <p className="text-xs text-gray-600 font-medium">⏭️ Skipped</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                  <p className="text-2xl font-bold text-emerald-600">${totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 font-medium">Total</p>
                </div>
              </div>

              {/* Auto-create toggle */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCreateStudents}
                    onChange={(e) => setAutoCreateStudents(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Create student profiles for unmatched emails</p>
                    <p className="text-sm text-gray-500">Students can claim their accounts later using their email</p>
                  </div>
                </label>
              </div>

              {/* Payment List */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="text-left text-gray-500">
                        <th className="p-3">Status</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Student</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedPayments.map((payment) => (
                        <tr key={payment.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            {payment.matchStatus === 'matched' && <span className="text-green-600 font-bold">✓</span>}
                            {payment.matchStatus === 'new' && <span className="text-blue-600 font-bold">NEW</span>}
                            {payment.matchStatus === 'skip' && <span className="text-gray-400">⏭️</span>}
                            {payment.matchStatus === 'manual' && <span className="text-purple-600">🔗</span>}
                          </td>
                          <td className="p-3 font-medium">{payment.email || '-'}</td>
                          <td className="p-3 text-green-600 font-bold">${payment.amount.toLocaleString()}</td>
                          <td className="p-3 text-gray-500">{payment.date}</td>
                          <td className="p-3">
                            {payment.matchedStudent ? (
                              <span className="text-gray-800">{payment.matchedStudent.name}</span>
                            ) : payment.matchStatus === 'new' ? (
                              <span className="text-blue-600 italic">Will create</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={payment.matchStatus}
                              onChange={(e) => handleStatusChange(payment.id, e.target.value as any)}
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-green-500"
                            >
                              {payment.matchedStudent && <option value="matched">Use Match</option>}
                              <option value="new">Create New</option>
                              <option value="skip">Skip</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <div>
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep((step - 1) as 1 | 2)}>
                ← Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            {step === 2 && (
              <Button 
                onClick={processMapping}
                disabled={!canProceedToStep3}
                className={!canProceedToStep3 ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Continue →
              </Button>
            )}
            {step === 3 && (
              <Button 
                onClick={handleImport}
                disabled={isImporting || parsedPayments.filter(p => p.matchStatus !== 'skip').length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isImporting ? '⏳ Importing...' : `✓ Import ${parsedPayments.filter(p => p.matchStatus !== 'skip').length} Payments`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
