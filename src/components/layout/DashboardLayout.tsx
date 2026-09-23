import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AIChatbot from '@/components/AIChatbot';
import { useApp } from '@/context/AppContext';

export default function DashboardLayout() {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-ivory flex">
      <Sidebar />
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
      {/* AI Chatbot only for students */}
      {state.currentRole === 'student' && <AIChatbot />}
    </div>
  );
}
