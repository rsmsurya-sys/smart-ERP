// ============================================================
// MOCK DATA — Smart College ERP Prototype
// ============================================================

// ---------- Types ----------

export type Role = 'student' | 'faculty' | 'admin' | 'parent';
export type Department = 'CSE' | 'AI&DS' | 'ECE';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type FeeStatus = 'paid' | 'pending' | 'partial';
export type NotificationChannel = 'sms' | 'whatsapp' | 'email' | 'push' | 'in-app';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  department: Department;
  year: number;
  section: string;
  email: string;
  phone: string;
  photo: string;
  overallAttendance: number;
  cgpa: number;
  semesterGPA: number[];
  feeStatus: FeeStatus;
  placementScore: number;
  isAtRisk: boolean;
  parentId: string;
  skills: string[];
}

export interface SubjectAttendance {
  studentId: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attended: number;
  percentage: number;
}

export interface Faculty {
  id: string;
  name: string;
  department: Department;
  designation: string;
  email: string;
  phone: string;
  photo: string;
  subjects: string[];
  weeklyHours: number;
}

export interface TimetableSlot {
  day: string;
  period: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  faculty: string;
  room: string;
  department: Department;
  year: number;
  section: string;
}

export interface Exam {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'internal' | 'semester' | 'quiz';
  department: Department;
  year: number;
  totalMarks: number;
  syllabus: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: Department;
  fromDate: string;
  toDate: string;
  reason: string;
  type: 'medical' | 'personal' | 'od' | 'emergency';
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
}

export interface FeeRecord {
  studentId: string;
  semester: number;
  tuitionFee: number;
  hostelFee: number;
  libraryFee: number;
  labFee: number;
  totalFee: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
}

export interface MarksRecord {
  studentId: string;
  subjectCode: string;
  subjectName: string;
  internal1: number;
  internal2: number;
  internal3: number;
  assignment: number;
  semester?: number;
  grade?: string;
}

export interface Notification {
  id: string;
  channel: NotificationChannel;
  title: string;
  titleTamil?: string;
  message: string;
  messageTamil?: string;
  timestamp: string;
  read: boolean;
  targetRole: Role | 'all';
  category: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  type: 'mcq' | 'descriptive';
  options?: string[];
  correctAnswer?: number; // index for MCQ
  marks: number;
}

export interface ParentRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  childIds: string[];
}

// ---------- Students ----------

