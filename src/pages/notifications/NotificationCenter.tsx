import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { NotificationChannel } from '@/data/mockData';
import { Bell, Mail, MessageCircle, Smartphone, Globe, CheckCheck, Wifi } from 'lucide-react';

const channelConfig: Record<NotificationChannel, { icon: React.ReactNode; label: string; color: string }> = {
  'in-app': { icon: <Bell size={14} />, label: 'In-App', color: '#16213E' },
  'email': { icon: <Mail size={14} />, label: 'Email', color: '#3D8B5A' },
  'sms': { icon: <Smartphone size={14} />, label: 'SMS', color: '#C4882F' },
  'whatsapp': { icon: <MessageCircle size={14} />, label: 'WhatsApp', color: '#25D366' },
  'push': { icon: <Wifi size={14} />, label: 'Push', color: '#6366F1' },
};

export default function NotificationCenter() {
  const { state, dispatch } = useApp();
  const [channelFilter, setChannelFilter] = useState<NotificationChannel | 'all'>('all');
  const [showTamil, setShowTamil] = useState<Set<string>>(new Set());

  const filtered = state.notifications.filter(n =>
    channelFilter === 'all' || n.channel === channelFilter
  );

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const toggleLang = (id: string) => {
    setShowTamil(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Notifications</h1>
          <p className="text-text-secondary text-sm mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border bg-white hover:bg-ivory transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Channel filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setChannelFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors
            ${channelFilter === 'all' ? 'border-brass bg-brass-50 text-navy' : 'border-border bg-white text-text-secondary hover:border-brass/30'}`}
        >
          All Channels
        </button>
        {(Object.keys(channelConfig) as NotificationChannel[]).map(ch => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors
              ${channelFilter === ch ? 'border-brass bg-brass-50 text-navy' : 'border-border bg-white text-text-secondary hover:border-brass/30'}`}
          >
            {channelConfig[ch].icon}
            {channelConfig[ch].label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Bell size={32} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-secondary">No notifications in this channel</p>
          </div>
        ) : (
          filtered.map(n => {
            const ch = channelConfig[n.channel];
            const isTamil = showTamil.has(n.id);
            const hasTamil = !!n.titleTamil;

            return (
              <div
                key={n.id}
                className={`card-elevated p-4 flex gap-4 transition-colors cursor-pointer
                  ${!n.read ? 'border-l-4' : ''}`}
                style={{ borderLeftColor: !n.read ? ch.color : undefined }}
                onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', notificationId: n.id })}
              >
                {/* Channel icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: ch.color }}
                >
                  {ch.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>
                      {isTamil && n.titleTamil ? n.titleTamil : n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brass flex-shrink-0" />}
                  </div>
                  <p className={`text-sm mt-1 ${n.read ? 'text-text-muted' : 'text-text-secondary'}`}>
                    {isTamil && n.messageTamil ? n.messageTamil : n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-text-muted">{formatTime(n.timestamp)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ivory border border-border text-text-muted capitalize">
                      {n.category}
                    </span>
                    {hasTamil && (
                      <button
                        onClick={e => { e.stopPropagation(); toggleLang(n.id); }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border border-brass/30 text-brass hover:bg-brass-50 transition-colors"
                      >
                        <Globe size={10} />
                        {isTamil ? 'English' : 'தமிழ்'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
