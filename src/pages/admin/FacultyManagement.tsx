import { useState } from 'react';
import { faculty } from '@/data/mockData';
import { Search } from 'lucide-react';

export default function FacultyManagement() {
  const [search, setSearch] = useState('');

  const filtered = faculty.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.department.toLowerCase().includes(q) || f.designation.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Faculty Management</h1>
        <p className="text-text-secondary text-sm mt-1">{faculty.length} faculty members</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search faculty..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
        />
      </div>

      <div className="card-elevated">
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Subjects</th>
                <th>Weekly Hours</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td className="tabular-nums text-text-muted">{f.id}</td>
                  <td className="font-medium">{f.name}</td>
                  <td>{f.department}</td>
                  <td className="text-sm">{f.designation}</td>
                  <td>
                    <div className="space-y-0.5">
                      {f.subjects.map((s, i) => (
                        <p key={i} className="text-xs text-text-secondary">{s}</p>
                      ))}
                    </div>
                  </td>
                  <td className="tabular-nums">{f.weeklyHours} hrs</td>
                  <td className="text-xs text-text-muted">{f.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
