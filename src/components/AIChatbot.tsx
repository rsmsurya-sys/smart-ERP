import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getSubjectAttendance, getFeeRecord, getExamsForDepartment, getMarks } from '@/data/mockData';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hello! I\'m your AI assistant. Ask me about your attendance, fees, exams, or placement readiness.' },
  ]);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { currentStudent } = useApp();

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getResponse(query: string): string {
    const q = query.toLowerCase();
    if (!currentStudent) return lang === 'en' ? 'No student data available.' : 'மாணவர் தரவு கிடைக்கவில்லை.';

    if (q.includes('attendance')) {
      const subjects = getSubjectAttendance(currentStudent.id);
      if (subjects.length === 0) {
        return lang === 'en'
          ? `Your overall attendance is ${currentStudent.overallAttendance}%.`
          : `உங்கள் ஒட்டுமொத்த வருகை ${currentStudent.overallAttendance}%.`;
      }
      const subjectLines = subjects.map(s =>
        `  • ${s.subjectName}: ${s.percentage}% (${s.attended}/${s.totalClasses})`
      ).join('\n');
      const riskWarning = currentStudent.overallAttendance < 75
        ? (lang === 'en'
          ? '\n\n⚠️ Warning: Your attendance is below 75%. You may face shortage issues. Please attend classes regularly.'
          : '\n\n⚠️ எச்சரிக்கை: உங்கள் வருகை 75%க்கு கீழ் உள்ளது. தொடர்ந்து வகுப்புகளில் கலந்துகொள்ளவும்.')
        : '';
      return lang === 'en'
        ? `Your overall attendance: ${currentStudent.overallAttendance}%\n\nSubject-wise:\n${subjectLines}${riskWarning}`
        : `உங்கள் ஒட்டுமொத்த வருகை: ${currentStudent.overallAttendance}%\n\nபாடவாரியாக:\n${subjectLines}${riskWarning}`;
    }

    if (q.includes('fee') || q.includes('fees')) {
      const fee = getFeeRecord(currentStudent.id);
      if (!fee) return lang === 'en' ? 'No fee records found.' : 'கட்டண பதிவுகள் காணப்படவில்லை.';
      return lang === 'en'
        ? `Fee Status: ${fee.status.toUpperCase()}\nTotal: ₹${fee.totalFee.toLocaleString()}\nPaid: ₹${fee.paidAmount.toLocaleString()}\nDue: ₹${(fee.totalFee - fee.paidAmount).toLocaleString()}\nDue Date: ${fee.dueDate}`
        : `கட்டண நிலை: ${fee.status === 'paid' ? 'செலுத்தப்பட்டது' : fee.status === 'pending' ? 'நிலுவையில்' : 'பகுதியாக'}\nமொத்தம்: ₹${fee.totalFee.toLocaleString()}\nசெலுத்தியது: ₹${fee.paidAmount.toLocaleString()}\nநிலுவை: ₹${(fee.totalFee - fee.paidAmount).toLocaleString()}`;
    }

    if (q.includes('exam')) {
      const deptExams = getExamsForDepartment(currentStudent.department);
      if (deptExams.length === 0) return lang === 'en' ? 'No upcoming exams found.' : 'வரவிருக்கும் தேர்வுகள் இல்லை.';
      const examLines = deptExams.slice(0, 4).map(e =>
        `  • ${e.subjectName} — ${e.date} at ${e.time} (${e.type})`
      ).join('\n');
      return lang === 'en'
        ? `Upcoming exams:\n${examLines}`
        : `வரவிருக்கும் தேர்வுகள்:\n${examLines}`;
    }

    if (q.includes('cgpa') || q.includes('gpa') || q.includes('grade')) {
      return lang === 'en'
        ? `Your current CGPA: ${currentStudent.cgpa}\nSemester-wise GPA: ${currentStudent.semesterGPA.join(', ')}`
        : `உங்கள் தற்போதைய CGPA: ${currentStudent.cgpa}\nசெமஸ்டர் வாரியாக GPA: ${currentStudent.semesterGPA.join(', ')}`;
    }

    if (q.includes('mark') || q.includes('score')) {
      const marks = getMarks(currentStudent.id);
      if (marks.length === 0) return lang === 'en' ? 'No marks data found.' : 'மதிப்பெண் தரவு இல்லை.';
      const markLines = marks.map(m =>
        `  • ${m.subjectName}: IA1=${m.internal1}, IA2=${m.internal2}, IA3=${m.internal3} | Grade: ${m.grade || 'N/A'}`
      ).join('\n');
      return lang === 'en'
        ? `Your marks:\n${markLines}`
        : `உங்கள் மதிப்பெண்கள்:\n${markLines}`;
    }

    if (q.includes('placement') || q.includes('job') || q.includes('career')) {
      return lang === 'en'
        ? `Your placement readiness score: ${currentStudent.placementScore}%\nSkills: ${currentStudent.skills.join(', ')}\n\n${currentStudent.placementScore >= 70 ? 'You are well-prepared for placements!' : 'Consider improving your skills portfolio and CGPA to increase placement chances.'}`
        : `உங்கள் வேலைவாய்ப்பு தயார்நிலை மதிப்பெண்: ${currentStudent.placementScore}%\nதிறன்கள்: ${currentStudent.skills.join(', ')}`;
    }

    return lang === 'en'
      ? 'I can help you with: attendance, fees, exams, CGPA, marks, and placement readiness. Try asking about one of these!'
      : 'வருகை, கட்டணம், தேர்வுகள், CGPA, மதிப்பெண்கள், வேலைவாய்ப்பு பற்றி கேளுங்கள்!';
  }

  function handleSend() {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    const botMsg: ChatMessage = { role: 'bot', text: getResponse(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  }

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-105 animate-pulse-brass"
          style={{ background: 'linear-gradient(135deg, #C89B3C, #D4AF57)' }}
        >
          <MessageCircle size={24} color="#16213E" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-slide-in-right border border-border"
             style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border rounded-t-2xl"
               style={{ background: '#16213E' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #C89B3C, #D4AF57)' }}>
                <MessageCircle size={16} color="#16213E" />
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">AI Assistant</h3>
                <p className="text-white/40 text-xs">Smart ERP Helper</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-white/60 hover:text-white/90 hover:bg-white/10 transition-colors"
                title="Toggle language"
              >
                <Globe size={12} />
                {lang === 'en' ? 'EN' : 'தமிழ்'}
              </button>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flex flex-col">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={lang === 'en' ? 'Ask about attendance, fees, exams...' : 'வருகை, கட்டணம், தேர்வுகள் பற்றி கேளுங்கள்...'}
                className="flex-1 px-4 py-2.5 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:border-brass transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-3 py-2.5 rounded-xl text-white transition-colors hover:opacity-90"
                style={{ background: '#16213E' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
