import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { LeaveRequest } from '@/data/mockData';
import { Calendar, Plus, X } from 'lucide-react';

export default function LeaveRequestPage() {
  const { state, dispatch, currentStudent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '', type: 'personal' as LeaveRequest['type'] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentStudent) return null;

  const leaves = state.leaveRequests.filter(l => l.studentId === currentStudent.id);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fromDate) errs.fromDate = 'Required';
    if (!form.toDate) errs.toDate = 'Required';
    if (form.fromDate && form.toDate && form.fromDate > form.toDate) errs.toDate = 'Must be after start date';
    if (!form.reason.trim()) errs.reason = 'Reason is required';
    if (form.reason.trim().length < 10) errs.reason = 'Please provide a detailed reason (min 10 chars)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newLeave: LeaveRequest = {
      id: `LR${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      department: currentStudent.department,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
      type: form.type,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: 'ADD_LEAVE_REQUEST', leave: newLeave });
    setForm({ fromDate: '', toDate: '', reason: '', type: 'personal' });
    setShowForm(false);
  };

  const statusStyles: Record<string, string> = {
    pending: 'status-warn',
    approved: 'status-safe',
    rejected: 'status-critical',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leave Requests</h1>
          <p className="text-text-secondary text-sm mt-1">{currentStudent.name} · {currentStudent.rollNo}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-colors"
          style={{ background: showForm ? '#B84040' : '#16213E' }}
        >
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Request</>}
        </button>
      </div>

      {/* New leave form */}
      {showForm && (
        <div className="card-elevated p-6 animate-fade-in">
          <h2 className="font-semibold text-navy mb-4">Apply for Leave</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Leave Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as LeaveRequest['type'] })}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
                >
                  <option value="personal">Personal</option>
                  <option value="medical">Medical</option>
                  <option value="od">On Duty (OD)</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">From Date</label>
                <input
                  type="date"
                  value={form.fromDate}
                  onChange={e => setForm({ ...form, fromDate: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 ${errors.fromDate ? 'border-critical' : 'border-border'}`}
                />
                {errors.fromDate && <p className="text-critical text-xs mt-1">{errors.fromDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">To Date</label>
                <input
                  type="date"
                  value={form.toDate}
                  onChange={e => setForm({ ...form, toDate: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 ${errors.toDate ? 'border-critical' : 'border-border'}`}
                />
                {errors.toDate && <p className="text-critical text-xs mt-1">{errors.toDate}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Reason</label>
              <textarea
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                rows={3}
                placeholder="Provide a detailed reason for your leave request..."
                className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 resize-none ${errors.reason ? 'border-critical' : 'border-border'}`}
              />
              {errors.reason && <p className="text-critical text-xs mt-1">{errors.reason}</p>}
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
              style={{ background: '#16213E' }}
            >
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* Leave history */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Request History</h2>
        </div>
        <div className="p-5">
          {leaves.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No leave requests found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map(l => (
                  <tr key={l.id}>
                    <td>
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-navy-50 text-navy capitalize">
                        {l.type}
                      </span>
                    </td>
                    <td className="tabular-nums">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-text-muted" />
                        {l.fromDate} — {l.toDate}
                      </div>
                    </td>
                    <td className="text-sm max-w-xs">{l.reason}</td>
                    <td className="tabular-nums text-text-muted">{l.appliedOn}</td>
                    <td>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium capitalize ${statusStyles[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="text-text-muted text-sm">{l.approvedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
