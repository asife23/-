import { User, Batch, StudentProfile, ParentProfile, AttendanceRecord, PaymentRecord, ReviewRecord, ChatMessage, NoticeRecord, HomeworkRecord, PersonalStudyTask, Circular } from '../types';

export const INITIAL_TEACHER: User = {
  id: 'teacher1',
  name: 'প্রফেসর রফিকুল ইসলাম (Rafiq Sir)',
  role: 'teacher',
  email: 'rafiqul@gmail.com',
  phone: '+8801712345678',
  avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&q=80',
  isVerified: true,
  ratingAverage: 4.8,
  reviewCount: 12,
  bkashNumber: '01712345678',
  nagadNumber: '01712345688',
  rocketNumber: '01712345699'
};

export const INITIAL_STUDENT: User = {
  id: 'student1',
  name: 'আবীর হাসান (Abir)',
  role: 'student',
  email: 'abir.hasan@gmail.com',
  phone: '+8801512345678',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&q=80',
};

export const INITIAL_PARENT: User = {
  id: 'parent1',
  name: 'মিসেস শিরীন হাসান (Shirin)',
  role: 'parent',
  email: 'shirin.hasan@gmail.com',
  phone: '+8801912345678',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80',
};

export const INITIAL_STUDY_USER: User = {
  id: 'study1',
  name: 'সাদিয়া চৌধুরী (Sadia)',
  role: 'personal_study_user',
  email: 'sadia.study@gmail.com',
  phone: '+8801812345678',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
};

