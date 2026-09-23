import { useApp } from '@/context/AppContext';
import { getExamsForDepartment, getMarks } from '@/data/mockData';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Exams() {
  const { currentStudent } = useApp();
  const navigate = useNavigate();
  if (!currentStudent) return null;

  const allExams = getExamsForDepartment(currentStudent.department);
  const marks = getMarks(currentStudent.id);
  const internals = allExams.filter(e => e.type === 'internal');
  const semesters = allExams.filter(e => e.type === 'semester');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Examinations</h1>
        <p className="text-text-secondary text-sm mt-1">{currentStudent.department} · Year {currentStudent.year}</p>
      </div>

      {/* Upcoming Exams */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-navy">Upcoming Internal Assessments</h2>
          <button
            onClick={() => navigate('/exam')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-colors"
            style={{ background: '#16213E' }}
          >
            Go to Exam Portal
          </button>
        </div>
        <div className="p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            {internals.map(exam => (
              <div key={exam.id} className="p-4 rounded-xl bg-ivory border border-border hover:border-brass/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{exam.subjectName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{exam.subjectCode}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-brass-50 text-brass">
                    {exam.totalMarks} marks
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Calendar size={12} />{exam.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{exam.time}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} />{exam.duration} min</span>
                </div>
                <p className="text-xs text-text-muted mt-2 border-t border-border pt-2">{exam.syllabus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Exams */}
      {semesters.length > 0 && (
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Semester Examinations</h2>
          </div>
          <div className="p-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map(exam => (
                  <tr key={exam.id}>
                    <td>
                      <p className="font-medium">{exam.subjectName}</p>
                      <p className="text-xs text-text-muted">{exam.subjectCode}</p>
                    </td>
                    <td className="tabular-nums">{exam.date}</td>
                    <td>{exam.time}</td>
                    <td className="tabular-nums">{exam.duration} min</td>
                    <td className="tabular-nums">{exam.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Past Results */}
      {marks.length > 0 && (
        <div className="card-elevated">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Internal Assessment Results</h2>
          </div>
          <div className="p-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>IA-1 (50)</th>
                  <th>IA-2 (50)</th>
                  <th>IA-3 (50)</th>
                  <th>Assignment (20)</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(m => (
                  <tr key={m.subjectCode}>
                    <td>
                      <p className="font-medium">{m.subjectName}</p>
                      <p className="text-xs text-text-muted">{m.subjectCode}</p>
                    </td>
                    <td className="tabular-nums">{m.internal1}</td>
                    <td className="tabular-nums">{m.internal2}</td>
                    <td className="tabular-nums">{m.internal3}</td>
                    <td className="tabular-nums">{m.assignment}</td>
                    <td>
                      <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold
                        ${m.grade === 'O' || m.grade === 'A+' || m.grade === 'A' ? 'status-safe' :
                          m.grade === 'B' || m.grade === 'B+' ? 'status-warn' : 'status-critical'}`}>
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
    </div>
  );
}