export const students: Student[] = [
  {
    id: 'STU001', name: 'Arun Kumar R', rollNo: '21CS101', department: 'CSE',
    year: 3, section: 'A', email: 'arun.kumar@college.edu', phone: '9876543210',
    photo: '', overallAttendance: 92, cgpa: 8.6, semesterGPA: [8.2, 8.4, 8.8, 9.0, 8.6, 8.5],
    feeStatus: 'paid', placementScore: 82, isAtRisk: false, parentId: 'PAR001',
    skills: ['Python', 'Java', 'Machine Learning', 'SQL', 'React'],
  },
  {
    id: 'STU002', name: 'Priya Lakshmi S', rollNo: '21CS102', department: 'CSE',
    year: 3, section: 'A', email: 'priya.lakshmi@college.edu', phone: '9876543211',
    photo: '', overallAttendance: 88, cgpa: 9.1, semesterGPA: [8.8, 9.0, 9.2, 9.3, 9.1, 9.2],
    feeStatus: 'paid', placementScore: 91, isAtRisk: false, parentId: 'PAR002',
    skills: ['Python', 'Deep Learning', 'NLP', 'TensorFlow', 'SQL'],
  },
  {
    id: 'STU003', name: 'Karthik Vel M', rollNo: '21CS103', department: 'CSE',
    year: 3, section: 'A', email: 'karthik.vel@college.edu', phone: '9876543212',
    photo: '', overallAttendance: 67, cgpa: 6.2, semesterGPA: [6.0, 6.4, 6.5, 6.1, 6.0, 6.2],
    feeStatus: 'pending', placementScore: 38, isAtRisk: true, parentId: 'PAR003',
    skills: ['C', 'Java'],
  },
  {
    id: 'STU004', name: 'Deepika Nair', rollNo: '21CS104', department: 'CSE',
    year: 3, section: 'B', email: 'deepika.nair@college.edu', phone: '9876543213',
    photo: '', overallAttendance: 85, cgpa: 8.0, semesterGPA: [7.8, 8.0, 8.2, 8.1, 7.9, 8.0],
    feeStatus: 'paid', placementScore: 72, isAtRisk: false, parentId: 'PAR004',
    skills: ['Python', 'Web Development', 'JavaScript', 'React', 'Node.js'],
  },
  {
    id: 'STU005', name: 'Vijay Anand T', rollNo: '21CS105', department: 'CSE',
    year: 3, section: 'B', email: 'vijay.anand@college.edu', phone: '9876543214',
    photo: '', overallAttendance: 71, cgpa: 6.8, semesterGPA: [7.0, 6.8, 6.6, 6.9, 7.0, 6.8],
    feeStatus: 'partial', placementScore: 45, isAtRisk: true, parentId: 'PAR005',
    skills: ['C++', 'Data Structures'],
  },
  {
    id: 'STU006', name: 'Sowmya Devi K', rollNo: '21AI101', department: 'AI&DS',
    year: 3, section: 'A', email: 'sowmya.devi@college.edu', phone: '9876543215',
    photo: '', overallAttendance: 94, cgpa: 9.3, semesterGPA: [9.0, 9.2, 9.4, 9.5, 9.3, 9.4],
    feeStatus: 'paid', placementScore: 95, isAtRisk: false, parentId: 'PAR006',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP', 'SQL'],
  },
  {
    id: 'STU007', name: 'Manoj Prabakar R', rollNo: '21AI102', department: 'AI&DS',
    year: 3, section: 'A', email: 'manoj.prabakar@college.edu', phone: '9876543216',
    photo: '', overallAttendance: 81, cgpa: 7.8, semesterGPA: [7.4, 7.6, 7.8, 8.0, 7.9, 7.8],
    feeStatus: 'paid', placementScore: 68, isAtRisk: false, parentId: 'PAR007',
    skills: ['Python', 'R', 'Machine Learning', 'Statistics'],
  },
  {
    id: 'STU008', name: 'Kavitha Selvi P', rollNo: '21AI103', department: 'AI&DS',
    year: 3, section: 'A', email: 'kavitha.selvi@college.edu', phone: '9876543217',
    photo: '', overallAttendance: 89, cgpa: 8.4, semesterGPA: [8.0, 8.2, 8.5, 8.6, 8.4, 8.5],
    feeStatus: 'paid', placementScore: 78, isAtRisk: false, parentId: 'PAR008',
    skills: ['Python', 'Data Analysis', 'Tableau', 'SQL', 'Machine Learning'],
  },
  {
    id: 'STU009', name: 'Rajan Sundaram V', rollNo: '21AI104', department: 'AI&DS',
    year: 3, section: 'A', email: 'rajan.sundaram@college.edu', phone: '9876543218',
    photo: '', overallAttendance: 76, cgpa: 7.2, semesterGPA: [7.0, 7.2, 7.4, 7.3, 7.1, 7.2],
    feeStatus: 'partial', placementScore: 55, isAtRisk: false, parentId: 'PAR009',
    skills: ['Python', 'Java', 'SQL'],
  },
  {
    id: 'STU010', name: 'Nandhini Sri B', rollNo: '21AI105', department: 'AI&DS',
    year: 3, section: 'A', email: 'nandhini.sri@college.edu', phone: '9876543219',
    photo: '', overallAttendance: 62, cgpa: 5.8, semesterGPA: [6.0, 5.8, 5.6, 5.9, 5.7, 5.8],
    feeStatus: 'pending', placementScore: 30, isAtRisk: true, parentId: 'PAR010',
    skills: ['Python'],
  },
  {
    id: 'STU011', name: 'Ashwin Raj G', rollNo: '21EC101', department: 'ECE',
    year: 3, section: 'A', email: 'ashwin.raj@college.edu', phone: '9876543220',
    photo: '', overallAttendance: 90, cgpa: 8.2, semesterGPA: [8.0, 8.2, 8.4, 8.3, 8.1, 8.2],
    feeStatus: 'paid', placementScore: 76, isAtRisk: false, parentId: 'PAR011',
    skills: ['VLSI', 'Embedded Systems', 'C', 'MATLAB', 'IoT'],
  },
  {
    id: 'STU012', name: 'Meena Kumari L', rollNo: '21EC102', department: 'ECE',
    year: 3, section: 'A', email: 'meena.kumari@college.edu', phone: '9876543221',
    photo: '', overallAttendance: 86, cgpa: 7.9, semesterGPA: [7.6, 7.8, 8.0, 8.1, 7.9, 7.8],
    feeStatus: 'paid', placementScore: 70, isAtRisk: false, parentId: 'PAR012',
    skills: ['Signal Processing', 'MATLAB', 'C', 'Embedded Systems'],
  },
  {
    id: 'STU013', name: 'Suresh Babu D', rollNo: '21EC103', department: 'ECE',
    year: 3, section: 'A', email: 'suresh.babu@college.edu', phone: '9876543222',
    photo: '', overallAttendance: 83, cgpa: 7.5, semesterGPA: [7.2, 7.4, 7.6, 7.8, 7.5, 7.5],
    feeStatus: 'paid', placementScore: 64, isAtRisk: false, parentId: 'PAR013',
    skills: ['VLSI', 'C', 'Digital Electronics'],
  },
  {
    id: 'STU014', name: 'Divya Bharathi A', rollNo: '21EC104', department: 'ECE',
    year: 3, section: 'A', email: 'divya.bharathi@college.edu', phone: '9876543223',
    photo: '', overallAttendance: 91, cgpa: 8.8, semesterGPA: [8.4, 8.6, 8.8, 9.0, 8.9, 8.8],
    feeStatus: 'paid', placementScore: 85, isAtRisk: false, parentId: 'PAR014',
    skills: ['IoT', 'Embedded Systems', 'Python', 'C', 'PCB Design'],
  },
  {
    id: 'STU015', name: 'Gopalakrishnan S', rollNo: '21EC105', department: 'ECE',
    year: 3, section: 'A', email: 'gopalakrishnan@college.edu', phone: '9876543224',
    photo: '', overallAttendance: 78, cgpa: 7.0, semesterGPA: [6.8, 7.0, 7.2, 7.1, 6.9, 7.0],
    feeStatus: 'partial', placementScore: 52, isAtRisk: false, parentId: 'PAR015',
    skills: ['C', 'MATLAB', 'Communication Systems'],
  },
];

