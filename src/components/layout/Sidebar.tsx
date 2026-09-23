import { NavLink } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/data/mockData';
import {
  LayoutDashboard, Users, BookOpen, Calendar, FileText, Bell, ClipboardList,
  GraduationCap, Upload, CheckSquare, BarChart3, UserCog, Building2,
  MessageSquare, Brain, FileEdit, ChevronDown, LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function getNavItems(role: Role): NavItem[] {
  switch (role) {
    case 'student':
      return [
        { label: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} /> },
        { label: 'Attendance', path: '/student/attendance', icon: <CheckSquare size={18} /> },
        { label: 'Exams', path: '/student/exams', icon: <BookOpen size={18} /> },
        { label: 'Fees', path: '/student/fees', icon: <FileText size={18} /> },
        { label: 'Leave Requests', path: '/student/leave', icon: <Calendar size={18} /> },
        { label: 'Exam Portal', path: '/exam', icon: <ClipboardList size={18} /> },
        { label: 'Placement AI', path: '/ai/placement', icon: <Brain size={18} /> },
        { label: 'Resume Builder', path: '/ai/resume', icon: <FileEdit size={18} /> },
        { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
      ];
    case 'faculty':
      return [
        { label: 'Dashboard', path: '/faculty', icon: <LayoutDashboard size={18} /> },
        { label: 'Mark Attendance', path: '/faculty/attendance', icon: <CheckSquare size={18} /> },
        { label: 'Leave Approvals', path: '/faculty/leaves', icon: <Calendar size={18} /> },
        { label: 'Upload Marks', path: '/faculty/marks', icon: <Upload size={18} /> },
        { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
        { label: 'Students', path: '/admin/students', icon: <Users size={18} /> },
        { label: 'Faculty', path: '/admin/faculty', icon: <UserCog size={18} /> },
        { label: 'Placements', path: '/admin/placements', icon: <GraduationCap size={18} /> },
        { label: 'Analytics', path: '/admin', icon: <BarChart3 size={18} /> },
        { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
      ];
    case 'parent':
      return [
        { label: 'Dashboard', path: '/parent', icon: <LayoutDashboard size={18} /> },
        { label: 'Message Teacher', path: '/parent', icon: <MessageSquare size={18} /> },
        { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
      ];
  }
}

const roleLabels: Record<Role, string> = {
  student: 'Student',
  faculty: 'Faculty',
  admin: 'Admin',
  parent: 'Parent',
};

const roleColors: Record<Role, string> = {
  student: '#3D8B5A',
  faculty: '#C89B3C',
  admin: '#16213E',
  parent: '#C4882F',
};

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navItems = getNavItems(state.currentRole);

  const handleRoleSwitch = (role: Role) => {
    dispatch({ type: 'SWITCH_ROLE', role });
    setRoleSwitcherOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
               style={{ background: 'linear-gradient(135deg, #C89B3C, #D4AF57)', color: '#16213E' }}>
            <Building2 size={20} />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Bharath Institute</h1>
            <p className="text-white/40 text-xs">of Technology</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path + item.label}
            to={item.path}
            end={item.path === '/student' || item.path === '/faculty' || item.path === '/admin' || item.path === '/parent'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-item relative ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role Switcher */}
      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <p className="px-3 mb-2 text-xs text-white/30 font-medium uppercase tracking-wider">Demo Role Switch</p>
        <div className="relative">
          <button
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: roleColors[state.currentRole] }} />
              <span>{roleLabels[state.currentRole]}</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${roleSwitcherOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleSwitcherOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-navy-light rounded-lg border border-white/10 overflow-hidden shadow-xl"
                 style={{ background: '#1A2744' }}>
              {(Object.keys(roleLabels) as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors
                    ${state.currentRole === role ? 'text-brass bg-white/5' : 'text-white/60 hover:text-white/90 hover:bg-white/5'}`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: roleColors[role] }} />
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/"
          className="sidebar-nav-item mt-2 text-white/40 hover:text-white/60"
          onClick={() => setMobileOpen(false)}
        >
          <LogOut size={16} />
          <span className="text-xs">Back to Login</span>
        </NavLink>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-navy text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop Sidebar: sticky in-flow flex column */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-30"
        style={{ background: '#16213E' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <aside
          className="fixed inset-y-0 left-0 w-64 z-50 flex flex-col lg:hidden shadow-2xl animate-fade-in"
          style={{ background: '#16213E' }}
        >
          {sidebarContent}
        </aside>
      )}
    </>
  );
}
