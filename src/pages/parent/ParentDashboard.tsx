import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { students, getSubjectAttendance, getMarks, getFeeRecord, getLeavesByStudent, faculty } from '@/data/mockData';
import { CheckCircle, Send, BookOpen, CreditCard, Calendar, User } from 'lucide-react';

export default function ParentDashboard() {
  const { currentParent } = useApp();
  const [messageTeacher, setMessageTeacher] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(faculty[0].id);
  const [messageSent, setMessageSent] = useState(false);

  if (!currentParent) return <p>No parent data</p>;

  const child = students.find(s => s.id === currentParent.childIds[0]);
  if (!child) return <p>No child data</p>;

  const subjects = getSubjectAttendance(child.id);
  const marks = getMarks(child.id);
  const fee = getFeeRecord(child.id);
  const leaves = getLeavesByStudent(child.id);

  const handleSendMessage = () => {
    if (!messageTeacher.trim()) return;
    setMessageSent(true);
    setMessageTeacher('');
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Parent Portal</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome, {currentParent.name}</p>
      </div>

      {/* Child info */}
      <div className="card-elevated p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white"
             style={{ background: '#16213E' }}>
          {child.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg text-navy">{child.name}</p>
          <p className="text-sm text-text-secondary">{child.rollNo} · {child.department} · Year {child.year}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: child.overallAttendance >= 75 ? '#3D8B5A' : '#B84040' }}>
            {child.overallAttendance}%
          </p>
          <p className="text-xs text-text-muted">Attendance</p>
        </div>
      </div>

      {child.isAtRisk && (
        <div className="p-4 rounded-xl border border-critical/20" style={{ background: 'rgba(184, 64, 64, 0.06)' }}>
          <p className="text-sm font-semibold text-critical">⚠ Your ward is flagged as at-risk</p>
          <p className="text-xs text-text-secondary mt-0.5">Attendance is below 75% or academic performance needs improvement. Please contact the class advisor.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <CheckCircle size={16} className="text-safe" />
              <h2 className="font-semibold text-navy">Subject-wise Attendance</h2>
            </div>
            <div className="p-5">
              <table className="data-table">
                <thead>
                  <tr><th>Subject</th><th>Attended</th><th>Total</th><th>Percentage</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {subjects.map(s => (
                    <tr key={s.subjectCode}>
                      <td className="font-medium">{s.subjectName}</td>
                      <td className="tabular-nums">{s.attended}</td>
                      <td className="tabular-nums">{s.totalClasses}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-ivory-dark rounded-full overflow-hidden" style={{ maxWidth: 60 }}>
                            <div className="h-full rounded-full" style={{
                              width: `${s.percentage}%`,
                              background: s.percentage >= 75 ? '#3D8B5A' : '#B84040',
                            }} />
                          </div>
                          <span className="tabular-nums text-sm font-medium">{s.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.percentage >= 75 ? 'status-safe' : 'status-critical'}`}>
                          {s.percentage >= 75 ? 'Safe' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marks */}
          {marks.length > 0 && (
            <div className="card-elevated">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <BookOpen size={16} className="text-brass" />
                <h2 className="font-semibold text-navy">Academic Performance</h2>
              </div>
              <div className="p-5">
                <table className="data-table">
                  <thead>
                    <tr><th>Subject</th><th>IA-1</th><th>IA-2</th><th>IA-3</th><th>Assignment</th><th>Grade</th></tr>
                  </thead>
                  <tbody>
                    {marks.map(m => (
                      <tr key={m.subjectCode}>
                        <td className="font-medium">{m.subjectName}</td>
                        <td className="tabular-nums">{m.internal1}/50</td>
                        <td className="tabular-nums">{m.internal2}/50</td>
                        <td className="tabular-nums">{m.internal3}/50</td>
                        <td className="tabular-nums">{m.assignment}/20</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold
                            ${['O', 'A+', 'A'].includes(m.grade || '') ? 'status-safe' : ['B', 'B+'].includes(m.grade || '') ? 'status-warn' : 'status-critical'}`}>
                            {m.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leave status */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Calendar size={16} className="text-warn" />
              <h2 className="font-semibold text-navy">Leave Requests</h2>
            </div>
            <div className="p-5">
              {leaves.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No leave requests</p>
              ) : (
                <div className="space-y-3">
                  {leaves.map(l => (
                    <div key={l.id} className="p-3 rounded-lg bg-ivory flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{l.reason}</p>
                        <p className="text-xs text-text-muted mt-0.5">{l.fromDate} — {l.toDate} · {l.type}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-medium capitalize
                        ${l.status === 'approved' ? 'status-safe' : l.status === 'rejected' ? 'status-critical' : 'status-warn'}`}>
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Fee status */}
          {fee && (
            <div className="card-elevated">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <CreditCard size={16} className={fee.status === 'paid' ? 'text-safe' : 'text-critical'} />
                <h2 className="font-semibold text-navy">Fee Status</h2>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Total Fee</span><span className="tabular-nums font-medium">₹{fee.totalFee.toLocaleString()}</span></div>
                <div className="flex justify-between text-safe"><span>Paid</span><span className="tabular-nums font-medium">₹{fee.paidAmount.toLocaleString()}</span></div>
                {fee.totalFee - fee.paidAmount > 0 && (
                  <div className="flex justify-between text-critical font-medium">
                    <span>Balance</span><span className="tabular-nums">₹{(fee.totalFee - fee.paidAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border">
                  <span className={`px-3 py-1 rounded text-xs font-medium capitalize
                    ${fee.status === 'paid' ? 'status-safe' : fee.status === 'pending' ? 'status-critical' : 'status-warn'}`}>
                    {fee.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Message teacher */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <User size={16} className="text-navy" />
              <h2 className="font-semibold text-navy">Message Teacher</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Select Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={e => setSelectedTeacher(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
                >
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>{f.name} — {f.department}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Message</label>
                <textarea
                  value={messageTeacher}
                  onChange={e => setMessageTeacher(e.target.value)}
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30 resize-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
                style={{ background: '#16213E' }}
              >
                <Send size={14} />
                Send Message
              </button>
              {messageSent && (
                <div className="flex items-center gap-2 text-safe text-sm font-medium animate-fade-in">
                  <CheckCircle size={14} />
                  Message sent successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