// Available Mock Teachers
export const MOCK_TEACHERS: User[] = [
  INITIAL_TEACHER,
  {
    id: 'teacher2',
    name: 'জাহানারা আক্তার (Jahanara Mim)',
    role: 'teacher',
    email: 'jahanara.mim@gmail.com',
    phone: '+8801612345699',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80',
    isVerified: false,
    ratingAverage: 4.4,
    reviewCount: 3
  },
  {
    id: 'teacher3',
    name: 'তানভীর আহমেদ (Tanvir sir)',
    role: 'teacher',
    email: 'tanvir.ahmed@gmail.com',
    phone: '+8801312345677',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&q=80',
    isVerified: true,
    ratingAverage: 4.9,
    reviewCount: 24
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch1',
    name: 'HSC Physics - Batch Alpha',
    teacherId: 'teacher1',
    subject: 'Physics (পদার্থবিজ্ঞান)',
    fee: 3000,
    scheduleDays: ['Sat', 'Mon', 'Wed'],
    time: '04:30 PM'
  },
  {
    id: 'batch2',
    name: 'Class 10 Math - Board Prep',
    teacherId: 'teacher1',
    subject: 'General Math (গণিত)',
    fee: 2500,
    scheduleDays: ['Sun', 'Tue'],
    time: '06:00 PM'
  },
  {
    id: 'batch3',
    name: 'HSC Chemistry - Target GPA 5',
    teacherId: 'teacher3',
    subject: 'Chemistry (রসায়ন)',
    fee: 3500,
    scheduleDays: ['Sun', 'Tue', 'Thu'],
    time: '03:00 PM'
  }
];

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'student1',
    name: 'আবীর হাসান (Abir)',
    phone: '+8801512345678',
    parentId: 'parent1',
    parentPhone: '+8801912345678',
    enrolledBatchIds: ['batch1', 'batch2', 'batch3']
  },
  {
    id: 'student2',
    name: 'রাইহান কবির (Raihan)',
    phone: '+8801734567890',
    parentId: 'parent2',
    parentPhone: '+8801798765432',
    enrolledBatchIds: ['batch1', 'batch3']
  },
  {
    id: 'student3',
    name: 'তাসমিয়া আহমেদ (Tasmia)',
    phone: '+8801655554444',
    parentId: 'parent3',
    parentPhone: '+8801955554444',
    enrolledBatchIds: ['batch2']
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Session - May 24
  { id: 'att1', date: '2026-05-24', batchId: 'batch1', studentId: 'student1', status: 'present' },
  { id: 'att2', date: '2026-05-24', batchId: 'batch1', studentId: 'student2', status: 'present' },
  { id: 'att3', date: '2026-05-24', batchId: 'batch2', studentId: 'student1', status: 'present' },
  { id: 'att4', date: '2026-05-24', batchId: 'batch2', studentId: 'student3', status: 'absent' },
  
  // Session - May 26
  { id: 'att5', date: '2026-05-26', batchId: 'batch1', studentId: 'student1', status: 'late' },
  { id: 'att6', date: '2026-05-26', batchId: 'batch1', studentId: 'student2', status: 'absent' },
  { id: 'att7', date: '2026-05-26', batchId: 'batch2', studentId: 'student1', status: 'present' },
  { id: 'att8', date: '2026-05-26', batchId: 'batch2', studentId: 'student3', status: 'present' },

  // Session - May 28 (Today)
  { id: 'att9', date: '2026-05-28', batchId: 'batch1', studentId: 'student1', status: 'present' },
  { id: 'att10', date: '2026-05-28', batchId: 'batch1', studentId: 'student2', status: 'present' }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  // Paid month: December 2025
  {
    id: 'pay_dec1',
    month: 'December 2025',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2025-12-04',
    method: 'bKash',
    trxId: 'BKX11A1111'
  },
  {
    id: 'pay_dec2',
    month: 'December 2025',
    batchId: 'batch2',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 2500,
    status: 'paid',
    datePaid: '2025-12-05',
    method: 'Nagad',
    trxId: 'NGD11A1111'
  },
  {
    id: 'pay_dec3',
    month: 'December 2025',
    batchId: 'batch3',
    studentId: 'student1',
    teacherId: 'teacher3',
    amount: 3500,
    paidAmount: 3500,
    status: 'paid',
    datePaid: '2025-12-10',
    method: 'Rocket',
    trxId: 'RCK11A1111'
  },

  // Paid month: January 2026
  {
    id: 'pay_jan1',
    month: 'January 2026',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2026-01-05',
    method: 'bKash',
    trxId: 'BKX22B2222'
  },
  {
    id: 'pay_jan2',
    month: 'January 2026',
    batchId: 'batch2',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 2500,
    status: 'paid',
    datePaid: '2026-01-07',
    method: 'Nagad',
    trxId: 'NGD22B2222'
  },
  {
    id: 'pay_jan3',
    month: 'January 2026',
    batchId: 'batch3',
    studentId: 'student1',
    teacherId: 'teacher3',
    amount: 3500,
    paidAmount: 3500,
    status: 'paid',
    datePaid: '2026-01-12',
    method: 'bKash',
    trxId: 'BKX22B2223'
  },

  // Paid month: February 2026
  {
    id: 'pay_feb1',
    month: 'February 2026',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2026-02-04',
    method: 'bKash',
    trxId: 'BKX33C3333'
  },
  {
    id: 'pay_feb3',
    month: 'February 2026',
    batchId: 'batch3',
    studentId: 'student1',
    teacherId: 'teacher3',
    amount: 3500,
    paidAmount: 3500,
    status: 'paid',
    datePaid: '2026-02-10',
    method: 'Rocket',
    trxId: 'RCK33C3333'
  },

  // Paid month: March 2026
  {
    id: 'pay_mar1',
    month: 'March 2026',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2026-03-05',
    method: 'bKash',
    trxId: 'BKX44D4444'
  },
  {
    id: 'pay_mar2',
    month: 'March 2026',
    batchId: 'batch2',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 2500,
    status: 'paid',
    datePaid: '2026-03-08',
    method: 'Nagad',
    trxId: 'NGD44D4444'
  },
  {
    id: 'pay_mar3',
    month: 'March 2026',
    batchId: 'batch3',
    studentId: 'student1',
    teacherId: 'teacher3',
    amount: 3500,
    paidAmount: 3500,
    status: 'paid',
    datePaid: '2026-03-12',
    method: 'bKash',
    trxId: 'BKX44D4445'
  },

  // Paid month: April 2026
  {
    id: 'pay1',
    month: 'April 2026',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2026-04-05',
    method: 'bKash',
    trxId: 'BKX93H8A73'
  },
  {
    id: 'pay2',
    month: 'April 2026',
    batchId: 'batch2',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 2500,
    status: 'paid',
    datePaid: '2026-04-07',
    method: 'Nagad',
    trxId: 'NGD55B2E18'
  },
  
  // Due / Partial for May
  {
    id: 'pay3',
    month: 'May 2026',
    batchId: 'batch1',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 0,
    status: 'due'
  },
  {
    id: 'pay4',
    month: 'May 2026',
    batchId: 'batch2',
    studentId: 'student1',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 1500,
    status: 'partial'
  },
  {
    id: 'pay5',
    month: 'May 2026',
    batchId: 'batch1',
    studentId: 'student2',
    teacherId: 'teacher1',
    amount: 3000,
    paidAmount: 3000,
    status: 'paid',
    datePaid: '2026-05-10',
    method: 'bKash',
    trxId: 'BKX22P5W99'
  },
  {
    id: 'pay6',
    month: 'May 2026',
    batchId: 'batch2',
    studentId: 'student3',
    teacherId: 'teacher1',
    amount: 2500,
    paidAmount: 0,
    status: 'due'
  }
];