// ---------- Subject Attendance ----------

export const subjectAttendance: SubjectAttendance[] = [
  // STU001 — Arun Kumar (CSE, 92% overall)
  { studentId: 'STU001', subjectCode: 'CS301', subjectName: 'Database Management Systems', totalClasses: 45, attended: 42, percentage: 93 },
  { studentId: 'STU001', subjectCode: 'CS302', subjectName: 'Operating Systems', totalClasses: 42, attended: 38, percentage: 90 },
  { studentId: 'STU001', subjectCode: 'CS303', subjectName: 'Computer Networks', totalClasses: 40, attended: 37, percentage: 93 },
  { studentId: 'STU001', subjectCode: 'CS304', subjectName: 'Software Engineering', totalClasses: 38, attended: 35, percentage: 92 },
  { studentId: 'STU001', subjectCode: 'CS305', subjectName: 'Web Technologies', totalClasses: 36, attended: 33, percentage: 92 },
  // STU003 — Karthik (CSE, 67% at-risk)
  { studentId: 'STU003', subjectCode: 'CS301', subjectName: 'Database Management Systems', totalClasses: 45, attended: 28, percentage: 62 },
  { studentId: 'STU003', subjectCode: 'CS302', subjectName: 'Operating Systems', totalClasses: 42, attended: 30, percentage: 71 },
  { studentId: 'STU003', subjectCode: 'CS303', subjectName: 'Computer Networks', totalClasses: 40, attended: 27, percentage: 68 },
  { studentId: 'STU003', subjectCode: 'CS304', subjectName: 'Software Engineering', totalClasses: 38, attended: 26, percentage: 68 },
  { studentId: 'STU003', subjectCode: 'CS305', subjectName: 'Web Technologies', totalClasses: 36, attended: 23, percentage: 64 },
  // STU006 — Sowmya (AI&DS, 94%)
  { studentId: 'STU006', subjectCode: 'AI301', subjectName: 'Machine Learning', totalClasses: 44, attended: 42, percentage: 95 },
  { studentId: 'STU006', subjectCode: 'AI302', subjectName: 'Deep Learning', totalClasses: 40, attended: 38, percentage: 95 },
  { studentId: 'STU006', subjectCode: 'AI303', subjectName: 'Natural Language Processing', totalClasses: 38, attended: 35, percentage: 92 },
  { studentId: 'STU006', subjectCode: 'AI304', subjectName: 'Data Visualization', totalClasses: 36, attended: 34, percentage: 94 },
  { studentId: 'STU006', subjectCode: 'CS301', subjectName: 'Database Management Systems', totalClasses: 42, attended: 40, percentage: 95 },
  // STU010 — Nandhini (AI&DS, 62% at-risk)
  { studentId: 'STU010', subjectCode: 'AI301', subjectName: 'Machine Learning', totalClasses: 44, attended: 26, percentage: 59 },
  { studentId: 'STU010', subjectCode: 'AI302', subjectName: 'Deep Learning', totalClasses: 40, attended: 25, percentage: 63 },
  { studentId: 'STU010', subjectCode: 'AI303', subjectName: 'Natural Language Processing', totalClasses: 38, attended: 24, percentage: 63 },
  { studentId: 'STU010', subjectCode: 'AI304', subjectName: 'Data Visualization', totalClasses: 36, attended: 22, percentage: 61 },
  { studentId: 'STU010', subjectCode: 'CS301', subjectName: 'Database Management Systems', totalClasses: 42, attended: 27, percentage: 64 },
  // STU005 — Vijay (CSE, 71% at-risk)
  { studentId: 'STU005', subjectCode: 'CS301', subjectName: 'Database Management Systems', totalClasses: 45, attended: 31, percentage: 69 },
  { studentId: 'STU005', subjectCode: 'CS302', subjectName: 'Operating Systems', totalClasses: 42, attended: 30, percentage: 71 },
  { studentId: 'STU005', subjectCode: 'CS303', subjectName: 'Computer Networks', totalClasses: 40, attended: 29, percentage: 73 },
  { studentId: 'STU005', subjectCode: 'CS304', subjectName: 'Software Engineering', totalClasses: 38, attended: 27, percentage: 71 },
  { studentId: 'STU005', subjectCode: 'CS305', subjectName: 'Web Technologies', totalClasses: 36, attended: 26, percentage: 72 },
];

// ---------- Faculty ----------

