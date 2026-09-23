import {
  students, getAtRiskStudents, getDepartmentStats, monthlyAttendanceTrend, feeRecords,
} from '@/data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, AlertTriangle, CreditCard, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const deptStats = getDepartmentStats();
  const atRisk = getAtRiskStudents();

  const totalCollected = feeRecords.reduce((s, f) => s + f.paidAmount, 0);
  const totalPending = feeRecords.reduce((s, f) => s + (f.totalFee - f.paidAmount), 0);

  const feeChartData = [
    { name: 'Collected', value: totalCollected },
    { name: 'Pending', value: totalPending },
  ];
  const feeColors = ['#3D8B5A', '#B84040'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Cross-department analytics and management</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <div className="card-elevated p-5 stat-tile" style={{ color: '#16213E' }}>
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} />
            <span className="text-xs font-medium text-text-secondary">Total Students</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">{students.length}</p>
          <p className="text-xs text-text-muted mt-1">across {deptStats.length} departments</p>
        </div>

        <div className="card-elevated p-5 stat-tile" style={{ color: '#B84040' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} />
            <span className="text-xs font-medium text-text-secondary">At-Risk Students</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">{atRisk.length}</p>
          <p className="text-xs text-text-muted mt-1">need attention</p>
        </div>

        <div className="card-elevated p-5 stat-tile" style={{ color: '#3D8B5A' }}>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} />
            <span className="text-xs font-medium text-text-secondary">Fee Collected</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">₹{(totalCollected / 100000).toFixed(1)}L</p>
          <p className="text-xs text-text-muted mt-1">₹{(totalPending / 100000).toFixed(1)}L pending</p>
        </div>

        <div className="card-elevated p-5 stat-tile cursor-pointer hover:shadow-md transition-shadow"
             onClick={() => navigate('/admin/placements')}
             style={{ color: '#C89B3C' }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} />
            <span className="text-xs font-medium text-text-secondary">Avg Placement Score</span>
          </div>
          <p className="text-3xl font-bold tabular-nums">
            {Math.round(deptStats.reduce((s, d) => s + d.avgPlacementScore, 0) / deptStats.length)}%
          </p>
          <p className="text-xs text-text-muted mt-1">across all depts</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance trend */}
        <div className="lg:col-span-2 card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Department-wise Attendance Trend</h2>
          </div>
          <div className="p-5" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAttendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ background: '#16213E', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                <Area type="monotone" dataKey="CSE" stroke="#16213E" fill="#16213E20" strokeWidth={2} />
                <Area type="monotone" dataKey="AI&DS" stroke="#C89B3C" fill="#C89B3C20" strokeWidth={2} />
                <Area type="monotone" dataKey="ECE" stroke="#3D8B5A" fill="#3D8B5A20" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ background: '#16213E' }} /> CSE</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ background: '#C89B3C' }} /> AI&DS</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded" style={{ background: '#3D8B5A' }} /> ECE</span>
            </div>
          </div>
        </div>

        {/* Fee collection pie */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Fee Collection</h2>
          </div>
          <div className="p-5" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feeChartData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {feeChartData.map((_, idx) => (
                    <Cell key={idx} fill={feeColors[idx]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" />
                <Tooltip
                  formatter={(value: any) => `₹${Number(value || 0).toLocaleString()}`}
                  contentStyle={{ background: '#16213E', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department stats */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Department Overview</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Students</th>
                <th>Avg Attendance</th>
                <th>Avg CGPA</th>
                <th>At-Risk</th>
                <th>Placement Score</th>
                <th>Fee Collected</th>
              </tr>
            </thead>
            <tbody>
              {deptStats.map(d => (
                <tr key={d.department}>
                  <td className="font-semibold text-navy">{d.department}</td>
                  <td className="tabular-nums">{d.totalStudents}</td>
                  <td>
                    <span className={`tabular-nums font-medium ${d.avgAttendance >= 80 ? 'text-safe' : d.avgAttendance >= 75 ? 'text-warn' : 'text-critical'}`}>
                      {d.avgAttendance}%
                    </span>
                  </td>
                  <td className="tabular-nums">{d.avgCGPA}</td>
                  <td>
                    {d.atRiskCount > 0 ? (
                      <span className="at-risk-badge">{d.atRiskCount}</span>
                    ) : (
                      <span className="status-safe px-2 py-0.5 rounded text-xs font-medium">None</span>
                    )}
                  </td>
                  <td className="tabular-nums">{d.avgPlacementScore}%</td>
                  <td className="tabular-nums">₹{(d.feeCollected / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-risk students */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <AlertTriangle size={18} className="text-critical" />
          <h2 className="font-semibold text-navy">AI-Flagged At-Risk Students</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Attendance</th>
                <th>CGPA</th>
                <th>Placement Score</th>
                <th>Fee Status</th>
                <th>Risk Factors</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map(s => (
                <tr key={s.id}>
                  <td className="tabular-nums font-medium">{s.rollNo}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.department}</td>
                  <td>
                    <span className={`tabular-nums font-medium ${s.overallAttendance >= 75 ? 'text-safe' : 'text-critical'}`}>
                      {s.overallAttendance}%
                    </span>
                  </td>
                  <td className="tabular-nums">{s.cgpa}</td>
                  <td className="tabular-nums">{s.placementScore}%</td>
                  <td>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-medium capitalize
                      ${s.feeStatus === 'paid' ? 'status-safe' : s.feeStatus === 'pending' ? 'status-critical' : 'status-warn'}`}>
                      {s.feeStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {s.overallAttendance < 75 && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-critical-light text-critical border border-critical/20">Low Attendance</span>}
                      {s.placementScore < 50 && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-warn-light text-warn border border-warn/20">Low Placement</span>}
                      {s.feeStatus !== 'paid' && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-critical-light text-critical border border-critical/20">Fee Due</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
