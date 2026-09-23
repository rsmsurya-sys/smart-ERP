import { useApp } from '@/context/AppContext';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function LeaveApprovals() {
  const { state, dispatch, currentFaculty } = useApp();

  const pending = state.leaveRequests.filter(l => l.status === 'pending');
  const decided = state.leaveRequests.filter(l => l.status !== 'pending');

  const handleDecision = (leaveId: string, status: 'approved' | 'rejected') => {
    dispatch({
      type: 'UPDATE_LEAVE_STATUS',
      leaveId,
      status,
      approvedBy: currentFaculty?.name || 'Faculty',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Leave Approvals</h1>
        <p className="text-text-secondary text-sm mt-1">{pending.length} pending requests</p>
      </div>

      {/* Pending */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Pending Requests</h2>
        </div>
        <div className="p-5">
          {pending.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No pending leave requests</p>
          ) : (
            <div className="space-y-4">
              {pending.map(leave => (
                <div key={leave.id} className="p-4 rounded-xl bg-ivory border border-warn/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text-primary">{leave.studentName}</p>
                        <span className="text-xs text-text-muted tabular-nums">{leave.rollNo}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-navy-50 text-navy capitalize">{leave.type}</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{leave.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Calendar size={12} />{leave.fromDate} — {leave.toDate}</span>
                        <span>Applied: {leave.appliedOn}</span>
                        <span>{leave.department}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDecision(leave.id, 'approved')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors"
                        style={{ background: '#3D8B5A' }}
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecision(leave.id, 'rejected')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors"
                        style={{ background: '#B84040' }}
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decided */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Previously Decided</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Type</th>
                <th>Period</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Decided By</th>
              </tr>
            </thead>
            <tbody>
              {decided.map(l => (
                <tr key={l.id}>
                  <td>
                    <p className="font-medium">{l.studentName}</p>
                    <p className="text-xs text-text-muted">{l.rollNo}</p>
                  </td>
                  <td className="capitalize text-sm">{l.type}</td>
                  <td className="tabular-nums text-sm">{l.fromDate} — {l.toDate}</td>
                  <td className="text-sm max-w-xs">{l.reason}</td>
                  <td>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium capitalize
                      ${l.status === 'approved' ? 'status-safe' : 'status-critical'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="text-sm text-text-muted">{l.approvedBy || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
