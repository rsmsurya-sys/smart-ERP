import { useApp } from '@/context/AppContext';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '@/data/mockData';
import { students, faculty, parents } from '@/data/mockData';

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

export default function TopBar() {
  const { state } = useApp();
  const navigate = useNavigate();

  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Get current user name
  let userName = 'Administrator';
  if (state.currentRole === 'student') {
    const s = students.find(s => s.id === state.currentUserId);
    userName = s?.name || 'Student';
  } else if (state.currentRole === 'faculty') {
    const f = faculty.find(f => f.id === state.currentUserId);
    userName = f?.name || 'Faculty';
  } else if (state.currentRole === 'parent') {
    const p = parents.find(p => p.id === state.currentUserId);
    userName = p?.name || 'Parent';
  }

  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left — Page context */}
      <div className="lg:ml-0 ml-12">
        <p className="text-xs text-text-secondary font-medium">
          {roleLabels[state.currentRole]} Portal
        </p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-lg hover:bg-ivory-dark transition-colors"
        >
          <Bell size={20} className="text-text-secondary" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-critical text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-primary leading-tight">{userName}</p>
            <p className="text-xs text-text-secondary">{roleLabels[state.currentRole]}</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: roleColors[state.currentRole] }}
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