export const faculty: Faculty[] = [
  {
    id: 'FAC001', name: 'Dr. Ramasamy Pillai', department: 'CSE',
    designation: 'Professor & HOD', email: 'ramasamy.pillai@college.edu',
    phone: '9870001001', photo: '',
    subjects: ['CS301 - Database Management Systems', 'CS304 - Software Engineering'],
    weeklyHours: 16,
  },
  {
    id: 'FAC002', name: 'Dr. Sangeetha Devi M', department: 'CSE',
    designation: 'Associate Professor', email: 'sangeetha.devi@college.edu',
    phone: '9870001002', photo: '',
    subjects: ['CS302 - Operating Systems', 'CS303 - Computer Networks'],
    weeklyHours: 18,
  },
  {
    id: 'FAC003', name: 'Prof. Lakshmi Narayanan K', department: 'AI&DS',
    designation: 'Professor & HOD', email: 'lakshmi.narayanan@college.edu',
    phone: '9870001003', photo: '',
    subjects: ['AI301 - Machine Learning', 'AI303 - Natural Language Processing'],
    weeklyHours: 14,
  },
  {
    id: 'FAC004', name: 'Dr. Bharathi Kannan S', department: 'AI&DS',
    designation: 'Assistant Professor', email: 'bharathi.kannan@college.edu',
    phone: '9870001004', photo: '',
    subjects: ['AI302 - Deep Learning', 'AI304 - Data Visualization'],
    weeklyHours: 20,
  },
  {
    id: 'FAC005', name: 'Dr. Venkatesan Iyer R', department: 'ECE',
    designation: 'Professor & HOD', email: 'venkatesan.iyer@college.edu',
    phone: '9870001005', photo: '',
    subjects: ['EC301 - VLSI Design', 'EC302 - Embedded Systems'],
    weeklyHours: 15,
  },
];

// ---------- Timetable ----------

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const periods = [
  { period: 1, time: '09:00 – 09:50' },
  { period: 2, time: '09:50 – 10:40' },
  { period: 3, time: '10:50 – 11:40' },
  { period: 4, time: '11:40 – 12:30' },
  { period: 5, time: '13:30 – 14:20' },
  { period: 6, time: '14:20 – 15:10' },
  { period: 7, time: '15:20 – 16:10' },
  { period: 8, time: '16:10 – 17:00' },
];

function buildTimetable(): TimetableSlot[] {
  const slots: TimetableSlot[] = [];

  // CSE A - Year 3
  const cseSubjects = [
    { code: 'CS301', name: 'Database Management Systems', faculty: 'Dr. Ramasamy Pillai', room: 'CSE-301' },
    { code: 'CS302', name: 'Operating Systems', faculty: 'Dr. Sangeetha Devi M', room: 'CSE-302' },
    { code: 'CS303', name: 'Computer Networks', faculty: 'Dr. Sangeetha Devi M', room: 'CSE-303' },
    { code: 'CS304', name: 'Software Engineering', faculty: 'Dr. Ramasamy Pillai', room: 'CSE-304' },
    { code: 'CS305', name: 'Web Technologies', faculty: 'Dr. Sangeetha Devi M', room: 'Lab-1' },
  ];
  const csePattern = [
    [0, 1, 2, 3, null, 0, 1, null], // Monday
    [2, 3, 0, 1, 4, 4, null, null], // Tuesday
    [1, 0, 3, 2, null, 1, 0, null], // Wednesday
    [3, 2, 1, 0, 4, 4, null, null], // Thursday
    [0, 1, 2, 3, null, 2, 3, null], // Friday
    [1, 0, null, null, null, null, null, null], // Saturday
  ];
  csePattern.forEach((daySlots, dayIdx) => {
    daySlots.forEach((subIdx, periodIdx) => {
      if (subIdx !== null) {
        const sub = cseSubjects[subIdx];
        slots.push({
          day: days[dayIdx], period: periods[periodIdx].period, time: periods[periodIdx].time,
          subjectCode: sub.code, subjectName: sub.name, faculty: sub.faculty, room: sub.room,
          department: 'CSE', year: 3, section: 'A',
        });
      }
    });
  });

  // AI&DS A - Year 3
  const aiSubjects = [
    { code: 'AI301', name: 'Machine Learning', faculty: 'Prof. Lakshmi Narayanan K', room: 'AI-201' },
    { code: 'AI302', name: 'Deep Learning', faculty: 'Dr. Bharathi Kannan S', room: 'AI-202' },
    { code: 'AI303', name: 'Natural Language Processing', faculty: 'Prof. Lakshmi Narayanan K', room: 'AI-203' },
    { code: 'AI304', name: 'Data Visualization', faculty: 'Dr. Bharathi Kannan S', room: 'Lab-2' },
    { code: 'CS301', name: 'Database Management Systems', faculty: 'Dr. Ramasamy Pillai', room: 'CSE-301' },
  ];
  const aiPattern = [
    [0, 1, 4, 2, null, 3, 3, null],
    [1, 0, 2, 4, 3, 3, null, null],
    [2, 4, 0, 1, null, 0, 2, null],
    [4, 2, 1, 0, 3, 3, null, null],
    [0, 1, 4, 2, null, 1, 0, null],
    [2, 4, null, null, null, null, null, null],
  ];
  aiPattern.forEach((daySlots, dayIdx) => {
    daySlots.forEach((subIdx, periodIdx) => {
      if (subIdx !== null) {
        const sub = aiSubjects[subIdx];
        slots.push({
          day: days[dayIdx], period: periods[periodIdx].period, time: periods[periodIdx].time,
          subjectCode: sub.code, subjectName: sub.name, faculty: sub.faculty, room: sub.room,
          department: 'AI&DS', year: 3, section: 'A',
        });
      }
    });
  });

  return slots;
}

export const timetable: TimetableSlot[] = buildTimetable();

// ---------- Exams ----------