export const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev1',
    teacherId: 'teacher1',
    reviewerName: 'শিরীন হাসান (Shirin)',
    reviewerRole: 'parent',
    rating: 5,
    comment: 'রফিক স্যার অত্যন্ত যত্ন সহকারে ফিজিক্স পড়ান। আমার ছেলের পড়ালেখার উন্নতি হয়েছে।',
    isAnonymous: false,
    date: '2026-05-15'
  },
  {
    id: 'rev2',
    teacherId: 'teacher1',
    reviewerName: 'Anonymous student',
    reviewerRole: 'student',
    rating: 4.5,
    comment: 'The batch notes and formulas booklets provided by Rafiq Sir are very useful for board exams.',
    isAnonymous: true,
    date: '2026-05-20'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  // Group chats (Batch 1)
  {
    id: 'msg1',
    channelId: 'group-batch1',
    senderId: 'teacher1',
    senderName: 'Prof. Rafiqul Islam',
    senderRole: 'teacher',
    content: 'আসসালামু আলাইকুম। আজকে বিকেল ৪টা ৩০ মিনিটের ক্লাসটি একটু আগে ৪টা ১৫ মিনিটে শুরু হবে। দয়া করে সবাই সময়ে উপস্থিত থেকো।',
    timestamp: '2026-05-28T10:00:00Z',
    type: 'text',
    isSeen: true
  },
  {
    id: 'msg2',
    channelId: 'group-batch1',
    senderId: 'student1',
    senderName: 'Abir Hasan',
    senderRole: 'student',
    content: 'জ্বী স্যার, আমি সময়ে চলে আসব ইনশাআল্লাহ্।',
    timestamp: '2026-05-28T10:15:00Z',
    type: 'text',
    isSeen: true
  },
  {
    id: 'msg3',
    channelId: 'group-batch1',
    senderId: 'student2',
    senderName: 'Raihan Kabir',
    senderRole: 'student',
    content: 'Okay sir.',
    timestamp: '2026-05-28T10:18:00Z',
    type: 'text',
    isSeen: true
  },

  // Direct Chat (Teacher <-> Parent)
  {
    id: 'msg4',
    channelId: 'direct-teacher1-parent1',
    senderId: 'parent1',
    senderName: 'Shirin Hasan',
    senderRole: 'parent',
    content: 'আসসালামু আলাইকুম স্যার। আবীর কেমন পড়ছে ইদানীং? ওর ম্যাথ মক টেস্টে নাম্বার কেমন আসলো?',
    timestamp: '2026-05-27T14:30:00Z',
    type: 'text',
    isSeen: true
  },
  {
    id: 'msg5',
    channelId: 'direct-teacher1-parent1',
    senderId: 'teacher1',
    senderName: 'Prof. Rafiqul Islam',
    senderRole: 'teacher',
    content: 'ওয়া আলাইকুম আসসালাম। আবীর খুবই মেধাবী, তবে ফিজিক্সে আরেকটু সময় দেওয়া লাগবে। ম্যাথ বোর্ডে ও ৮০ তে ৭২ পেয়েছে। মক টেস্টের খাতা আমি এটাচ করে দিচ্ছি।',
    timestamp: '2026-05-27T15:00:00Z',
    type: 'text',
    isSeen: true
  },
  {
    id: 'msg6',
    channelId: 'direct-teacher1-parent1',
    senderId: 'teacher1',
    senderName: 'Prof. Rafiqul Islam',
    senderRole: 'teacher',
    content: 'Rafiqul_MockTest_Math_GradeSheet.pdf',
    timestamp: '2026-05-27T15:01:00Z',
    type: 'file',
    fileName: 'Rafiqul_MockTest_Math_GradeSheet.pdf',
    fileSize: '1.2 MB',
    isSeen: true
  }
];

