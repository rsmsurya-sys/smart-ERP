import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  getSubjectAttendance, getTimetableForStudent, getExamsForDepartment,
  getFeeRecord, getLeavesByStudent, type SubjectAttendance as SubjectAtt,
} from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  CheckSquare, BookOpen, CreditCard, Calendar, AlertTriangle,
  Clock, MapPin, User, Sparkles, Check, BellRing,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeTomorrowTimetable } from '@/utils/timetableReminder';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span className="tabular-nums">{display}{suffix}</span>;
}

export default function StudentDashboard() {
  const { currentStudent, state } = useApp();
  const navigate = useNavigate();

  if (!currentStudent) return <p>No student data</p>;

  const subjects = getSubjectAttendance(currentStudent.id);
  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayClasses = getTimetableForStudent(currentStudent.department, currentStudent.year, 'A', today);
  const exams = getExamsForDepartment(currentStudent.department).filter(e => e.type === 'internal');
  const fee = getFeeRecord(currentStudent.id);
  const leaves = getLeavesByStudent(currentStudent.id);
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

  const tomorrowAnalysis = analyzeTomorrowTimetable(
    currentStudent.department,
    currentStudent.year,
    currentStudent.section || 'A'
  );
  const [dashboardChecklist, setDashboardChecklist] = useState(tomorrowAnalysis.checklist);

  const gpaData = currentStudent.semesterGPA.map((gpa, i) => ({
    semester: `Sem ${i + 1}`,
    GPA: gpa,
  }));

  const recentNotifications = state.notifications
    .filter(n => n.targetRole === 'student' || n.targetRole === 'all')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">Welcome back, {currentStudent.name.split(' ')[0]}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {currentStudent.rollNo} · {currentStudent.department} · Year {currentStudent.year}
        </p>
      </div>

      {/* At-risk banner */}
      {currentStudent.isAtRisk && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-critical/20"
             style={{ background: 'rgba(184, 64, 64, 0.06)' }}>
          <AlertTriangle size={20} className="text-critical flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-critical">Academic Risk Alert</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Your attendance is below 75% and/or your placement readiness score is low. Please consult your academic advisor.
            </p>
          </div>
        </div>
      )}

      {/* Summary tiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* Attendance */}
        <div className="card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => navigate('/student/attendance')}
             style={{ color: currentStudent.overallAttendance >= 75 ? '#3D8B5A' : '#B84040' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={16} />
            <span className="text-xs font-medium text-text-secondary">Overall Attendance</span>
          </div>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={currentStudent.overallAttendance} suffix="%" />
          </p>
          {currentStudent.overallAttendance < 75 && (
            <span className="at-risk-badge mt-2">Shortage Risk</span>
          )}
        </div>

        {/* CGPA */}
        <div className="card-elevated p-5 stat-tile" style={{ color: '#16213E' }}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} />
            <span className="text-xs font-medium text-text-secondary">Current CGPA</span>
          </div>
          <p className="text-3xl font-bold">
            <AnimatedNumber value={Math.floor(currentStudent.cgpa)} /><span className="tabular-nums">.{String(currentStudent.cgpa).split('.')[1] || '0'}</span>
          </p>
          <p className="text-xs text-text-muted mt-1">out of 10.0</p>
        </div>

        {/* Fee Status */}
        <div className={`card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow`}
             onClick={() => navigate('/student/fees')}
             style={{ color: fee?.status === 'paid' ? '#3D8B5A' : fee?.status === 'pending' ? '#B84040' : '#C4882F' }}>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} />
            <span className="text-xs font-medium text-text-secondary">Fee Status</span>
          </div>
          <p className="text-3xl font-bold capitalize">{fee?.status || 'N/A'}</p>
          {fee && fee.status !== 'paid' && (
            <p className="text-xs text-text-muted mt-1">₹{(fee.totalFee - fee.paidAmount).toLocaleString()} due</p>
          )}
        </div>

        {/* Pending Leaves */}
        <div className="card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => navigate('/student/leave')}
             style={{ color: '#C4882F' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} />
            <span className="text-xs font-medium text-text-secondary">Pending Leaves</span>
          </div>
          <p className="text-3xl font-bold"><AnimatedNumber value={pendingLeaves} /></p>
          <p className="text-xs text-text-muted mt-1">{leaves.length} total requests</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subject-wise attendance */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-navy">Subject-wise Attendance</h2>
            </div>
            <div className="p-5">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attended</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s: SubjectAtt) => (
                    <tr key={s.subjectCode}>
                      <td>
                        <p className="font-medium text-text-primary">{s.subjectName}</p>
                        <p className="text-xs text-text-muted">{s.subjectCode}</p>
                      </td>
                      <td className="tabular-nums">{s.attended}</td>
                      <td className="tabular-nums">{s.totalClasses}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-ivory-dark rounded-full overflow-hidden" style={{ maxWidth: 80 }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${s.percentage}%`,
                                background: s.percentage >= 75 ? '#3D8B5A' : s.percentage >= 65 ? '#C4882F' : '#B84040',
                              }}
                            />
                          </div>
                          <span className="tabular-nums text-sm font-medium">{s.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium
                          ${s.percentage >= 75 ? 'status-safe' : s.percentage >= 65 ? 'status-warn' : 'status-critical'}`}>
                          {s.percentage >= 75 ? 'Safe' : s.percentage >= 65 ? 'Warning' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GPA Trend */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-navy">GPA Trend</h2>
            </div>
            <div className="p-5" style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" />
                  <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[5, 10]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{ background: '#16213E', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
                    labelStyle={{ color: '#C89B3C' }}
                  />
                  <Line type="monotone" dataKey="GPA" stroke="#C89B3C" strokeWidth={2.5}
                        dot={{ fill: '#C89B3C', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, stroke: '#16213E', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Timetable */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-navy">Today's Classes — {today}</h2>
            </div>
            <div className="p-5">
              {todayClasses.length === 0 ? (
                <p className="text-sm text-text-muted py-4 text-center">No classes scheduled today</p>
              ) : (
                <div className="space-y-3">
                  {todayClasses.map((cls, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-ivory hover:bg-ivory-dark transition-colors">
                      <div className="w-16 text-center">
                        <p className="text-xs text-text-muted">Period {cls.period}</p>
                        <p className="text-sm font-medium tabular-nums text-navy">{cls.time.split('–')[0]}</p>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-text-primary">{cls.subjectName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                          <span className="flex items-center gap-1"><User size={11} />{cls.faculty}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{cls.room}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Tomorrow Schedule & Packing Reminder Widget */}
          <div className="card-elevated border-l-4 overflow-hidden" style={{ borderLeftColor: '#C89B3C' }}>
            <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brass to-brass-dark text-navy flex items-center justify-center font-bold shadow-xs">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-navy text-sm">Tomorrow's Schedule & Bag Packing Checklist (AI)</h2>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brass/20 text-brass-dark">
                      Smart Prep
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {tomorrowAnalysis.targetDay}, {tomorrowAnalysis.dateStr} · {tomorrowAnalysis.slots.length} Classes scheduled
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary">
                <BellRing size={13} className="text-brass animate-pulse" />
                <span className="font-semibold text-navy">Daily 8 PM Alert</span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Lab notice if applicable */}
              {tomorrowAnalysis.hasLab && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-semibold">
                    <span className="text-base">🧪</span>
                    <span>Lab Practical Scheduled: Web Technologies in {tomorrowAnalysis.labRooms.join(', ')}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                    White Apron Mandatory
                  </span>
                </div>
              )}

              {/* Checklist items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    🎒 Packing Checklist ({dashboardChecklist.filter(c => c.packed).length}/{dashboardChecklist.length} Packed)
                  </p>
                  <span className="text-xs text-text-muted">Tap to mark packed</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {dashboardChecklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setDashboardChecklist(prev => prev.map(c => c.id === item.id ? { ...c, packed: !c.packed } : c))}
                      className={`p-3 rounded-xl border text-xs cursor-pointer select-none transition-all flex items-start gap-2.5 ${
                        item.packed
                          ? 'bg-emerald-50/60 border-emerald-200 text-text-secondary'
                          : 'bg-ivory border-border hover:border-brass/60 shadow-2xs'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.packed ? (
                          <div className="w-4 h-4 rounded bg-safe text-white flex items-center justify-center">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded border border-border bg-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{item.icon}</span>
                          <span className={`font-semibold ${item.packed ? 'line-through text-text-muted' : 'text-navy'}`}>
                            {item.item}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 truncate">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-navy">Upcoming Exams</h2>
            </div>
            <div className="p-4 space-y-3">
              {exams.slice(0, 4).map(exam => (
                <div key={exam.id} className="p-3 rounded-lg bg-ivory">
                  <p className="font-medium text-sm text-text-primary">{exam.subjectName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Calendar size={11} />{exam.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock size={11} />{exam.time}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{exam.syllabus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Breakdown */}
          {fee && (
            <div className="card-elevated">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-navy">Fee Breakdown</h2>
              </div>
              <div className="p-5 space-y-3 text-sm">
                {[
                  { label: 'Tuition Fee', amount: fee.tuitionFee },
                  { label: 'Hostel Fee', amount: fee.hostelFee },
                  { label: 'Library Fee', amount: fee.libraryFee },
                  { label: 'Lab Fee', amount: fee.labFee },
                ].filter(f => f.amount > 0).map(f => (
                  <div key={f.label} className="flex justify-between">
                    <span className="text-text-secondary">{f.label}</span>
                    <span className="tabular-nums font-medium">₹{f.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">₹{fee.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-safe">
                  <span>Paid</span>
                  <span className="tabular-nums">₹{fee.paidAmount.toLocaleString()}</span>
                </div>
                {fee.totalFee - fee.paidAmount > 0 && (
                  <div className="flex justify-between text-critical font-medium">
                    <span>Balance Due</span>
                    <span className="tabular-nums">₹{(fee.totalFee - fee.paidAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="card-elevated">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-navy">Recent Notifications</h2>
              <button onClick={() => navigate('/notifications')} className="text-xs text-brass font-medium hover:underline">
                View all
              </button>
            </div>
            <div className="p-4 space-y-2">
              {recentNotifications.map(n => (
                <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-ivory/50' : 'bg-brass-50 border border-brass/10'}`}>
                  <p className={`font-medium ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>{n.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