export const exams: Exam[] = [
  { id: 'EX001', subjectCode: 'CS301', subjectName: 'Database Management Systems', date: '2026-10-15', time: '10:00 AM', duration: 90, type: 'internal', department: 'CSE', year: 3, totalMarks: 50, syllabus: 'Units 1–3: ER Models, Normalization, SQL' },
  { id: 'EX002', subjectCode: 'CS302', subjectName: 'Operating Systems', date: '2026-10-17', time: '10:00 AM', duration: 90, type: 'internal', department: 'CSE', year: 3, totalMarks: 50, syllabus: 'Units 1–3: Process Management, Scheduling, Memory' },
  { id: 'EX003', subjectCode: 'AI301', subjectName: 'Machine Learning', date: '2026-10-16', time: '10:00 AM', duration: 90, type: 'internal', department: 'AI&DS', year: 3, totalMarks: 50, syllabus: 'Units 1–3: Regression, Classification, Clustering' },
  { id: 'EX004', subjectCode: 'AI302', subjectName: 'Deep Learning', date: '2026-10-18', time: '02:00 PM', duration: 90, type: 'internal', department: 'AI&DS', year: 3, totalMarks: 50, syllabus: 'Units 1–3: CNNs, RNNs, Autoencoders' },
  { id: 'EX005', subjectCode: 'CS303', subjectName: 'Computer Networks', date: '2026-10-20', time: '10:00 AM', duration: 120, type: 'internal', department: 'CSE', year: 3, totalMarks: 50, syllabus: 'Units 1–3: OSI Model, TCP/IP, Routing' },
  { id: 'EX006', subjectCode: 'CS301', subjectName: 'Database Management Systems', date: '2026-12-10', time: '09:30 AM', duration: 180, type: 'semester', department: 'CSE', year: 3, totalMarks: 100, syllabus: 'All Units' },
  { id: 'EX007', subjectCode: 'AI301', subjectName: 'Machine Learning', date: '2026-12-12', time: '09:30 AM', duration: 180, type: 'semester', department: 'AI&DS', year: 3, totalMarks: 100, syllabus: 'All Units' },
];

// ---------- Leave Requests ----------

export const leaveRequests: LeaveRequest[] = [
  { id: 'LR001', studentId: 'STU001', studentName: 'Arun Kumar R', rollNo: '21CS101', department: 'CSE', fromDate: '2026-09-25', toDate: '2026-09-26', reason: 'Family function — sister\'s wedding', type: 'personal', status: 'pending', appliedOn: '2026-09-20' },
  { id: 'LR002', studentId: 'STU003', studentName: 'Karthik Vel M', rollNo: '21CS103', department: 'CSE', fromDate: '2026-09-22', toDate: '2026-09-24', reason: 'Fever and body pain, doctor advised rest', type: 'medical', status: 'approved', appliedOn: '2026-09-21', approvedBy: 'Dr. Ramasamy Pillai' },
  { id: 'LR003', studentId: 'STU006', studentName: 'Sowmya Devi K', rollNo: '21AI101', department: 'AI&DS', fromDate: '2026-09-28', toDate: '2026-09-28', reason: 'Participating in Smart India Hackathon', type: 'od', status: 'pending', appliedOn: '2026-09-22' },
  { id: 'LR004', studentId: 'STU010', studentName: 'Nandhini Sri B', rollNo: '21AI105', department: 'AI&DS', fromDate: '2026-09-18', toDate: '2026-09-20', reason: 'Personal emergency at home', type: 'emergency', status: 'approved', appliedOn: '2026-09-17', approvedBy: 'Prof. Lakshmi Narayanan K' },
  { id: 'LR005', studentId: 'STU005', studentName: 'Vijay Anand T', rollNo: '21CS105', department: 'CSE', fromDate: '2026-09-29', toDate: '2026-09-30', reason: 'Attending brother\'s college admission', type: 'personal', status: 'pending', appliedOn: '2026-09-23' },
  { id: 'LR006', studentId: 'STU011', studentName: 'Ashwin Raj G', rollNo: '21EC101', department: 'ECE', fromDate: '2026-09-24', toDate: '2026-09-24', reason: 'Medical checkup scheduled', type: 'medical', status: 'rejected', appliedOn: '2026-09-22', approvedBy: 'Dr. Venkatesan Iyer R' },
];

// ---------- Fee Records ----------

export const feeRecords: FeeRecord[] = [
  { studentId: 'STU001', semester: 5, tuitionFee: 75000, hostelFee: 35000, libraryFee: 2000, labFee: 5000, totalFee: 117000, paidAmount: 117000, dueDate: '2026-07-15', paidDate: '2026-07-10', status: 'paid' },
  { studentId: 'STU002', semester: 5, tuitionFee: 75000, hostelFee: 0, libraryFee: 2000, labFee: 5000, totalFee: 82000, paidAmount: 82000, dueDate: '2026-07-15', paidDate: '2026-07-12', status: 'paid' },
  { studentId: 'STU003', semester: 5, tuitionFee: 75000, hostelFee: 35000, libraryFee: 2000, labFee: 5000, totalFee: 117000, paidAmount: 0, dueDate: '2026-07-15', status: 'pending' },
  { studentId: 'STU004', semester: 5, tuitionFee: 75000, hostelFee: 0, libraryFee: 2000, labFee: 5000, totalFee: 82000, paidAmount: 82000, dueDate: '2026-07-15', paidDate: '2026-07-14', status: 'paid' },
  { studentId: 'STU005', semester: 5, tuitionFee: 75000, hostelFee: 35000, libraryFee: 2000, labFee: 5000, totalFee: 117000, paidAmount: 75000, dueDate: '2026-07-15', paidDate: '2026-07-15', status: 'partial' },
  { studentId: 'STU006', semester: 5, tuitionFee: 75000, hostelFee: 0, libraryFee: 2000, labFee: 5000, totalFee: 82000, paidAmount: 82000, dueDate: '2026-07-15', paidDate: '2026-07-08', status: 'paid' },
  { studentId: 'STU010', semester: 5, tuitionFee: 75000, hostelFee: 35000, libraryFee: 2000, labFee: 5000, totalFee: 117000, paidAmount: 0, dueDate: '2026-07-15', status: 'pending' },
];

