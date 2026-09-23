import { exams } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, PlayCircle, CheckCircle } from 'lucide-react';

export default function ExamList() {
  const { state } = useApp();
  const navigate = useNavigate();

  const mockExamId = 'MOCK-EXAM-001';
  const isSubmitted = state.examSubmissions[mockExamId]?.submitted;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">Online Examination Portal</h1>
        <p className="text-text-secondary text-sm mt-1">Secure proctored examinations</p>
      </div>

      {/* Mock exam card */}
      <div className="card-elevated p-6 border-l-4" style={{ borderLeftColor: isSubmitted ? '#3D8B5A' : '#C89B3C' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-lg text-navy">Sample Practice Exam — General Assessment</h2>
              {isSubmitted && <span className="status-safe px-2 py-0.5 rounded text-xs font-medium">Completed</span>}
            </div>
            <p className="text-sm text-text-secondary">8 MCQ + 2 Descriptive questions · Mixed subjects</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Clock size={12} />Duration: 10 minutes</span>
              <span className="flex items-center gap-1"><BookOpen size={12} />Total: 34 marks</span>
              <span className="flex items-center gap-1"><Calendar size={12} />Available now</span>
            </div>
          </div>
          <button
            onClick={() => navigate(isSubmitted ? '/exam/results' : '/exam/take')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-colors flex-shrink-0"
            style={{ background: isSubmitted ? '#3D8B5A' : '#C89B3C' }}
          >
            {isSubmitted ? <><CheckCircle size={16} /> View Results</> : <><PlayCircle size={16} /> Start Exam</>}
          </button>
        </div>
      </div>

      {/* Regular exams */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Scheduled Examinations</h2>
        </div>
        <div className="p-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Type</th>
                <th>Total Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.id}>
                  <td>
                    <p className="font-medium">{exam.subjectName}</p>
                    <p className="text-xs text-text-muted">{exam.subjectCode} · {exam.department}</p>
                  </td>
                  <td className="tabular-nums">{exam.date}</td>
                  <td>{exam.time}</td>
                  <td className="tabular-nums">{exam.duration} min</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-navy-50 text-navy capitalize">{exam.type}</span>
                  </td>
                  <td className="tabular-nums">{exam.totalMarks}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded text-xs font-medium status-warn">Upcoming</span>
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
