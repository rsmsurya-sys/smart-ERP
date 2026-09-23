import { useApp } from '@/context/AppContext';
import { getTimetableForFaculty } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users, Calendar, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FacultyDashboard() {
  const { currentFaculty, state } = useApp();
  const navigate = useNavigate();

  if (!currentFaculty) return <p>No faculty data</p>;

  const today = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayClasses = getTimetableForFaculty(currentFaculty.name, today);
  const pendingLeaves = state.leaveRequests.filter(l => l.status === 'pending').length;

  const workloadData = [
    { day: 'Mon', hours: getTimetableForFaculty(currentFaculty.name, 'Monday').length },
    { day: 'Tue', hours: getTimetableForFaculty(currentFaculty.name, 'Tuesday').length },
    { day: 'Wed', hours: getTimetableForFaculty(currentFaculty.name, 'Wednesday').length },
    { day: 'Thu', hours: getTimetableForFaculty(currentFaculty.name, 'Thursday').length },
    { day: 'Fri', hours: getTimetableForFaculty(currentFaculty.name, 'Friday').length },
    { day: 'Sat', hours: getTimetableForFaculty(currentFaculty.name, 'Saturday').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Welcome, {currentFaculty.name.split(' ').pop()}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {currentFaculty.designation} · {currentFaculty.department}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-3 gap-4 stagger-children">
        <div className="card-elevated p-5 stat-tile" style={{ color: '#16213E' }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} />
            <span className="text-xs font-medium text-text-secondary">Classes Today</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">{todayClasses.length}</p>
          <p className="text-xs text-text-muted mt-1">{currentFaculty.weeklyHours} hrs/week</p>
        </div>

        <div className="card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => navigate('/faculty/leaves')}
             style={{ color: pendingLeaves > 0 ? '#C4882F' : '#3D8B5A' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} />
            <span className="text-xs font-medium text-text-secondary">Pending Approvals</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">{pendingLeaves}</p>
          <p className="text-xs text-text-muted mt-1">leave requests awaiting</p>
        </div>

        <div className="card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => navigate('/faculty/attendance')}
             style={{ color: '#3D8B5A' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={16} />
            <span className="text-xs font-medium text-text-secondary">Quick Action</span>
          </div>
          <p className="text-lg font-bold">Mark Attendance</p>
          <p className="text-xs text-text-muted mt-1">for today's classes</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Today's Schedule — {today}</h2>
          </div>
          <div className="p-5">
            {todayClasses.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">No classes today</p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-ivory">
                    <div className="w-20 text-center">
                      <p className="text-xs text-text-muted">Period {cls.period}</p>
                      <p className="text-sm font-medium tabular-nums">{cls.time}</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cls.subjectName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Users size={11} />{cls.department} Year {cls.year} Sec {cls.section}</span>
                        <span>{cls.room}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/faculty/attendance')}
                      className="px-3 py-1.5 rounded text-xs font-medium border border-brass/30 text-brass hover:bg-brass-50 transition-colors"
                    >
                      Mark
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workload chart */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Weekly Workload</h2>
          </div>
          <div className="p-5" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ background: '#16213E', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
                <Bar dataKey="hours" fill="#C89B3C" radius={[4, 4, 0, 0]} name="Classes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subjects taught */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Subjects Assigned</h2>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-3">
          {currentFaculty.subjects.map((sub, i) => (
            <div key={i} className="p-4 rounded-lg bg-ivory border border-border">
              <p className="font-medium text-sm text-text-primary">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