// ---------- Marks ----------

export const marksRecords: MarksRecord[] = [
  { studentId: 'STU001', subjectCode: 'CS301', subjectName: 'Database Management Systems', internal1: 42, internal2: 44, internal3: 45, assignment: 18, grade: 'A' },
  { studentId: 'STU001', subjectCode: 'CS302', subjectName: 'Operating Systems', internal1: 38, internal2: 40, internal3: 42, assignment: 17, grade: 'A' },
  { studentId: 'STU001', subjectCode: 'CS303', subjectName: 'Computer Networks', internal1: 40, internal2: 43, internal3: 41, assignment: 19, grade: 'A' },
  { studentId: 'STU003', subjectCode: 'CS301', subjectName: 'Database Management Systems', internal1: 25, internal2: 28, internal3: 22, assignment: 12, grade: 'C' },
  { studentId: 'STU003', subjectCode: 'CS302', subjectName: 'Operating Systems', internal1: 28, internal2: 30, internal3: 26, assignment: 13, grade: 'C' },
  { studentId: 'STU006', subjectCode: 'AI301', subjectName: 'Machine Learning', internal1: 46, internal2: 48, internal3: 47, assignment: 20, grade: 'O' },
  { studentId: 'STU006', subjectCode: 'AI302', subjectName: 'Deep Learning', internal1: 44, internal2: 46, internal3: 45, assignment: 19, grade: 'A+' },
  { studentId: 'STU010', subjectCode: 'AI301', subjectName: 'Machine Learning', internal1: 18, internal2: 22, internal3: 20, assignment: 10, grade: 'D' },
  { studentId: 'STU010', subjectCode: 'AI302', subjectName: 'Deep Learning', internal1: 20, internal2: 24, internal3: 21, assignment: 11, grade: 'D' },
];

// ---------- Notifications ----------

