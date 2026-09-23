import { useApp } from '@/context/AppContext';
import { getSubjectAttendance } from '@/data/mockData';

export default function Attendance() {
  const { currentStudent } = useApp();
  if (!currentStudent) return null;

  const subjects = getSubjectAttendance(currentStudent.id);

  // Generate a mock calendar heatmap for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthName = today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Mock attendance data for calendar (random but consistent)
  const dayStatuses: ('present' | 'absent' | 'holiday' | 'none')[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(today.getFullYear(), today.getMonth(), d).getDay();
    if (dayOfWeek === 0) {
      dayStatuses.push('holiday');
    } else if (d > today.getDate()) {
      dayStatuses.push('none');
    } else {
      // Use attendance % to determine probability
      const prob = currentStudent.overallAttendance / 100;
      // Deterministic pseudo-random based on day
      const hash = (d * 7 + currentStudent.id.charCodeAt(3)) % 100;
      dayStatuses.push(hash < prob * 100 ? 'present' : 'absent');
    }
  }

  const statusColors: Record<string, string> = {
    present: '#3D8B5A',
    absent: '#B84040',
    holiday: '#E2E0DB',
    none: 'transparent',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Attendance Details</h1>
        <p className="text-text-secondary text-sm mt-1">
          {currentStudent.name} · {currentStudent.rollNo} · Overall: {currentStudent.overallAttendance}%
        </p>
      </div>

      {currentStudent.overallAttendance < 75 && (
        <div className="p-4 rounded-xl border border-critical/20" style={{ background: 'rgba(184, 64, 64, 0.06)' }}>
          <p className="text-sm font-semibold text-critical">⚠ Attendance Shortage Risk</p>
          <p className="text-xs text-text-secondary mt-1">
            You need to attend at least {Math.ceil((0.75 * (subjects[0]?.totalClasses || 45) - (subjects[0]?.attended || 0)))} more classes in each subject to reach the 75% threshold.
          </p>
        </div>
      )}

      {/* Calendar heatmap */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">{monthName} — Attendance Calendar</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs text-text-muted font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first day offset */}
            {Array.from({ length: new Date(today.getFullYear(), today.getMonth(), 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {dayStatuses.map((status, i) => (
              <div
                key={i}
                className="aspect-square rounded-md flex items-center justify-center text-xs font-medium border"
                style={{
                  background: status === 'none' ? 'transparent' : statusColors[status] + '20',
                  borderColor: status === 'none' ? 'transparent' : statusColors[status] + '40',
                  color: status === 'none' ? '#94A3B8' : statusColors[status],
                }}
                title={`Day ${i + 1}: ${status}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#3D8B5A40' }} /> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#B8404040' }} /> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#E2E0DB' }} /> Holiday</span>
          </div>
        </div>
      </div>

      {/* Subject-wise detail */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Subject-wise Breakdown</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject</th>
                <th>Attended</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Classes Needed for 75%</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => {
                const needed = Math.max(0, Math.ceil((0.75 * s.totalClasses - s.attended) / (1 - 0.75)));
                return (
                  <tr key={s.subjectCode}>
                    <td className="tabular-nums text-text-muted">{s.subjectCode}</td>
                    <td className="font-medium">{s.subjectName}</td>
                    <td className="tabular-nums">{s.attended}</td>
                    <td className="tabular-nums">{s.totalClasses}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-ivory-dark rounded-full overflow-hidden" style={{ maxWidth: 80 }}>
                          <div className="h-full rounded-full" style={{
                            width: `${s.percentage}%`,
                            background: s.percentage >= 75 ? '#3D8B5A' : s.percentage >= 65 ? '#C4882F' : '#B84040',
                          }} />
                        </div>
                        <span className="tabular-nums text-sm font-medium">{s.percentage}%</span>
                      </div>
                    </td>
                    <td className="tabular-nums">{s.percentage >= 75 ? '—' : needed}</td>
                    <td>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium
                        ${s.percentage >= 75 ? 'status-safe' : s.percentage >= 65 ? 'status-warn' : 'status-critical'}`}>
                        {s.percentage >= 75 ? 'Safe' : s.percentage >= 65 ? 'Warning' : 'Critical'}
                      </span>
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
