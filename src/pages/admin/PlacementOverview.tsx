import { students, getDepartmentStats } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, AlertTriangle } from 'lucide-react';

export default function PlacementOverview() {
  const deptStats = getDepartmentStats();

  const chartData = deptStats.map(d => ({
    department: d.department,
    score: d.avgPlacementScore,
  }));

  const topCandidates = [...students]
    .sort((a, b) => b.placementScore - a.placementScore)
    .slice(0, 8);

  const skillGaps = [
    { skill: 'Cloud Computing (AWS/Azure)', demand: 85, supply: 35, gap: 50 },
    { skill: 'System Design', demand: 78, supply: 30, gap: 48 },
    { skill: 'DevOps & CI/CD', demand: 72, supply: 28, gap: 44 },
    { skill: 'Data Engineering', demand: 68, supply: 32, gap: 36 },
    { skill: 'Cybersecurity', demand: 60, supply: 22, gap: 38 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Placement Readiness Overview</h1>
        <p className="text-text-secondary text-sm mt-1">Department-wise analysis and top candidates</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dept-wise chart */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Department-wise Placement Score</h2>
          </div>
          <div className="p-5" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DB" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 12, fill: '#64748B' }} width={60} />
                <Tooltip contentStyle={{ background: '#16213E', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }} />
                <Bar dataKey="score" fill="#C89B3C" radius={[0, 4, 4, 0]} name="Avg Score" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill gap analysis */}
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle size={16} className="text-warn" />
            <h2 className="font-semibold text-navy">Industry Skill Gap Analysis</h2>
          </div>
          <div className="p-5 space-y-4">
            {skillGaps.map(sg => (
              <div key={sg.skill}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-text-primary">{sg.skill}</span>
                  <span className="text-xs text-critical font-medium tabular-nums">{sg.gap}% gap</span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-ivory-dark">
                  <div className="rounded-full" style={{ width: `${sg.supply}%`, background: '#3D8B5A' }} title={`Students: ${sg.supply}%`} />
                  <div className="rounded-full" style={{ width: `${sg.gap}%`, background: '#B8404030' }} title={`Gap: ${sg.gap}%`} />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>Student readiness: {sg.supply}%</span>
                  <span>Industry demand: {sg.demand}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top candidates */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <GraduationCap size={18} className="text-brass" />
          <h2 className="font-semibold text-navy">Top Placement Candidates</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Placement Score</th>
                <th>Key Skills</th>
              </tr>
            </thead>
            <tbody>
              {topCandidates.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${i < 3 ? 'text-white' : 'text-text-secondary bg-ivory-dark'}`}
                      style={i < 3 ? { background: i === 0 ? '#C89B3C' : i === 1 ? '#94A3B8' : '#B87333' } : {}}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="tabular-nums font-medium">{s.rollNo}</td>
                  <td className="font-medium">{s.name}</td>
                  <td>{s.department}</td>
                  <td className="tabular-nums">{s.cgpa}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-ivory-dark rounded-full overflow-hidden" style={{ maxWidth: 80 }}>
                        <div className="h-full rounded-full" style={{
                          width: `${s.placementScore}%`,
                          background: s.placementScore >= 80 ? '#3D8B5A' : s.placementScore >= 60 ? '#C4882F' : '#B84040',
                        }} />
                      </div>
                      <span className="tabular-nums text-sm font-medium">{s.placementScore}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {s.skills.slice(0, 3).map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-medium bg-navy-50 text-navy">{sk}</span>
                      ))}
                      {s.skills.length > 3 && <span className="text-xs text-text-muted">+{s.skills.length - 3}</span>}
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