export const INITIAL_NOTICES: NoticeRecord[] = [
  {
    id: 'notice1',
    batchId: 'batch1',
    teacherId: 'teacher1',
    title: 'ফিজিক্স স্পেশাল ফর্মুলা শিট বিতরণ',
    content: 'আগামী সোমবারের ক্লাসে তাপগতিবিদ্যা (Thermodynamics) ও তড়িৎ রসায়নের উপরে বিশেষভাবে সংকলিত শর্টকাট ফর্মুলা বুকলেট দেওয়া হবে। সবাইকে ক্লাসে অবশ্যই থাকতে বলা হচ্ছে।',
    date: '2026-05-27',
    isPinned: true
  },
  {
    id: 'notice2',
    batchId: 'all',
    teacherId: 'teacher1',
    title: 'ঈদুল আযহা উপলক্ষ্যে বন্ধের নোটিশ',
    content: 'ঈদুল আযহা উপলক্ষ্যে আমাদের সকল টিউশন ব্যাচ আগামী ১লা জুন থেকে ৮ই জুন পর্যন্ত বন্ধ থাকবে। ৯ আগামী ৯ই জুন থেকে যথাসময়ে নতুন রুটিন অনুযায়ী ক্লাস পুনরায় শুরু হবে। অগ্রিম ঈদ মোবারক!',
    date: '2026-05-25',
    isPinned: false
  }
];

export const INITIAL_HOMEWORKS: HomeworkRecord[] = [
  {
    id: 'hw1',
    batchId: 'batch1',
    title: 'স্থির তড়িৎ - অনুশীলনী ৫ এর অংক',
    description: 'স্থির তড়িৎ অধ্যায়ের সমান্তরাল পাত ধারক (Parallel Plate Capacitor) সংক্রান্ত বিগত ৫ বছরের বোর্ড পরীক্ষার সৃজনশীল প্রশ্নগুলো অ্যাসাইনমেন্ট আকারে সমাধান করে নিয়ে আসবে।',
    deadline: '2026-05-30',
    submissionsCount: 2,
    teacherId: 'teacher1'
  },
  {
    id: 'hw2',
    batchId: 'batch2',
    title: 'বৃত্ত সংক্রান্ত উপপাদ্য অনুশীলন',
    description: 'উপপাদ্য ২০ এবং ২১ লিখে প্রমাণসহ জমা দিতে হবে। খাতায় চিত্র জ্যামিতিক বক্স ব্যবহার করে পরিষ্কারভাবে আকবে।',
    deadline: '2026-05-31',
    submissionsCount: 1,
    teacherId: 'teacher1'
  }
];

export const INITIAL_STUDY_TASKS: PersonalStudyTask[] = [
  { id: 'task1', title: 'পদার্থবিজ্ঞান দ্বিতীয় পত্র - তড়িৎ রসায়ন রিভিশন', timeSlot: '07:00 AM - 08:30 AM', status: 'done' },
  { id: 'task2', title: 'রসায়ন - যৌগিক রসায়ন নামধারী বিক্রিয়া মুখস্থ', timeSlot: '09:00 AM - 10:30 AM', status: 'todo' },
  { id: 'task3', title: 'মেডিকেল প্রশ্নব্যাংক সমাধান - জীববিজ্ঞান', timeSlot: '04:00 PM - 05:30 PM', status: 'todo' },
  { id: 'task4', title: 'ইংরেজি ১ম পত্র - রিডিং ও প্যারাগ্রাফ প্রস্তুতি', timeSlot: '08:00 PM - 09:30 PM', status: 'todo' }
];

