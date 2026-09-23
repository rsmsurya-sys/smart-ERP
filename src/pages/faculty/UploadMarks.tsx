import { useState } from 'react';
import { getStudentsByDepartment, type Department } from '@/data/mockData';
import { Upload, CheckCircle } from 'lucide-react';

const assessments = [
  { label: 'CS301 — DBMS', dept: 'CSE' as Department },
  { label: 'CS302 — OS', dept: 'CSE' as Department },
  { label: 'AI301 — ML', dept: 'AI&DS' as Department },
  { label: 'AI302 — DL', dept: 'AI&DS' as Department },
];

const types = ['Internal Assessment 1', 'Internal Assessment 2', 'Internal Assessment 3', 'Assignment'];

export default function UploadMarks() {
  const [selectedSubject, setSelectedSubject] = useState(assessments[0]);
  const [selectedType, setSelectedType] = useState(types[0]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const students = getStudentsByDepartment(selectedSubject.dept);
  const maxMarks = selectedType.includes('Assignment') ? 20 : 50;

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
    // Clear error
    if (errors[studentId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    students.forEach(s => {
      const val = marks[s.id];
      if (val !== undefined && val !== '') {
        const num = Number(val);
        if (isNaN(num) || num < 0 || num > maxMarks) {
          errs[s.id] = `0–${maxMarks}`;
        }
      }
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Upload Marks</h1>
        <p className="text-text-secondary text-sm mt-1">Select subject and assessment type, then enter marks</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Subject</label>
          <select
            value={selectedSubject.label}
            onChange={e => {
              const s = assessments.find(a => a.label === e.target.value)!;
              setSelectedSubject(s);
              setMarks({});
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
          >
            {assessments.map(a => <option key={a.label} value={a.label}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Assessment Type</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Marks table */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-navy">{selectedSubject.label} — {selectedType} (Max: {maxMarks})</h2>
          {submitted && (
            <div className="flex items-center gap-2 text-safe text-sm font-medium animate-fade-in">
              <CheckCircle size={16} />
              Marks submitted successfully
            </div>
          )}
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>S.No</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th style={{ width: 140 }}>Marks (/{maxMarks})</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td className="tabular-nums text-text-muted">{i + 1}</td>
                  <td className="tabular-nums font-medium">{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      max={maxMarks}
                      value={marks[s.id] || ''}
                      onChange={e => handleMarkChange(s.id, e.target.value)}
                      placeholder="—"
                      className={`w-24 px-3 py-1.5 rounded-lg border text-sm tabular-nums bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30
                        ${errors[s.id] ? 'border-critical' : 'border-border'}`}
                    />
                    {errors[s.id] && <p className="text-critical text-xs mt-0.5">{errors[s.id]}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
            style={{ background: '#16213E' }}
          >
            <Upload size={16} />
            Submit Marks
          </button>
        </div>
      </div>
    </div>
  );
}
