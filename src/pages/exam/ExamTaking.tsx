import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { examQuestions } from '@/data/mockData';
import { Clock, AlertTriangle, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

const EXAM_ID = 'MOCK-EXAM-001';
const TOTAL_TIME = 600; // 10 minutes in seconds

export default function ExamTaking() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [tabViolations, setTabViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // If already submitted, redirect to results
  useEffect(() => {
    if (state.examSubmissions[EXAM_ID]?.submitted) {
      navigate('/exam/results');
    }
  }, [state.examSubmissions, navigate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabViolations(prev => {
          const next = prev + 1;
          if (next >= 3) {
            handleAutoSubmit();
          }
          return next;
        });
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 5000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [answers]);

  const calculateScore = useCallback(() => {
    let score = 0;
    examQuestions.forEach(q => {
      if (q.type === 'mcq' && answers[q.id] === q.correctAnswer) {
        score += q.marks;
      }
      // Descriptive: give partial marks if answered
      if (q.type === 'descriptive' && answers[q.id] && String(answers[q.id]).trim().length > 20) {
        score += Math.ceil(q.marks * 0.6); // Mock partial score
      }
    });
    return score;
  }, [answers]);

  const handleAutoSubmit = () => {
    const score = calculateScore();
    dispatch({ type: 'SUBMIT_EXAM', examId: EXAM_ID, answers, score });
    navigate('/exam/results');
  };

  const handleSubmit = () => {
    setShowConfirm(false);
    const score = calculateScore();
    dispatch({ type: 'SUBMIT_EXAM', examId: EXAM_ID, answers, score });
    navigate('/exam/results');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const question = examQuestions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = timeLeft < 300;

  return (
    <div className="exam-fullscreen">
      {/* Tab switch warning */}
      {showWarning && (
        <div className="tab-switch-warning">
          <AlertTriangle size={16} className="inline mr-2" />
          Tab switch detected! Violation {tabViolations}/3. Three violations will auto-submit your exam.
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-navy text-white px-6 py-3 flex items-center justify-between shadow-lg"
           style={{ background: '#16213E', marginTop: showWarning ? '48px' : '0' }}>
        <div>
          <h1 className="font-semibold text-sm">General Assessment — Practice Exam</h1>
          <p className="text-white/50 text-xs mt-0.5">{answeredCount}/{examQuestions.length} answered</p>
        </div>
        <div className="flex items-center gap-6">
          {tabViolations > 0 && (
            <span className="text-critical text-xs font-medium">
              Violations: {tabViolations}/3
            </span>
          )}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-mono font-bold
            ${isTimeWarning ? 'bg-critical/20 text-red-300' : 'bg-white/10'}`}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
            style={{ background: '#C89B3C', color: '#16213E' }}
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 56px)', marginTop: showWarning ? '0' : '0' }}>
        {/* Question nav sidebar */}
        <div className="w-20 bg-ivory border-r border-border p-3 overflow-y-auto flex-shrink-0">
          <p className="text-xs text-text-muted font-medium mb-3 text-center">Questions</p>
          <div className="grid grid-cols-2 gap-1.5">
            {examQuestions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              const isCurrent = i === currentQ;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center relative transition-colors
                    ${isCurrent ? 'ring-2 ring-brass' : ''}
                    ${isAnswered ? 'bg-safe text-white' : 'bg-white border border-border text-text-secondary'}
                  `}
                >
                  {q.id}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-warn rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 text-[10px] text-text-muted">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-safe rounded" /> Answered</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-white border border-border rounded" /> Unanswered</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-warn rounded-full" /> Flagged</div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Question header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ background: '#16213E', color: '#C89B3C' }}>
                  {question.id}
                </span>
                <div>
                  <span className="text-xs text-text-muted uppercase font-medium">
                    {question.type === 'mcq' ? 'Multiple Choice' : 'Descriptive'}
                  </span>
                  <span className="text-xs text-text-muted ml-2">· {question.marks} marks</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setFlagged(prev => {
                    const next = new Set(prev);
                    if (next.has(question.id)) next.delete(question.id);
                    else next.add(question.id);
                    return next;
                  });
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                  ${flagged.has(question.id)
                    ? 'border-warn bg-warn-light text-warn'
                    : 'border-border bg-white text-text-muted hover:border-warn/30'
                  }`}
              >
                <Flag size={12} />
                {flagged.has(question.id) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            {/* Question text */}
            <p className="text-lg font-medium text-text-primary mb-6 leading-relaxed">{question.question}</p>

            {/* MCQ options */}
            {question.type === 'mcq' && question.options && (
              <div className="space-y-3">
                {question.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => setAnswers(prev => ({ ...prev, [question.id]: optIdx }))}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition-all
                      ${answers[question.id] === optIdx
                        ? 'border-brass bg-brass-50 font-medium'
                        : 'border-border bg-white hover:border-brass/30'
                      }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-xs font-bold
                      ${answers[question.id] === optIdx
                        ? 'bg-brass text-white'
                        : 'bg-ivory text-text-muted'
                      }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Descriptive */}
            {question.type === 'descriptive' && (
              <textarea
                value={(answers[question.id] as string) || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                rows={8}
                placeholder="Write your answer here..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brass/30 resize-none"
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-white hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-sm text-text-muted">{currentQ + 1} of {examQuestions.length}</span>
              <button
                onClick={() => setCurrentQ(Math.min(examQuestions.length - 1, currentQ + 1))}
                disabled={currentQ === examQuestions.length - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ background: '#16213E' }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-navy mb-2">Submit Examination?</h3>
            <p className="text-sm text-text-secondary mb-4">
              You have answered {answeredCount} out of {examQuestions.length} questions.
              {answeredCount < examQuestions.length && (
                <span className="block mt-1 text-warn font-medium">
                  {examQuestions.length - answeredCount} questions are unanswered.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-ivory transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
                style={{ background: '#C89B3C' }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
