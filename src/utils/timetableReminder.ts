import { getTimetableForStudent, type Department, type TimetableSlot } from '@/data/mockData';

export interface ChecklistItem {
  id: string;
  item: string;
  itemTa: string;
  reason: string;
  reasonTa: string;
  category: 'Mandatory' | 'Lab Kit' | 'Notes & Tools' | 'Assignment';
  icon: string;
  packed: boolean;
}

export interface DayAnalysis {
  targetDay: string;
  targetDayTa: string;
  isTomorrow: boolean;
  dateStr: string;
  slots: TimetableSlot[];
  hasLab: boolean;
  labRooms: string[];
  checklist: ChecklistItem[];
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayNamesTa: Record<string, string> = {
  Sunday: 'ஞாயிற்றுக்கிழமை',
  Monday: 'திங்கட்கிழமை',
  Tuesday: 'செவ்வாய்க்கிழமை',
  Wednesday: 'புதன்கிழமை',
  Thursday: 'வியாழக்கிழமை',
  Friday: 'வெள்ளிக்கிழமை',
  Saturday: 'சனிக்கிழமை',
};

/**
 * Calculates next college working day relative to today.
 * If today is Friday or Saturday, gives Monday (or Saturday if scheduled).
 */
export function getTomorrowDayName(): { day: string; dayTa: string; dateStr: string } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  // If Sunday (0), shift to Monday (1)
  if (tomorrow.getDay() === 0) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  const day = dayNames[tomorrow.getDay()];
  const dayTa = dayNamesTa[day] || day;
  const dateStr = tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });

  return { day, dayTa, dateStr };
}

/**
 * Analyzes tomorrow's periods and generates a customized packing checklist.
 */
