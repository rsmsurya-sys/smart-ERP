import { useApp } from '@/context/AppContext';
import { examQuestions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const EXAM_ID = 'MOCK-EXAM-001';

export default function ExamResults() {
  const { state } = useApp();
  const navigate = useNavigate();

  const submission = state.examSubmissions[EXAM_ID];
  if (!submission || !submission.submitted) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">No exam submission found.</p>
        <button onClick={() => navigate('/exam')} className="mt-4 text-brass font-medium hover:underline">
          Go to Exam Portal
        </button>
      </div>
    );
  }

  const totalMarks = examQuestions.reduce((s, q) => s + q.marks, 0);
  const percentage = Math.round(((submission.score || 0) / totalMarks) * 100);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center py-8">
        <Award size={48} className="mx-auto mb-4" style={{ color: percentage >= 60 ? '#3D8B5A' : '#B84040' }} />
        <h1 className="text-3xl font-bold text-navy">Exam Results</h1>
        <p className="text-text-secondary mt-1">General Assessment — Practice Exam</p>
      </div>

      {/* Score card */}
      <div className="card-elevated p-8 text-center">
        <p className="text-6xl font-bold tabular-nums" style={{ color: percentage >= 60 ? '#3D8B5A' : '#B84040' }}>
          {submission.score} <span className="text-2xl text-text-muted">/ {totalMarks}</span>
        </p>
        <p className="text-lg font-medium text-text-secondary mt-2">{percentage}%</p>
        <span className={`inline-block mt-3 px-4 py-1.5 rounded-lg text-sm font-semibold
          ${percentage >= 80 ? 'status-safe' : percentage >= 60 ? 'status-warn' : 'status-critical'}`}>
          {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Passed' : 'Needs Improvement'}
        </span>
      </div>

      {/* Question-wise review */}
      <div className="card-elevated">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-navy">Question-wise Review</h2>
        </div>
        <div className="p-5 space-y-4">
          {examQuestions.map(q => {
            const userAnswer = submission.answers[q.id];
            const isCorrect = q.type === 'mcq' && userAnswer === q.correctAnswer;
            const isAnswered = userAnswer !== undefined;

            return (
              <div key={q.id} className={`p-4 rounded-xl border ${isAnswered ? (q.type === 'mcq' ? (isCorrect ? 'border-safe/30 bg-safe-light/30' : 'border-critical/30 bg-critical-light/30') : 'border-border') : 'border-border bg-ivory/50'}`}>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#16213E', color: '#C89B3C' }}>
                    {q.id}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-text-primary">{q.question}</p>
                    <p className="text-xs text-text-muted mt-0.5">{q.type.toUpperCase()} · {q.marks} marks</p>

                    {q.type === 'mcq' && q.options && (
                      <div className="mt-3 space-y-1.5">
                        {q.options.map((opt, i) => {
                          const isUserChoice = userAnswer === i;
                          const isCorrectOpt = q.correctAnswer === i;
                          return (
                            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                              ${isCorrectOpt ? 'bg-safe/10 text-safe font-medium' : isUserChoice ? 'bg-critical/10 text-critical' : 'text-text-secondary'}`}>
                              {isCorrectOpt && <CheckCircle size={14} className="text-safe" />}
                              {isUserChoice && !isCorrectOpt && <XCircle size={14} className="text-critical" />}
                              {!isUserChoice && !isCorrectOpt && <span className="w-3.5" />}
                              <span>{String.fromCharCode(65 + i)}. {opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'descriptive' && (
                      <div className="mt-3 p-3 rounded-lg bg-ivory border border-border">
                        <p className="text-xs text-text-muted mb-1">Your answer:</p>
                        <p className="text-sm">{isAnswered ? String(userAnswer) : <em className="text-text-muted">Not answered</em>}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pb-8">
        <button
          onClick={() => navigate('/exam')}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-colors"
          style={{ background: '#16213E' }}
        >
          Back to Exam Portal
        </button>
      </div>
    </div>
  );
}
