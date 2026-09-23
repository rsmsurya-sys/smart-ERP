import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import Landing from '@/pages/Landing';
import StudentDashboard from '@/pages/student/StudentDashboard';
import Attendance from '@/pages/student/Attendance';
import Exams from '@/pages/student/Exams';
import Fees from '@/pages/student/Fees';
import LeaveRequest from '@/pages/student/LeaveRequest';
import FacultyDashboard from '@/pages/faculty/FacultyDashboard';
import AttendanceMarking from '@/pages/faculty/AttendanceMarking';
import LeaveApprovals from '@/pages/faculty/LeaveApprovals';
import UploadMarks from '@/pages/faculty/UploadMarks';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentManagement from '@/pages/admin/StudentManagement';
import FacultyManagement from '@/pages/admin/FacultyManagement';
import PlacementOverview from '@/pages/admin/PlacementOverview';
import ParentDashboard from '@/pages/parent/ParentDashboard';
import ExamList from '@/pages/exam/ExamList';
import ExamTaking from '@/pages/exam/ExamTaking';
import ExamResults from '@/pages/exam/ExamResults';
import PlacementReadiness from '@/pages/ai/PlacementReadiness';
import ResumeBuilder from '@/pages/ai/ResumeBuilder';
import NotificationCenter from '@/pages/notifications/NotificationCenter';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            {/* Student */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/attendance" element={<Attendance />} />
            <Route path="/student/exams" element={<Exams />} />
            <Route path="/student/fees" element={<Fees />} />
            <Route path="/student/leave" element={<LeaveRequest />} />

            {/* Faculty */}
            <Route path="/faculty" element={<FacultyDashboard />} />
            <Route path="/faculty/attendance" element={<AttendanceMarking />} />
            <Route path="/faculty/leaves" element={<LeaveApprovals />} />
            <Route path="/faculty/marks" element={<UploadMarks />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/faculty" element={<FacultyManagement />} />
            <Route path="/admin/placements" element={<PlacementOverview />} />

            {/* Parent */}
            <Route path="/parent" element={<ParentDashboard />} />

            {/* Exam */}
            <Route path="/exam" element={<ExamList />} />
            <Route path="/exam/results" element={<ExamResults />} />

            {/* AI Features */}
            <Route path="/ai/placement" element={<PlacementReadiness />} />
            <Route path="/ai/resume" element={<ResumeBuilder />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationCenter />} />
          </Route>

          {/* Exam taking — outside dashboard layout (fullscreen) */}
          <Route path="/exam/take" element={<ExamTaking />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
