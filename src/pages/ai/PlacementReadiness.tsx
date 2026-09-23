import { useState } from 'react';
import { Brain, Target, BookOpen, AlertTriangle } from 'lucide-react';

const skillOptions = [
  'Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Tableau', 'Power BI', 'Cloud Computing', 'AWS', 'Docker',
  'Git', 'Linux', 'VLSI', 'Embedded Systems', 'IoT', 'MATLAB',
  'Communication', 'Problem Solving', 'Leadership',
];

const jobSuggestions: Record<string, { title: string; company: string; match: number }[]> = {
  high: [
    { title: 'Software Engineer', company: 'Google / Microsoft', match: 92 },
    { title: 'Data Scientist', company: 'Amazon / Flipkart', match: 88 },
    { title: 'ML Engineer', company: 'NVIDIA / Intel', match: 85 },
    { title: 'Full Stack Developer', company: 'Zoho / Freshworks', match: 82 },
  ],
  medium: [
    { title: 'Associate Software Engineer', company: 'TCS / Infosys', match: 75 },
    { title: 'Data Analyst', company: 'Accenture / Cognizant', match: 70 },
    { title: 'QA Engineer', company: 'Wipro / HCL', match: 68 },
  ],
  low: [
    { title: 'Technical Support', company: 'TCS / Wipro', match: 55 },
    { title: 'Trainee Developer', company: 'Local IT companies', match: 50 },
  ],
};

export default function PlacementReadiness() {
  const [cgpa, setCgpa] = useState('8.0');
  const [attendance, setAttendance] = useState('85');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'SQL', 'Machine Learning']);
  const [analyzed, setAnalyzed] = useState(false);
  const [score, setScore] = useState(0);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const analyze = () => {
    const cgpaScore = Math.min(10, parseFloat(cgpa) || 0) / 10 * 40;
    const attScore = Math.min(100, parseFloat(attendance) || 0) / 100 * 20;
    const skillScore = Math.min(10, selectedSkills.length) / 10 * 40;
    const total = Math.round(cgpaScore + attScore + skillScore);
    setScore(total);
    setAnalyzed(true);
  };

  const tier = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';
  const jobs = jobSuggestions[tier];
  const missingSkills = ['Cloud Computing', 'Docker', 'System Design', 'DevOps', 'Communication'].filter(
    s => !selectedSkills.includes(s)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">AI Placement Readiness</h1>
        <p className="text-text-secondary text-sm mt-1">Analyze your placement probability and get personalized recommendations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input form */}
        <div className="card-elevated p-6 space-y-5">
          <h2 className="font-semibold text-navy">Your Profile</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">CGPA</label>
              <input
                type="number" min="0" max="10" step="0.1"
                value={cgpa} onChange={e => setCgpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Attendance %</label>
              <input
                type="number" min="0" max="100"
                value={attendance} onChange={e => setAttendance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30 tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Skills (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                    ${selectedSkills.includes(skill)
                      ? 'border-brass bg-brass-50 text-navy'
                      : 'border-border bg-white text-text-secondary hover:border-brass/30'
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={analyze}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
            style={{ background: '#16213E' }}
          >
            <Brain size={16} />
            Analyze Readiness
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {analyzed ? (
            <>
              {/* Score gauge */}
              <div className="card-elevated p-8 text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#E2E0DB" strokeWidth="8" />
                    <circle cx="60" cy="60" r="54" fill="none"
                      stroke={score >= 75 ? '#3D8B5A' : score >= 50 ? '#C4882F' : '#B84040'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(score / 100) * 339} 339`}
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold tabular-nums" style={{ color: score >= 75 ? '#3D8B5A' : score >= 50 ? '#C4882F' : '#B84040' }}>
                      {score}%
                    </p>
                    <p className="text-xs text-text-muted">Readiness</p>
                  </div>
                </div>
                <p className={`font-semibold text-lg ${score >= 75 ? 'text-safe' : score >= 50 ? 'text-warn' : 'text-critical'}`}>
                  {score >= 75 ? 'Highly Ready' : score >= 50 ? 'Moderately Ready' : 'Needs Improvement'}
                </p>
              </div>

              {/* Job suggestions */}
              <div className="card-elevated">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Target size={16} className="text-brass" />
                  <h2 className="font-semibold text-navy">Suggested Job Roles</h2>
                </div>
                <div className="p-5 space-y-3">
                  {jobs.map((j, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-ivory">
                      <div>
                        <p className="font-medium text-sm">{j.title}</p>
                        <p className="text-xs text-text-muted">{j.company}</p>
                      </div>
                      <span className="tabular-nums text-sm font-medium" style={{ color: j.match >= 80 ? '#3D8B5A' : j.match >= 65 ? '#C4882F' : '#B84040' }}>
                        {j.match}% match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill gaps */}
              <div className="card-elevated">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warn" />
                  <h2 className="font-semibold text-navy">Recommended Skill Improvements</h2>
                </div>
                <div className="p-5 space-y-2">
                  {missingSkills.map(sk => (
                    <div key={sk} className="flex items-center gap-3 p-3 rounded-lg bg-warn-light/50 border border-warn/10">
                      <BookOpen size={14} className="text-warn flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-text-primary">{sk}</p>
                        <p className="text-xs text-text-muted">High industry demand — add this to your skillset</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="card-elevated p-12 text-center">
              <Brain size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary">Fill in your details and click "Analyze Readiness" to get your AI-powered placement prediction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
