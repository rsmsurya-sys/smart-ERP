import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/data/mockData';
import { GraduationCap, ShieldCheck, BarChart3, Users, Building2, BookOpen, Brain, Bell } from 'lucide-react';

const roles: { key: Role; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'student', label: 'Student', icon: <GraduationCap size={20} />, desc: 'Access your dashboard, attendance, exams & more' },
  { key: 'faculty', label: 'Faculty', icon: <BookOpen size={20} />, desc: 'Manage attendance, grades & leave approvals' },
  { key: 'parent', label: 'Parent', icon: <Users size={20} />, desc: 'Monitor your child\'s progress & communicate' },
  { key: 'admin', label: 'Admin', icon: <ShieldCheck size={20} />, desc: 'Oversee departments, analytics & management' },
];

const features = [
  { icon: <Brain size={28} />, title: 'AI-Powered Analytics', desc: 'Predictive attendance tracking, placement readiness scoring, and automated risk flagging powered by intelligent algorithms.' },
  { icon: <ShieldCheck size={28} />, title: 'Secure Examinations', desc: 'Proctored online exams with tab-switch detection, auto-submission, and tamper-proof result generation.' },
  { icon: <Bell size={28} />, title: 'Multi-Channel Alerts', desc: 'Bilingual notifications via SMS, WhatsApp, email, and push — keeping students, faculty, and parents always informed.' },
  { icon: <BarChart3 size={28} />, title: 'Real-Time Dashboards', desc: 'Role-specific dashboards with live data on attendance, fees, placements, and academic performance.' },
];

export default function Landing() {
  const [activeRole, setActiveRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = 'Email or ID is required';
    if (!password.trim()) errs.password = 'Password is required';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch({ type: 'SWITCH_ROLE', role: activeRole });
    const paths: Record<Role, string> = {
      student: '/student',
      faculty: '/faculty',
      admin: '/admin',
      parent: '/parent',
    };
    navigate(paths[activeRole]);
  };

  const handleGoogleLogin = () => {
    dispatch({ type: 'SWITCH_ROLE', role: activeRole });
    const paths: Record<Role, string> = {
      student: '/student',
      faculty: '/faculty',
      admin: '/admin',
      parent: '/parent',
    };
    navigate(paths[activeRole]);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #C89B3C, #D4AF57)', color: '#16213E' }}>
              <Building2 size={20} />
            </div>
            <div>
              <span className="font-bold text-navy text-sm">Bharath Institute of Technology</span>
            </div>
          </div>
          <a href="#login" className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
             style={{ background: '#16213E' }}>
            Sign In
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #16213E 0%, #1A2744 50%, #243154 100%)',
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #C89B3C 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C89B3C 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
                 style={{ background: 'rgba(200, 155, 60, 0.15)', color: '#D4AF57' }}>
              <Brain size={14} />
              AI-Powered Campus Management
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              One platform from
              <span className="block" style={{ color: '#D4AF57' }}>admissions to placements</span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl mb-8 leading-relaxed">
              Intelligent attendance tracking, secure online examinations, AI-driven analytics,
              parent communication, and digital document management — unified for the modern Indian campus.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { n: '2,500+', l: 'Students Managed' },
                { n: '120+', l: 'Faculty Members' },
                { n: '94%', l: 'Placement Rate' },
                { n: '15', l: 'Departments' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white tabular-nums">{stat.n}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-navy mb-2">Platform Capabilities</h2>
        <p className="text-text-secondary mb-10">Everything your institution needs, intelligently connected.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="card-elevated p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                   style={{ background: '#16213E', color: '#C89B3C' }}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-navy mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-1 text-center">Sign in to your portal</h2>
          <p className="text-text-secondary text-sm text-center mb-8">Select your role and enter your credentials</p>

          {/* Role tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.key}
                onClick={() => setActiveRole(r.key)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all border
                  ${activeRole === r.key
                    ? 'border-brass bg-brass-50 text-navy shadow-sm'
                    : 'border-border bg-white text-text-secondary hover:border-brass/30'
                  }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>

          <div className="card-elevated p-6">
            <p className="text-xs text-text-secondary mb-5">{roles.find(r => r.key === activeRole)?.desc}</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  {activeRole === 'student' ? 'Roll Number / Email' :
                   activeRole === 'parent' ? 'Phone Number / Email' :
                   'Employee ID / Email'}
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={activeRole === 'student' ? '21CS101' : activeRole === 'parent' ? '9850001001' : 'FAC001'}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all
                    ${errors.email ? 'border-critical' : 'border-border'}`}
                />
                {errors.email && <p className="text-critical text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-ivory focus:outline-none focus:ring-2 focus:ring-brass/30 transition-all
                    ${errors.password ? 'border-critical' : 'border-border'}`}
                />
                {errors.password && <p className="text-critical text-xs mt-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#16213E' }}
              >
                Sign In as {roles.find(r => r.key === activeRole)?.label}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-text-muted">or</span></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-border bg-white text-sm font-medium text-text-primary hover:bg-ivory-dark transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-text-muted mt-4">
              Demo mode — enter any credentials to proceed
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-6 text-center">
        <p className="text-xs text-text-muted">
          Smart AI-Powered College ERP Management System — B.Tech Mini Project, AI & Data Science Dept.
        </p>
      </footer>
    </div>
  );
}