export const INITIAL_CIRCULARS: Circular[] = [
  {
    id: 'circ_1',
    creatorId: 'teacher1',
    creatorName: 'প্রফেসর রফিকুল ইসলাম (Rafiq Sir)',
    creatorRole: 'teacher',
    creatorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&q=80',
    type: 'tutor_available',
    subject: 'পদার্থবিজ্ঞান (Physics)',
    class: 'HSC / SSC Exam',
    salary: '৳৩,০০০ / মাস',
    location: 'মিরপুর ১০, ঢাকা (Mirpur, Dhaka)',
    phone: '01712345678',
    description: 'এইচএসসি ও এসএসসি স্পেশাল ফিজিক্স ব্যাচে নতুন ভর্তির সার্কুলার। প্রতি ব্যাচে সীমিত আসন। হাতে-কলমে বাস্তব এক্সপেরিমেন্ট দিয়ে গাণিতিক সমস্যার সমাধান শিখানো হবে। কুইক অ্যাসাইনমেন্ট ও স্পেশাল শিট দেওয়া হবে ফ্রিতে।',
    datePosted: '2026-05-27',
    status: 'active',
    applicants: [
      { userId: 'student1', userName: 'আবীর হাসান (Abir)', userPhone: '01512345678', userRole: 'student', dateApplied: '2026-05-28' }
    ]
  },
  {
    id: 'circ_2',
    creatorId: 'parent1',
    creatorName: 'মিসেস শিরীন হাসান (Shirin)',
    creatorRole: 'parent',
    type: 'tuition_needed',
    subject: 'ইংরেজি এবং সাধারণ বিজ্ঞান (English & Science)',
    class: 'অষ্টম শ্রেণী (Class 8)',
    salary: '৳৪,৫০০ / মাস',
    location: 'ধানমণ্ডি, ঢাকা (Dhanmondi, Dhaka)',
    phone: '01811223344',
    description: 'আমার মেয়ের জন্য সেন্ট যোসেফ স্কুলের বিজ্ঞান ও ইংরেজি সিলেবাস সমাধান করতে পারে এমন একজন দ্বায়িত্ববান শিক্ষকের প্রয়োজন। সপ্তাহে ৪ দিন পড়াতে হবে। অবশ্যই ঢাকা বিশ্ববিদ্যালয়/বুয়েট এর শিক্ষার্থী হতে হবে।',
    datePosted: '2026-05-26',
    status: 'active',
    applicants: []
  },
  {
    id: 'circ_3',
    creatorId: 'teacher2',
    creatorName: 'সাদিয়া আক্তার (Sadia Maam)',
    creatorRole: 'teacher',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
    type: 'tutor_available',
    subject: 'রসায়ন ও সাধারণ গণিত (Chemistry & Math)',
    class: 'নবম-দশম শ্রেণী (Class 9-10)',
    salary: '৳৩,৫০০ / মাস',
    location: 'উত্তরা, ঢাকা (Uttara, Dhaka)',
    phone: '01999888777',
    description: 'আমি বুয়েটের কেমিক্যাল ইঞ্জিনিয়ারিং ৩য় বর্ষের ছাত্রী। নবম/দশম শ্রেণীর পদার্থ, রসায়ন ও উচ্চতর গণিত এর জন্য অনলাইনে বা বাসায় ওয়ান-টু-ওয়ান কেয়ার দিয়ে পড়াতে আগ্রহী।',
    datePosted: '2026-05-25',
    status: 'active',
    applicants: []
  }
];

