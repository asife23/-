export type Role = 'teacher' | 'student' | 'parent' | 'personal_study_user';

export type Language = 'bn' | 'en';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  avatar?: string;
  isVerified?: boolean;
  nidUrl?: string;
  certificateUrl?: string;
  ratingAverage?: number;
  reviewCount?: number;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
}

export interface Batch {
  id: string;
  name: string;
  teacherId: string;
  subject: string;
  fee: number;
  scheduleDays: string[]; // e.g., ['Sat', 'Mon', 'Wed']
  time: string; // e.g., '4:00 PM'
}

export interface StudentProfile {
  id: string;
  name: string;
  phone: string;
  parentId: string;
  parentPhone: string;
  enrolledBatchIds: string[];
}

export interface ParentProfile {
  id: string;
  name: string;
  phone: string;
  childId: string; // Tushuni is optimized for a simple child mapping demo, though multi-child is supported.
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  batchId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export interface PaymentRecord {
  id: string;
  month: string; // e.g., 'May 2026'
  batchId: string;
  studentId: string;
  teacherId: string;
  amount: number; // Total fee
  paidAmount: number;
  status: 'paid' | 'partial' | 'due' | 'advance';
  datePaid?: string;
  method?: 'bKash' | 'Nagad' | 'Rocket' | 'Cash';
  trxId?: string;
}

export interface ReviewRecord {
  id: string;
  teacherId: string;
  reviewerName: string;
  reviewerRole: 'student' | 'parent';
  rating: number; // 1-5
  comment: string;
  isAnonymous: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  channelId: string; // E.g. 'batch-X' or 'direct-Y-Z'
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file';
  fileName?: string;
  fileSize?: string;
  isSeen: boolean;
  offlineSmsSent?: boolean;
}

export interface NoticeRecord {
  id: string;
  batchId: string; // 'all' or specific batchId
  teacherId: string;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
}

export interface HomeworkRecord {
  id: string;
  batchId: string;
  title: string;
  description: string;
  deadline: string;
  submissionsCount: number;
  teacherId: string;
}

export interface PersonalStudyTask {
  id: string;
  title: string;
  timeSlot: string; // e.g., '07:00 AM - 08:30 AM'
  status: 'todo' | 'done';
}

export interface Circular {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorRole: 'teacher' | 'student' | 'parent';
  creatorAvatar?: string;
  type: 'tuition_needed' | 'tutor_available'; // tuition_needed = posted by student/parent, tutor_available = posted by teacher
  subject: string;
  class: string;
  salary: string;
  location: string;
  phone: string;
  description: string;
  datePosted: string;
  status: 'active' | 'closed';
  applicants: { userId: string; userName: string; userPhone: string; userRole: string; dateApplied: string }[];
}
