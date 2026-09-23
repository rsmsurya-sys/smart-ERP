import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getStudentsByDepartment, type Department, type Student } from '@/data/mockData';
import { CheckCircle, XCircle, Users } from 'lucide-react';

const classes = [
  { label: 'CSE Year 3 Sec A — CS301 (DBMS)', dept: 'CSE' as Department, classKey: 'CSE-3A-CS301' },
  { label: 'CSE Year 3 Sec A — CS302 (OS)', dept: 'CSE' as Department, classKey: 'CSE-3A-CS302' },
  { label: 'AI&DS Year 3 Sec A — AI301 (ML)', dept: 'AI&DS' as Department, classKey: 'AIDS-3A-AI301' },
  { label: 'AI&DS Year 3 Sec A — AI302 (DL)', dept: 'AI&DS' as Department, classKey: 'AIDS-3A-AI302' },
];

export default function AttendanceMarking() {
  const { state, dispatch } = useApp();
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [saved, setSaved] = useState(false);

  const students = getStudentsByDepartment(selectedClass.dept);
  const classRecords = state.attendanceRecords[selectedClass.classKey] || {};

  const isPresent = (studentId: string) => classRecords[studentId] !== false;
  const presentCount = students.filter(s => isPresent(s.id)).length;

  const toggleAttendance = (studentId: string) => {
    dispatch({
      type: 'MARK_ATTENDANCE',
      classKey: selectedClass.classKey,
      studentId,
      present: !isPresent(studentId),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const markAllPresent = () => {
    dispatch({
      type: 'MARK_ALL_ATTENDANCE',
      classKey: selectedClass.classKey,
      studentIds: students.map(s => s.id),
      present: true,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Mark Attendance</h1>
          <p className="text-text-secondary text-sm mt-1">Select a class and mark student attendance</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-safe-light border border-safe/20 animate-fade-in">
            <CheckCircle size={16} className="text-safe" />
            <span className="text-sm font-medium text-safe">Saved</span>
          </div>
        )}
      </div>

      {/* Class selector */}
      <div className="flex flex-wrap gap-2">
        {classes.map(cls => (
          <button
            key={cls.classKey}
            onClick={() => setSelectedClass(cls)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
              ${selectedClass.classKey === cls.classKey
                ? 'border-brass bg-brass-50 text-navy'
                : 'border-border bg-white text-text-secondary hover:border-brass/30'
              }`}
          >
            {cls.label}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="card-elevated p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={18} className="text-navy" />
          <span className="text-sm">
            <span className="font-semibold text-safe tabular-nums">{presentCount}</span>
            <span className="text-text-muted"> / </span>
            <span className="font-semibold tabular-nums">{students.length}</span>
            <span className="text-text-muted"> present</span>
          </span>
          <div className="h-2 w-32 bg-ivory-dark rounded-full overflow-hidden">
            <div className="h-full bg-safe rounded-full transition-all" style={{ width: `${(presentCount / students.length) * 100}%` }} />
          </div>
        </div>
        <button
          onClick={markAllPresent}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors"
          style={{ background: '#3D8B5A' }}
        >
          Mark All Present
        </button>
      </div>

      {/* Roster */}
      <div className="card-elevated">
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>S.No</th>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Department</th>
                <th style={{ width: 120 }}>Status</th>
                <th style={{ width: 80 }}>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: Student, idx: number) => {
                const present = isPresent(student.id);
                return (
                  <tr key={student.id} className={!present ? 'bg-critical-light/30' : ''}>
                    <td className="tabular-nums text-text-muted">{idx + 1}</td>
                    <td className="tabular-nums font-medium">{student.rollNo}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.name}</span>
                        {student.isAtRisk && <span className="at-risk-badge text-[10px]">At Risk</span>}
                      </div>
                    </td>
                    <td className="text-text-muted">{student.department}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium
                        ${present ? 'status-safe' : 'status-critical'}`}>
                        {present ? <><CheckCircle size={12} /> Present</> : <><XCircle size={12} /> Absent</>}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleAttendance(student.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${present ? 'bg-safe' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                          ${present ? 'left-5.5 translate-x-0' : 'left-0.5'}`}
                          style={{ left: present ? '22px' : '2px' }}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