export const TRANSLATE_DICT = {
  bn: {
    appName: 'টিউশুনি',
    appDesc: 'ছাত্র, শিক্ষক এবং অভিভাবকদের জন্য আধুনিক টিউশন প্লাটফর্ম',
    bengali: 'বাংলা',
    english: 'English',
    language: 'ভাষা',
    selectRole: 'রোল সিলেক্ট করুন',
    teacher: 'শিক্ষক (Teacher)',
    student: 'ছাত্র (Student)',
    parent: 'অভিভাবক (Parent)',
    studyUser: 'সেলফ স্টাডি (Study)',
    dashboard: 'ড্যাশবোর্ড',
    batches: 'ব্যাচসমূহ',
    attendance: 'উপস্থিতি',
    payments: 'বেতন হিসাব',
    chats: 'চ্যাট',
    notices: 'নোটিশ',
    homework: 'হোমওয়ার্ক',
    verification: 'সার্টিফিকেট ভেরিফিকেশন',
    reviews: 'রিভিউ ও ফিডব্যাক',
    personalStudy: 'ব্যক্তিগত পড়াশোনা রুটিন',
    
    // UI details
    pwaReady: 'অফলাইন ব্যাকআপ সক্ষম (PWA)',
    blueTick: 'ভেরিফাইড শিক্ষক',
    verifiedBtn: 'ভেরিফাইড',
    notVerifiedBtn: 'নথিপত্র যাচাই করুন',
    verifyTitle: 'শিক্ষক প্রোফাইল ভেরিফিকেশন',
    verifySub: 'বাংলাদেশ সরকারের এনআইডি (NID) এবং একাডেমিক সার্টিফিকেট আপলোড করে ভেরিফাইড ব্লু টিক অর্জন করুন',
    nidLabel: 'জাতীয় পরিচয়পত্র নম্বর (NID)',
    certificateLabel: 'সর্বশেষ শিক্ষাগত যোগ্যতা (সার্টিফিকেট/আইডি)',
    uploadDrag: 'ফাইল টানুন অথবা ফাইল সিলেক্ট ক্লিক করুন (PDF, PNG, JPG)',
    submitDoc: 'নথিপত্র জমা দিন',
    avgRating: 'গড় রেটিং',
    totalReviews: 'মোট রিভিউ',
    byReviewer: 'রিভিউ দাতা',
    anonymous: 'বেনামী রিভিউ',
    addReview: 'অনুভব কেমন? রিভিউ লিখে জানান',
    ratePrompt: 'রেটিং দিন:',
    commentPrompt: 'অভিজ্ঞতা ব্যাখ্যা করুন...',
    isAnonPrompt: 'বেনামে পোস্ট করতে চান?',
    submitReview: 'মন্তব্য পোস্ট করুন',
    
    // Accounting
    accountBook: 'স্মার্ট বেতন খাতা',
    paymentRecords: 'লেনদেনের বিবরণী',
    dueList: 'বকেয়া তালিকা',
    autoMergeActive: 'অটো-মার্জ: এক অভিভাবকের দুই ব্যাচ একত্রিত',
    month: 'মাস',
    amount: 'টাকা',
    paid: 'পরিশোধিত',
    partial: 'আংশিক',
    due: 'বকেয়া',
    advance: 'অগ্রিম আদায়',
    status: 'অবস্থা',
    action: 'অ্যাকশন',
    exportReport: 'Excel/PDF রিপোর্ট ডাউনলোড করুন',
    searchStudent: 'শিক্ষার্থীর নাম খুঁজুন...',
    addPaymentBtn: 'ম্যানুয়াল এন্ট্রি যুক্ত করুন',
    batchSelector: 'ব্যাচ সিলেক্ট',
    studentSelector: 'ছাত্র সিলেক্ট',
    paymentMethod: 'পরিশোধের মাধ্যম',
    bkashNagadRocket: 'bKash / Nagad / Rocket গেটওয়ে',
    payNow: 'এখনই দিন',
    enterAmount: 'টাকার পরিমাণ',
    invoice: 'রসিদ',
    trxId: 'Transaction ID',
    paySuccess: 'টাকা সফলভাবে পরিশোধিত হয়েছে!',
    
    // Realtime chat & alert
    messenger: 'মেসেঞ্জার হাব',
    directMessages: 'ব্যক্তিগত আলাপ',
    groupMessages: 'ব্যাচ গ্রুপ চ্যাট',
    typingPlaceholder: 'বার্তা লিখুন...',
    send: 'বার্তা পাঠান',
    attachFile: 'ফাইল সংযুক্ত করুন',
    today: 'আজ',
    emergencyNotice: 'জরুরি অফলাইন SMS এলার্ট সিস্টেম',
    smsWarning: 'গ্রিনওয়েব SMS গেটওয়ে যুক্ত। বার্তা পাঠালে ইন্টারনেটহীন অফলাইন অভিভাবকদের ফোনেও তাৎক্ষণিক খুদেবার্তা চলে যাবে!',
    sendSmsNotice: 'অফলাইন SMS এলার্ট পাঠান',
    seen: 'দেখেছেন (Seen)',
    online: 'অনলাইন (Online)',
    offline: 'অফলাইন (Offline)',
    
    // Routine and details
    routineCalendar: 'ইন্টারেক্টিভ সময়সূচী ক্যালেন্ডার',
    weekday: 'দিন',
    timeSlot: 'সময়',
    classSchedule: 'টিউশনি শিডিউল',
    studyTask: 'ব্যক্তিগত পড়ার টাস্ক',
    addTask: 'পড়ার নতুন বিষয় যুক্ত করুন',
    taskTitle: 'বিষয়ের নাম',
    markComplete: 'সম্পন্ন',
    pending: 'চলমান',
    deadline: 'শেষ সময়',
    subject: 'বিষয়',
    enrolledStudents: 'ভর্তি ছাত্র সংখ্যা',
    addNewBatch: 'নতুন ব্যাচ ব্যাটল',
    batchName: 'ব্যাচ নাম',
    weeklySchedule: 'সাপ্তাহিক রুটিন',
    congratulations: 'অভিনন্দন!',
    pwaInstallMsg: 'টিউশুনি PWA অ্যাপ ইন্সটল করুন মোবাইল স্ক্রিনে রাখার জন্য।',
  },
  en: {
    appName: 'Tushuni',
    appDesc: 'Modern Tuition Platform for Students, Parents & Teachers',
    bengali: 'Bengali',
    english: 'English',
    language: 'Language',
    selectRole: 'Select Workspace Role',
    teacher: 'Teacher Workspace',
    student: 'Student Workspace',
    parent: 'Parent Workspace',
    studyUser: 'Self Study Planner',
    dashboard: 'Dashboard',
    batches: 'Batches',
    attendance: 'Attendance',
    payments: 'Tution Book',
    chats: 'Chat Hub',
    notices: 'Notice Board',
    homework: 'Homeworks',
    verification: 'Certification / NID',
    reviews: 'Verified Ratings',
    personalStudy: 'Personal Study Routine',
    
    // UI details
    pwaReady: 'Offline Backup Active (PWA)',
    blueTick: 'Verified Educator',
    verifiedBtn: 'Verified',
    notVerifiedBtn: 'Verify Credentials',
    verifyTitle: 'Teacher Certification Verification',
    verifySub: 'Upload your Academic Certificates and National Identity (NID) to attain the blue-verified status.',
    nidLabel: 'National Identity Number (NID)',
    certificateLabel: 'Academic Certificate or Institutional ID',
    uploadDrag: 'Drag files or click to upload your document (PDF, PNG, JPG)',
    submitDoc: 'Submit for Verification',
    avgRating: 'Average Rating',
    totalReviews: 'Total Reviews',
    byReviewer: 'Reviewed By',
    anonymous: 'Anonymous Review',
    addReview: 'How is your experience? Write a review',
    ratePrompt: 'Give Rating:',
    commentPrompt: 'Describe your feedback...',
    isAnonPrompt: 'Keep feedback anonymous?',
    submitReview: 'Submit Review',
    
    // Accounting
    accountBook: 'Smart Accounting Ledger',
    paymentRecords: 'Transaction Invoices',
    dueList: 'Dues Summary',
    autoMergeActive: 'Auto-Merge Enabled: Combined dues for multi-enrolled parent',
    month: 'Month',
    amount: 'Amount',
    paid: 'Paid',
    partial: 'Partial',
    due: 'Overdue Dues',
    advance: 'Advance Paid',
    status: 'Status',
    action: 'Action',
    exportReport: 'Download Excel / PDF Report',
    searchStudent: 'Search student name...',
    addPaymentBtn: 'Add Ledger Invoice Manually',
    batchSelector: 'Select Batch',
    studentSelector: 'Select Student',
    paymentMethod: 'Payment Mode',
    bkashNagadRocket: 'bKash / Nagad / Rocket',
    payNow: 'Complete Payment Now',
    enterAmount: 'Amount in BDT',
    invoice: 'Invoice ID',
    trxId: 'Transaction Link',
    paySuccess: 'Tution invoice successfully updated!',
    
    // Realtime chat & alert
    messenger: 'Real-time Chatroom',
    directMessages: 'Direct Channels',
    groupMessages: 'Batch Circular Chats',
    typingPlaceholder: 'Write a response...',
    send: 'Send Now',
    attachFile: 'Attach',
    today: 'Today',
    emergencyNotice: 'Emergency Offline SMS Gateway (GreenWeb)',
    smsWarning: 'SMS Gateway Linked! Sent messages will deliver via mobile SMS to offline parents on urgent notification.',
    sendSmsNotice: 'Send SMS Alert',
    seen: 'Seen',
    online: 'Online',
    offline: 'Offline',
    
    // Routine and details
    routineCalendar: 'Interactive Study Grid',
    weekday: 'Day',
    timeSlot: 'Hour',
    classSchedule: 'Tuition Grid',
    studyTask: 'Independent Prep Work',
    addTask: 'Add study sprint',
    taskTitle: 'Study topic / chapters',
    markComplete: 'Completed',
    pending: 'Pending',
    deadline: 'Deadline',
    subject: 'Subject',
    enrolledStudents: 'Enrolled Pupils',
    addNewBatch: 'Add Tuition Batch',
    batchName: 'Batch Name & Course',
    weeklySchedule: 'Time Window',
    congratulations: 'Splendid!',
    pwaInstallMsg: 'Install Tushuni PWA to run as native application icon on your homescreen.',
  }
};
