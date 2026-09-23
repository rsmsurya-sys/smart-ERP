import { useState } from 'react';
import { FileEdit, Download, Star } from 'lucide-react';

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: 'Arun Kumar R',
    email: 'arun.kumar@college.edu',
    phone: '9876543210',
    college: 'Bharath Institute of Technology',
    degree: 'B.Tech Computer Science & Engineering',
    cgpa: '8.6',
    year: '2024-2028',
    skills: 'Python, Java, Machine Learning, SQL, React, Node.js',
    projects: 'AI-Based Attendance System — Built using face recognition with OpenCV and Python.\nOnline Exam Portal — Full-stack web app with React and Express.',
    experience: 'Intern at TCS — Summer 2026, Web Development team.',
    certifications: 'Google Cloud Associate, AWS Cloud Practitioner',
    achievements: 'Smart India Hackathon 2026 Finalist, Department Topper Sem 3',
  });
  const [generated, setGenerated] = useState(false);

  const u = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  // Calculate ATS score based on completeness
  const filledFields = Object.values(form).filter(v => v.trim().length > 0).length;
  const atsScore = Math.round((filledFields / Object.keys(form).length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-navy">AI Resume Builder</h1>
        <p className="text-text-secondary text-sm mt-1">Generate an ATS-optimized resume from your profile</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="font-semibold text-navy">Your Details</h2>
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'college', label: 'College', type: 'text' },
            { key: 'degree', label: 'Degree', type: 'text' },
            { key: 'cgpa', label: 'CGPA', type: 'text' },
            { key: 'year', label: 'Graduation Year', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-text-primary mb-1">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => u(f.key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30"
              />
            </div>
          ))}
          {[
            { key: 'skills', label: 'Skills (comma-separated)', rows: 2 },
            { key: 'projects', label: 'Projects', rows: 3 },
            { key: 'experience', label: 'Experience', rows: 2 },
            { key: 'certifications', label: 'Certifications', rows: 2 },
            { key: 'achievements', label: 'Achievements', rows: 2 },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-text-primary mb-1">{f.label}</label>
              <textarea
                value={form[f.key as keyof typeof form]}
                onChange={e => u(f.key, e.target.value)}
                rows={f.rows}
                className="w-full px-3 py-2 rounded-lg border border-border bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brass/30 resize-none"
              />
            </div>
          ))}
          <button
            onClick={() => setGenerated(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-colors"
            style={{ background: '#16213E' }}
          >
            <FileEdit size={16} />
            Generate Resume
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* ATS Score */}
          <div className="card-elevated p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star size={20} className="text-brass" />
              <div>
                <p className="font-semibold text-navy">ATS Compatibility Score</p>
                <p className="text-xs text-text-muted">Based on completeness and keyword coverage</p>
              </div>
            </div>
            <p className={`text-3xl font-bold tabular-nums ${atsScore >= 80 ? 'text-safe' : atsScore >= 60 ? 'text-warn' : 'text-critical'}`}>
              {atsScore}%
            </p>
          </div>

          {generated ? (
            <>
              {/* Resume preview */}
              <div className="card-elevated p-8 space-y-5" style={{ fontFamily: 'Georgia, serif' }}>
                {/* Header */}
                <div className="text-center border-b-2 border-navy pb-4">
                  <h2 className="text-2xl font-bold" style={{ color: '#16213E', fontFamily: 'var(--font-sans)' }}>{form.name}</h2>
                  <p className="text-sm text-text-secondary mt-1">{form.email} | {form.phone}</p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Education</h3>
                  <p className="text-sm"><strong>{form.degree}</strong></p>
                  <p className="text-sm text-text-secondary">{form.college} | {form.year} | CGPA: {form.cgpa}</p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Technical Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.split(',').map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs bg-ivory border border-border">{s.trim()}</span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                {form.projects && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Projects</h3>
                    {form.projects.split('\n').filter(Boolean).map((p, i) => (
                      <p key={i} className="text-sm text-text-primary mb-1">• {p}</p>
                    ))}
                  </div>
                )}

                {/* Experience */}
                {form.experience && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Experience</h3>
                    {form.experience.split('\n').filter(Boolean).map((e, i) => (
                      <p key={i} className="text-sm text-text-primary mb-1">• {e}</p>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {form.certifications && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Certifications</h3>
                    {form.certifications.split(',').map((c, i) => (
                      <p key={i} className="text-sm text-text-primary mb-0.5">• {c.trim()}</p>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {form.achievements && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy border-b border-border pb-1 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>Achievements</h3>
                    {form.achievements.split(',').map((a, i) => (
                      <p key={i} className="text-sm text-text-primary mb-0.5">• {a.trim()}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => alert('Resume downloaded as PDF (mock)')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border border-brass text-brass hover:bg-brass-50 transition-colors"
              >
                <Download size={16} />
                Download as PDF
              </button>
            </>
          ) : (
            <div className="card-elevated p-12 text-center">
              <FileEdit size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary">Fill in your details and click "Generate Resume" to see your ATS-optimized resume preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