export const notifications: Notification[] = [
  { id: 'N000', channel: 'push', title: '🎒 AI Tomorrow Prep: 6 Periods Scheduled', titleTamil: '🎒 AI நினைவூட்டல்: நாளை 6 வகுப்புகள் உள்ளன', message: 'Tomorrow includes Web Technologies Lab in Lab-1. Don\'t forget your White Lab Apron, Record Note, and Calculator!', messageTamil: 'நாளை Lab-1-ல் வெப் டெக்னாலஜிஸ் செய்முறை வகுப்பு உள்ளது. வெள்ளை ஆய்வக ஆடை, ரெக்கார்டு நோட்டு கொண்டுவர மறக்காதீர்கள்!', timestamp: '2026-09-23T15:00:00', read: false, targetRole: 'student', category: 'timetable' },
  { id: 'N001', channel: 'in-app', title: 'Internal Exam Schedule Released', titleTamil: 'அக உள்வாரி தேர்வு அட்டவணை வெளியிடப்பட்டது', message: 'Internal Assessment 2 exams are scheduled from Oct 15–20, 2026. Check your exam schedule for details.', messageTamil: 'இரண்டாவது அக உள்வாரி தேர்வுகள் அக்டோபர் 15–20, 2026 தேதிகளில் திட்டமிடப்பட்டுள்ளன. விவரங்களுக்கு தேர்வு அட்டவணையைப் பாருங்கள்.', timestamp: '2026-09-23T09:00:00', read: false, targetRole: 'all', category: 'exam' },
  { id: 'N002', channel: 'email', title: 'Fee Payment Reminder', titleTamil: 'கட்டணம் செலுத்துவதற்கான நினைவூட்டல்', message: 'Semester 5 fee payment is overdue. Please clear your dues by Sep 30 to avoid late fee penalty of ₹500.', messageTamil: 'செமஸ்டர் 5 கட்டணம் தாமதமாகியுள்ளது. ₹500 அபராதம் தவிர்க்க செப்டம்பர் 30க்கு முன் செலுத்தவும்.', timestamp: '2026-09-22T14:30:00', read: false, targetRole: 'student', category: 'fee' },
  { id: 'N003', channel: 'sms', title: 'Attendance Warning', message: 'Your ward Karthik Vel M (21CS103) has attendance below 70% in Database Management Systems. Please ensure regular attendance.', timestamp: '2026-09-22T10:00:00', read: true, targetRole: 'parent', category: 'attendance' },
  { id: 'N004', channel: 'whatsapp', title: 'Assignment Submission Due', message: 'Machine Learning assignment on "Gradient Descent Optimization" is due on Sep 27. Submit via the college portal.', timestamp: '2026-09-21T16:00:00', read: false, targetRole: 'student', category: 'assignment' },
  { id: 'N005', channel: 'push', title: 'Leave Request Approved', message: 'Your leave request for Sep 22–24 has been approved by Prof. Lakshmi Narayanan K.', timestamp: '2026-09-21T11:30:00', read: true, targetRole: 'student', category: 'leave' },
  { id: 'N006', channel: 'in-app', title: 'Faculty Meeting Scheduled', message: 'Department-level faculty meeting on Sep 26 at 3:00 PM in Conference Hall B. Agenda: Mid-semester review and placement preparation.', timestamp: '2026-09-20T09:00:00', read: false, targetRole: 'faculty', category: 'meeting' },
  { id: 'N007', channel: 'email', title: 'Placement Drive Announcement', message: 'TCS and Infosys campus placement drive scheduled for Nov 15–16. Eligible criteria: CGPA ≥ 7.0, no active backlogs. Register on the placement portal.', timestamp: '2026-09-19T13:00:00', read: true, targetRole: 'student', category: 'placement' },
  { id: 'N008', channel: 'in-app', title: 'Library Book Return Reminder', message: 'You have 2 overdue library books. Please return them by Sep 25 to avoid fine.', timestamp: '2026-09-18T10:00:00', read: true, targetRole: 'student', category: 'library' },
  { id: 'N009', channel: 'whatsapp', title: 'Parent-Teacher Meeting', titleTamil: 'பெற்றோர்-ஆசிரியர் சந்திப்பு', message: 'Parent-Teacher meeting for AI&DS department is scheduled on Oct 5, 2026. Time: 10 AM to 1 PM. Venue: Seminar Hall A.', messageTamil: 'AI&DS துறை பெற்றோர்-ஆசிரியர் சந்திப்பு அக்டோபர் 5, 2026 அன்று நடைபெறும். நேரம்: காலை 10 மணி முதல் மதியம் 1 மணி வரை. இடம்: கருத்தரங்கு அரங்கு A.', timestamp: '2026-09-17T15:00:00', read: false, targetRole: 'parent', category: 'meeting' },
  { id: 'N010', channel: 'sms', title: 'Hostel Fee Due', message: 'Hostel fee of ₹35,000 for Semester 5 is pending. Last date: Sep 30, 2026.', timestamp: '2026-09-16T09:00:00', read: true, targetRole: 'student', category: 'fee' },
];

// ---------- Exam Questions (MCQ bank for exam module) ----------