export function analyzeTomorrowTimetable(
  dept: Department = 'CSE',
  year: number = 3,
  section: string = 'A',
  customDay?: string
): DayAnalysis {
  const { day: defaultDay, dateStr } = getTomorrowDayName();
  const targetDay = customDay || defaultDay;
  const targetDayTa = dayNamesTa[targetDay] || targetDay;

  const slots = getTimetableForStudent(dept, year, section, targetDay);
  slots.sort((a, b) => a.period - b.period);

  const labSlots = slots.filter(s =>
    s.room.toLowerCase().includes('lab') ||
    s.subjectName.toLowerCase().includes('lab') ||
    s.subjectName.toLowerCase().includes('web technologies')
  );

  const hasLab = labSlots.length > 0;
  const labRooms = Array.from(new Set(labSlots.map(s => s.room)));

  const checklist: ChecklistItem[] = [];

  // 1. Mandatory Daily Essentials
  checklist.push({
    id: 'id-card',
    item: 'College ID Card & Lanyard',
    itemTa: 'கல்லூரி அடையாள அட்டை (ID Card)',
    reason: 'Mandatory for campus entry, library & attendance swipe',
    reasonTa: 'வளாக நுழைவு மற்றும் வருகைப்பதிவிற்கு கட்டாயம்',
    category: 'Mandatory',
    icon: '🪪',
    packed: true,
  });

  checklist.push({
    id: 'stationery',
    item: 'Stationery Kit (Blue/Black pens, pencil, scale)',
    itemTa: 'எழுதுபொருட்கள் (பேனா, பென்சில், அளவுகோல்)',
    reason: 'General note-taking & surprise class tests',
    reasonTa: 'வகுப்பு குறிப்புகள் மற்றும் தேர்வுகளுக்கு',
    category: 'Mandatory',
    icon: '🖊️',
    packed: true,
  });

  // 2. Lab Specific Requirements
  if (hasLab) {
    const labNames = labSlots.map(s => s.subjectName).join(', ');
    checklist.push({
      id: 'lab-coat',
      item: 'White Lab Coat / Apron',
      itemTa: 'வெள்ளை ஆய்வக ஆடை (Lab Apron)',
      reason: `Strictly required for ${labNames} at ${labRooms.join(', ')}`,
      reasonTa: `${labRooms.join(', ')}-ல் நடக்கும் ${labNames} செய்முறை வகுப்பிற்கு அவசியம்`,
      category: 'Lab Kit',
      icon: '🥼',
      packed: false,
    });

    checklist.push({
      id: 'lab-record',
      item: 'Lab Manual & Observation Notebook',
      itemTa: 'ஆய்வக கையேடு மற்றும் குறிப்பேடு (Record Note)',
      reason: 'Prior week experiment code & faculty sign-off',
      reasonTa: 'முந்தைய வார செய்முறை குறியீடு கையொப்பம் பெற',
      category: 'Lab Kit',
      icon: '📘',
      packed: false,
    });

    checklist.push({
      id: 'laptop-pendrive',
      item: 'Laptop or USB Drive (with code repository)',
      itemTa: 'மடிக்கணினி / பென்டிரைவ் (USB Flash Drive)',
      reason: `For lab execution in ${labRooms[0] || 'Computer Lab'}`,
      reasonTa: 'ஆய்வக செய்முறை பயிற்சிகளை இயக்க',
      category: 'Lab Kit',
      icon: '💻',
      packed: false,
    });
  }

  // 3. Subject-Specific Books & Notebooks
  const processedSubjects = new Set<string>();
  slots.forEach((s) => {
    if (processedSubjects.has(s.subjectCode)) return;
    processedSubjects.add(s.subjectCode);

    const sNameLower = s.subjectName.toLowerCase();

    if (sNameLower.includes('database') || sNameLower.includes('dbms')) {
      checklist.push({
        id: `book-${s.subjectCode}`,
        item: `${s.subjectName} Notebook + ER Diagram Stencil`,
        itemTa: `${s.subjectName} நோட்டு மற்றும் ER வரைபட தாள்`,
        reason: `Period ${s.period} (${s.time}) with ${s.faculty}`,
        reasonTa: `பீரியட் ${s.period} (${s.time}) - ${s.faculty}`,
        category: 'Notes & Tools',
        icon: '🗄️',
        packed: false,
      });
    } else if (sNameLower.includes('network') || sNameLower.includes('operating') || sNameLower.includes('vlsi')) {
      checklist.push({
        id: `book-${s.subjectCode}`,
        item: `${s.subjectName} Notes & Scientific Calculator`,
        itemTa: `${s.subjectName} நோட்டு மற்றும் கால்குலேட்டர்`,
        reason: `Period ${s.period} (${s.time}) at ${s.room} (Subnetting / numericals)`,
        reasonTa: `பீரியட் ${s.period} (${s.time}) - கணித சமன்பாடுகளுக்கு`,
        category: 'Notes & Tools',
        icon: '🔢',
        packed: false,
      });
    } else if (sNameLower.includes('software engineering') || sNameLower.includes('design')) {
      checklist.push({
        id: `book-${s.subjectCode}`,
        item: `${s.subjectName} Module Assignment Printout`,
        itemTa: `${s.subjectName} அசைன்மென்ட் நகல்`,
        reason: `Period ${s.period} (${s.time}) - Assignment submission due`,
        reasonTa: `பீரியட் ${s.period} (${s.time}) - அசைன்மென்ட் சமர்ப்பிக்க`,
        category: 'Assignment',
        icon: '📑',
        packed: false,
      });
    } else if (!hasLab || !labSlots.some(ls => ls.subjectCode === s.subjectCode)) {
      checklist.push({
        id: `book-${s.subjectCode}`,
        item: `${s.subjectName} Class Notebook`,
        itemTa: `${s.subjectName} வகுப்பு நோட்டு`,
        reason: `Period ${s.period} (${s.time}) with ${s.faculty}`,
        reasonTa: `பீரியட் ${s.period} (${s.time}) - ${s.faculty}`,
        category: 'Notes & Tools',
        icon: '📓',
        packed: false,
      });
    }
  });

  return {
    targetDay,
    targetDayTa,
    isTomorrow: !customDay || customDay === defaultDay,
    dateStr,
    slots,
    hasLab,
    labRooms,
    checklist,
  };
}
