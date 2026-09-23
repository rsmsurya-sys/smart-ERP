import { useApp } from '@/context/AppContext';
import { getFeeRecord } from '@/data/mockData';
import { Download, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function Fees() {
  const { currentStudent } = useApp();
  if (!currentStudent) return null;

  const fee = getFeeRecord(currentStudent.id);

  const paymentHistory = [
    { date: '2026-07-10', amount: 75000, mode: 'Online (NEFT)', ref: 'TXN20260710001', status: 'Success' },
    ...(fee && fee.paidAmount > 75000
      ? [{ date: '2026-07-15', amount: fee.paidAmount - 75000, mode: 'Online (UPI)', ref: 'TXN20260715002', status: 'Success' }]
      : []),
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Fee Details</h1>
        <p className="text-text-secondary text-sm mt-1">Semester 5 · {currentStudent.name}</p>
      </div>

      {/* Status card */}
      {fee && (
        <div className={`p-6 rounded-xl border ${fee.status === 'paid' ? 'border-safe/20 bg-safe-light' : fee.status === 'pending' ? 'border-critical/20 bg-critical-light' : 'border-warn/20 bg-warn-light'}`}>
          <div className="flex items-center gap-3">
            {fee.status === 'paid' ? <CheckCircle size={24} className="text-safe" /> : <AlertCircle size={24} className={fee.status === 'pending' ? 'text-critical' : 'text-warn'} />}
            <div>
              <p className="font-semibold text-lg capitalize">{fee.status === 'paid' ? 'All Fees Paid' : fee.status === 'pending' ? 'Payment Pending' : 'Partial Payment'}</p>
              {fee.status !== 'paid' && (
                <p className="text-sm text-text-secondary">Balance: ₹{(fee.totalFee - fee.paidAmount).toLocaleString()} · Due: {fee.dueDate}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Breakdown */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Fee Breakdown</h2>
          </div>
          {fee && (
            <div className="p-5 space-y-4">
              {[
                { label: 'Tuition Fee', amount: fee.tuitionFee },
                { label: 'Hostel Fee', amount: fee.hostelFee },
                { label: 'Library Fee', amount: fee.libraryFee },
                { label: 'Lab Fee', amount: fee.labFee },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">{item.label}</span>
                  <span className="tabular-nums font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="tabular-nums">₹{fee.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-safe">
                  <span className="text-sm">Amount Paid</span>
                  <span className="tabular-nums font-medium">₹{fee.paidAmount.toLocaleString()}</span>
                </div>
                {fee.totalFee - fee.paidAmount > 0 && (
                  <div className="flex justify-between text-critical">
                    <span className="text-sm font-medium">Balance Due</span>
                    <span className="tabular-nums font-bold">₹{(fee.totalFee - fee.paidAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>
              {fee.status !== 'paid' && (
                <button className="w-full py-2.5 rounded-lg text-white text-sm font-semibold mt-4 flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
                        style={{ background: '#16213E' }}
                        onClick={() => alert('Payment gateway integration (mock)')}>
                  <CreditCard size={16} />
                  Pay Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Payment History</h2>
          </div>
          <div className="p-5">
            {paymentHistory.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">No payments recorded</p>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((p, i) => (
                  <div key={i} className="p-4 rounded-lg bg-ivory border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">₹{p.amount.toLocaleString()}</p>
                        <p className="text-xs text-text-muted mt-0.5">{p.date} · {p.mode}</p>
                      </div>
                      <div className="text-right">
                        <span className="status-safe text-xs px-2 py-0.5 rounded font-medium">{p.status}</span>
                        <p className="text-xs text-text-muted mt-1">Ref: {p.ref}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-brass font-medium mt-2 hover:underline"
                            onClick={() => alert('Receipt downloaded (mock)')}>
                      <Download size={12} />
                      Download Receipt
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