export const examQuestions: ExamQuestion[] = [
  { id: 1, question: 'Which normal form eliminates transitive dependencies?', type: 'mcq', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 2, marks: 2 },
  { id: 2, question: 'What is the primary function of the WHERE clause in SQL?', type: 'mcq', options: ['Sorting results', 'Filtering rows', 'Grouping data', 'Joining tables'], correctAnswer: 1, marks: 2 },
  { id: 3, question: 'Which scheduling algorithm may cause starvation?', type: 'mcq', options: ['Round Robin', 'SJF (Non-preemptive)', 'FCFS', 'Lottery Scheduling'], correctAnswer: 1, marks: 2 },
  { id: 4, question: 'In TCP/IP, which layer is responsible for end-to-end communication?', type: 'mcq', options: ['Network Layer', 'Data Link Layer', 'Transport Layer', 'Application Layer'], correctAnswer: 2, marks: 2 },
  { id: 5, question: 'What does ACID stand for in database transactions?', type: 'mcq', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Concurrency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Dependency', 'Accuracy, Consistency, Isolation, Durability'], correctAnswer: 0, marks: 2 },
  { id: 6, question: 'Which data structure is used in BFS traversal?', type: 'mcq', options: ['Stack', 'Queue', 'Priority Queue', 'Linked List'], correctAnswer: 1, marks: 2 },
  { id: 7, question: 'What is the time complexity of binary search?', type: 'mcq', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 1, marks: 2 },
  { id: 8, question: 'Which activation function is commonly used in the output layer of a binary classifier?', type: 'mcq', options: ['ReLU', 'Tanh', 'Sigmoid', 'Softmax'], correctAnswer: 2, marks: 2 },
  { id: 9, question: 'Explain the concept of deadlock in operating systems and list the four necessary conditions for a deadlock to occur.', type: 'descriptive', marks: 10 },
  { id: 10, question: 'Describe the differences between supervised and unsupervised learning with suitable examples.', type: 'descriptive', marks: 10 },
];

// ---------- Parents ----------

export const parents: ParentRecord[] = [
  { id: 'PAR001', name: 'Kumar Rajan', phone: '9850001001', email: 'kumar.rajan@gmail.com', childIds: ['STU001'] },
  { id: 'PAR002', name: 'Lakshmi Subramaniam', phone: '9850001002', email: 'lakshmi.s@gmail.com', childIds: ['STU002'] },
  { id: 'PAR003', name: 'Vel Murugan', phone: '9850001003', email: 'vel.murugan@gmail.com', childIds: ['STU003'] },
  { id: 'PAR004', name: 'Rajesh Nair', phone: '9850001004', email: 'rajesh.nair@gmail.com', childIds: ['STU004'] },
  { id: 'PAR005', name: 'Anand Thangavel', phone: '9850001005', email: 'anand.t@gmail.com', childIds: ['STU005'] },
  { id: 'PAR006', name: 'Devi Kandasamy', phone: '9850001006', email: 'devi.k@gmail.com', childIds: ['STU006'] },
  { id: 'PAR007', name: 'Prabakar Ramasamy', phone: '9850001007', email: 'prabakar.r@gmail.com', childIds: ['STU007'] },
  { id: 'PAR008', name: 'Selvi Palanisamy', phone: '9850001008', email: 'selvi.p@gmail.com', childIds: ['STU008'] },
  { id: 'PAR009', name: 'Sundaram Velu', phone: '9850001009', email: 'sundaram.v@gmail.com', childIds: ['STU009'] },
  { id: 'PAR010', name: 'Balasubramanian K', phone: '9850001010', email: 'bala.k@gmail.com', childIds: ['STU010'] },
  { id: 'PAR011', name: 'Gopalan Raj', phone: '9850001011', email: 'gopalan.r@gmail.com', childIds: ['STU011'] },
  { id: 'PAR012', name: 'Lakshmanan R', phone: '9850001012', email: 'lakshmanan.r@gmail.com', childIds: ['STU012'] },
  { id: 'PAR013', name: 'Babu Dharmaraj', phone: '9850001013', email: 'babu.d@gmail.com', childIds: ['STU013'] },
  { id: 'PAR014', name: 'Anbu Selvan A', phone: '9850001014', email: 'anbu.a@gmail.com', childIds: ['STU014'] },
  { id: 'PAR015', name: 'Shanmugam S', phone: '9850001015', email: 'shanmugam.s@gmail.com', childIds: ['STU015'] },
];

// ---------- Helpers ----------

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getStudentsByDepartment(dept: Department): Student[] {
  return students.filter(s => s.department === dept);
}

export function getAtRiskStudents(): Student[] {
  return students.filter(s => s.isAtRisk);
}

export function getSubjectAttendance(studentId: string): SubjectAttendance[] {
  return subjectAttendance.filter(sa => sa.studentId === studentId);
}

export function getFacultyById(id: string): Faculty | undefined {
  return faculty.find(f => f.id === id);
}

export function getTimetableForStudent(dept: Department, year: number, section: string, day?: string): TimetableSlot[] {
  return timetable.filter(t =>
    t.department === dept && t.year === year && t.section === section &&
    (!day || t.day === day)
  );
}

export function getTimetableForFaculty(facultyName: string, day?: string): TimetableSlot[] {
  return timetable.filter(t =>
    t.faculty === facultyName && (!day || t.day === day)
  );
}

export function getFeeRecord(studentId: string): FeeRecord | undefined {
  return feeRecords.find(f => f.studentId === studentId);
}

export function getMarks(studentId: string): MarksRecord[] {
  return marksRecords.filter(m => m.studentId === studentId);
}

export function getLeavesByStudent(studentId: string): LeaveRequest[] {
  return leaveRequests.filter(l => l.studentId === studentId);
}

export function getExamsForDepartment(dept: Department): Exam[] {
  return exams.filter(e => e.department === dept);
}

// ---------- Department stats ----------

export interface DepartmentStats {
  department: Department;
  totalStudents: number;
  avgAttendance: number;
  avgCGPA: number;
  atRiskCount: number;
  feeCollected: number;
  feePending: number;
  avgPlacementScore: number;
}

export function getDepartmentStats(): DepartmentStats[] {
  const depts: Department[] = ['CSE', 'AI&DS', 'ECE'];
  return depts.map(dept => {
    const deptStudents = getStudentsByDepartment(dept);
    const deptFees = feeRecords.filter(f => deptStudents.some(s => s.id === f.studentId));
    return {
      department: dept,
      totalStudents: deptStudents.length,
      avgAttendance: Math.round(deptStudents.reduce((sum, s) => sum + s.overallAttendance, 0) / deptStudents.length),
      avgCGPA: +(deptStudents.reduce((sum, s) => sum + s.cgpa, 0) / deptStudents.length).toFixed(1),
      atRiskCount: deptStudents.filter(s => s.isAtRisk).length,
      feeCollected: deptFees.reduce((sum, f) => sum + f.paidAmount, 0),
      feePending: deptFees.reduce((sum, f) => sum + (f.totalFee - f.paidAmount), 0),
      avgPlacementScore: Math.round(deptStudents.reduce((sum, s) => sum + s.placementScore, 0) / deptStudents.length),
    };
  });
}

// ---------- Attendance trend data for admin charts ----------

export const monthlyAttendanceTrend = [
  { month: 'Apr', CSE: 89, 'AI&DS': 91, ECE: 87 },
  { month: 'May', CSE: 85, 'AI&DS': 88, ECE: 84 },
  { month: 'Jun', CSE: 82, 'AI&DS': 85, ECE: 81 },
  { month: 'Jul', CSE: 88, 'AI&DS': 90, ECE: 86 },
  { month: 'Aug', CSE: 84, 'AI&DS': 87, ECE: 83 },
  { month: 'Sep', CSE: 81, 'AI&DS': 84, ECE: 85 },
];
