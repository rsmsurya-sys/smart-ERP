import { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import {
  type Role, type LeaveRequest, type LeaveStatus,
  students, faculty, parents, leaveRequests as initialLeaves,
  notifications as initialNotifications, type Notification,
} from '@/data/mockData';

// ---------- State shape ----------

export interface AppState {
  currentRole: Role;
  currentUserId: string;
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  attendanceRecords: Record<string, Record<string, boolean>>; // classKey -> { studentId: present }
  examSubmissions: Record<string, { answers: Record<number, string | number>; score?: number; submitted: boolean }>;
}

// ---------- Actions ----------

type Action =
  | { type: 'SWITCH_ROLE'; role: Role }
  | { type: 'UPDATE_LEAVE_STATUS'; leaveId: string; status: LeaveStatus; approvedBy?: string }
  | { type: 'ADD_LEAVE_REQUEST'; leave: LeaveRequest }
  | { type: 'MARK_ATTENDANCE'; classKey: string; studentId: string; present: boolean }
  | { type: 'MARK_ALL_ATTENDANCE'; classKey: string; studentIds: string[]; present: boolean }
  | { type: 'MARK_NOTIFICATION_READ'; notificationId: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'SUBMIT_EXAM'; examId: string; answers: Record<number, string | number>; score: number }
  | { type: 'LOAD_STATE'; state: AppState };

// ---------- Default user per role ----------

function getDefaultUserId(role: Role): string {
  switch (role) {
    case 'student': return 'STU001';
    case 'faculty': return 'FAC001';
    case 'admin': return 'ADMIN';
    case 'parent': return 'PAR001';
  }
}

// ---------- Initial state ----------

const initialState: AppState = {
  currentRole: 'student',
  currentUserId: 'STU001',
  leaveRequests: [...initialLeaves],
  notifications: [...initialNotifications],
  attendanceRecords: {},
  examSubmissions: {},
};

// ---------- Reducer ----------

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SWITCH_ROLE':
      return { ...state, currentRole: action.role, currentUserId: getDefaultUserId(action.role) };

    case 'UPDATE_LEAVE_STATUS':
      return {
        ...state,
        leaveRequests: state.leaveRequests.map(lr =>
          lr.id === action.leaveId
            ? { ...lr, status: action.status, approvedBy: action.approvedBy }
            : lr
        ),
      };

    case 'ADD_LEAVE_REQUEST':
      return { ...state, leaveRequests: [action.leave, ...state.leaveRequests] };

    case 'MARK_ATTENDANCE': {
      const classRecords = state.attendanceRecords[action.classKey] || {};
      return {
        ...state,
        attendanceRecords: {
          ...state.attendanceRecords,
          [action.classKey]: { ...classRecords, [action.studentId]: action.present },
        },
      };
    }

    case 'MARK_ALL_ATTENDANCE': {
      const newRecords: Record<string, boolean> = {};
      action.studentIds.forEach(id => { newRecords[id] = action.present; });
      return {
        ...state,
        attendanceRecords: {
          ...state.attendanceRecords,
          [action.classKey]: newRecords,
        },
      };
    }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.notificationId ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      };

    case 'SUBMIT_EXAM':
      return {
        ...state,
        examSubmissions: {
          ...state.examSubmissions,
          [action.examId]: { answers: action.answers, score: action.score, submitted: true },
        },
      };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

// ---------- Context ----------

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  currentStudent: typeof students[0] | undefined;
  currentFaculty: typeof faculty[0] | undefined;
  currentParent: typeof parents[0] | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

// ---------- Provider ----------

const STORAGE_KEY = 'erp-prototype-state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch { /* ignore */ }
    return init;
  });

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentStudent = students.find(s => s.id === state.currentUserId);
  const currentFaculty = faculty.find(f => f.id === state.currentUserId);
  const currentParent = parents.find(p => p.id === state.currentUserId);

  return (
    <AppContext.Provider value={{ state, dispatch, currentStudent, currentFaculty, currentParent }}>
      {children}
    </AppContext.Provider>
  );
}

// ---------- Hook ----------

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
