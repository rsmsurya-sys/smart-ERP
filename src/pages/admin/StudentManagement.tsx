import { useState, useMemo } from 'react';
import { students, type Department } from '@/data/mockData';
import { Search, Filter } from 'lucide-react';

export default function StudentManagement() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all');
  const [sortField, setSortField] = useState<'name' | 'rollNo' | 'overallAttendance' | 'cgpa' | 'placementScore'>('rollNo');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let list = [...students];
    if (deptFilter !== 'all') list = list.filter(s => s.department === deptFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [search, deptFilter, sortField, sortDir]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortIndicator = (field: typeof sortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Student Management</h1>
        <p className="text-text-secondary text-sm mt-1">{filtered.length} students</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, roll no, or department..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          {(['all', 'CSE', 'AI&DS', 'ECE'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors
                ${deptFilter === d ? 'border-brass bg-brass-50 text-navy' : 'border-border bg-white text-text-secondary hover:border-brass/30'}`}
            >
              {d === 'all' ? 'All Depts' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="cursor-pointer hover:text-navy" onClick={() => handleSort('rollNo')}>Roll No{sortIndicator('rollNo')}</th>
                <th className="cursor-pointer hover:text-navy" onClick={() => handleSort('name')}>Name{sortIndicator('name')}</th>
                <th>Dept</th>
                <th className="cursor-pointer hover:text-navy" onClick={() => handleSort('overallAttendance')}>Attendance{sortIndicator('overallAttendance')}</th>
                <th className="cursor-pointer hover:text-navy" onClick={() => handleSort('cgpa')}>CGPA{sortIndicator('cgpa')}</th>
                <th>Fee</th>
                <th className="cursor-pointer hover:text-navy" onClick={() => handleSort('placementScore')}>Placement{sortIndicator('placementScore')}</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
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
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${s.feeStatus === 'paid' ? 'status-safe' : s.feeStatus === 'pending' ? 'status-critical' : 'status-warn'}`}>
                      {s.feeStatus}
                    </span>
                  </td>
                  <td className="tabular-nums">{s.placementScore}%</td>
                  <td>
                    {s.isAtRisk ? <span className="at-risk-badge">At Risk</span> : <span className="status-safe px-2 py-0.5 rounded text-xs font-medium">Good</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center text-text-muted py-8">No students match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
