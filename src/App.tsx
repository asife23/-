/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Batch, StudentProfile, AttendanceRecord, PaymentRecord, ReviewRecord, 
  ChatMessage, NoticeRecord, HomeworkRecord, PersonalStudyTask, Role, Language, Circular 
} from './types';
import { 
  INITIAL_TEACHER, INITIAL_STUDENT, INITIAL_PARENT, INITIAL_STUDY_USER, MOCK_TEACHERS,
  INITIAL_BATCHES, INITIAL_STUDENT_PROFILES, INITIAL_ATTENDANCE, INITIAL_PAYMENTS, 
  INITIAL_REVIEWS, INITIAL_CHATS, INITIAL_NOTICES, INITIAL_HOMEWORKS, INITIAL_STUDY_TASKS,
  INITIAL_CIRCULARS, TRANSLATE_DICT 
} from './data/initialData';

import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import TuitionCircularsBoard from './components/TuitionCircularsBoard';
import AuthGatewayModal from './components/AuthGatewayModal';

import { 
  Sparkles, Layers, Globe, Clock, ShieldCheck, Moon, Sun, Monitor, Laptop, Laptop2, HelpCircle 
} from 'lucide-react';

export default function App() {
  // Localization toggle
  const [language, setLanguage] = useState<Language>('bn');
  const t = TRANSLATE_DICT[language];

  // Workspace workspace role switching state
  const [currentRole, setCurrentRole] = useState<Role>('teacher');

  // Darkmode status
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Simulated global database states
  const [teacher, setTeacher] = useState<User>(INITIAL_TEACHER);
  const [batches, setBatches] = useState<Batch[]>(INITIAL_BATCHES);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENT_PROFILES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [reviews, setReviews] = useState<ReviewRecord[]>(INITIAL_REVIEWS);
  const [chats, setChats] = useState<ChatMessage[]>(INITIAL_CHATS);
  const [notices, setNotices] = useState<NoticeRecord[]>(INITIAL_NOTICES);
  const [homework, setHomework] = useState<HomeworkRecord[]>(INITIAL_HOMEWORKS);
  const [studyTasks, setStudyTasks] = useState<PersonalStudyTask[]>(INITIAL_STUDY_TASKS);
  const [circulars, setCirculars] = useState<Circular[]>(INITIAL_CIRCULARS);
  const [viewMode, setViewMode] = useState<'dashboard' | 'circulars'>('dashboard');

  // Authenticated user state
  const [authedUser, setAuthedUser] = useState<User>(INITIAL_TEACHER);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // UTC clocks
  const [utcTimeStr, setUtcTimeStr] = useState('');

  // Hydrate states with LocalStorage to satisfy persistent data storage requirement
  useEffect(() => {
    // Check local persistence
    try {
      const persistedLanguage = localStorage.getItem('tushuni_lang') as Language;
      if (persistedLanguage) setLanguage(persistedLanguage);
      
      const persistedRole = localStorage.getItem('tushuni_role') as Role;
      if (persistedRole) setCurrentRole(persistedRole);

      const dbTeacher = localStorage.getItem('tushuni_teacher');
      if (dbTeacher) setTeacher(JSON.parse(dbTeacher));

      const dbBatches = localStorage.getItem('tushuni_batches');
      if (dbBatches) setBatches(JSON.parse(dbBatches));

      const dbStudents = localStorage.getItem('tushuni_students');
      if (dbStudents) setStudents(JSON.parse(dbStudents));

      const dbAttendance = localStorage.getItem('tushuni_attendance');
      if (dbAttendance) setAttendance(JSON.parse(dbAttendance));

      const dbPayments = localStorage.getItem('tushuni_payments');
      if (dbPayments) setPayments(JSON.parse(dbPayments));

      const dbReviews = localStorage.getItem('tushuni_reviews');
      if (dbReviews) setReviews(JSON.parse(dbReviews));

      const dbChats = localStorage.getItem('tushuni_chats');
      if (dbChats) setChats(JSON.parse(dbChats));

      const dbNotices = localStorage.getItem('tushuni_notices');
      if (dbNotices) setNotices(JSON.parse(dbNotices));

      const dbHomework = localStorage.getItem('tushuni_homework');
      if (dbHomework) setHomework(JSON.parse(dbHomework));

      const dbTasks = localStorage.getItem('tushuni_study_tasks');
      if (dbTasks) setStudyTasks(JSON.parse(dbTasks));

      const dbCirculars = localStorage.getItem('tushuni_circulars');
      if (dbCirculars) setCirculars(JSON.parse(dbCirculars));

      const dbAuthedUser = localStorage.getItem('tushuni_authed_user');
      if (dbAuthedUser) {
        setAuthedUser(JSON.parse(dbAuthedUser));
      } else {
        setAuthedUser(INITIAL_TEACHER);
      }
    } catch (e) {
      console.warn('LocalStorage hydration failed', e);
    }
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('tushuni_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('tushuni_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (authedUser) {
      localStorage.setItem('tushuni_authed_user', JSON.stringify(authedUser));
    }
  }, [authedUser]);

  const getCurrentUser = (): User => {
    // If the active role matches the logged-in authedUser's role, prioritize their custom logged-in profile details!
    if (authedUser && authedUser.role === currentRole) {
      return authedUser;
    }
    // Standard static fallbacks for easy switching simulation
    if (currentRole === 'teacher') return teacher;
    if (currentRole === 'student') return INITIAL_STUDENT;
    if (currentRole === 'parent') return INITIAL_PARENT;
    return INITIAL_STUDY_USER;
  };

  const handleLoginSuccess = (user: User) => {
    setAuthedUser(user);
    setCurrentRole(user.role);
    // If a new user registers as teacher, we can sync current teacher state
    if (user.role === 'teacher') {
      setTeacher(user);
      persistState('tushuni_teacher', user);
    }
  };

  // Real-time UTC clock updater
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcTimeStr(d.toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update HTML dark node class helper
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // General Database updates operations
  const persistState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddBatch = (b: Omit<Batch, 'id' | 'teacherId'>) => {
    const updated = [
      ...batches,
      {
        id: `batch-${Date.now()}`,
        teacherId: 'teacher1',
        ...b
      }
    ];
    setBatches(updated);
    persistState('tushuni_batches', updated);
  };

  const handleAddNotice = (n: Omit<NoticeRecord, 'id' | 'teacherId' | 'date'>) => {
    const updated = [
      {
        id: `notice-${Date.now()}`,
        teacherId: 'teacher1',
        date: new Date().toISOString().split('T')[0],
        ...n
      },
      ...notices
    ];
    setNotices(updated);
    persistState('tushuni_notices', updated);
  };

  const handleAddHomework = (hw: Omit<HomeworkRecord, 'id' | 'teacherId' | 'submissionsCount'>) => {
    const updated = [
      {
        id: `hw-${Date.now()}`,
        teacherId: 'teacher1',
        submissionsCount: 0,
        ...hw
      },
      ...homework
    ];
    setHomework(updated);
    persistState('tushuni_homework', updated);
  };

  const handleUpdateAttendance = (date: string, batchId: string, studentId: string, status: 'present' | 'absent' | 'late') => {
    // Check if record exists
    const idx = attendance.findIndex(a => a.date === date && a.batchId === batchId && a.studentId === studentId);
    let updated = [...attendance];
    if (idx > -1) {
      updated[idx].status = status;
    } else {
      updated.push({
        id: `att-${Date.now()}`,
        date,
        batchId,
        studentId,
        status
      });
    }
    setAttendance(updated);
    persistState('tushuni_attendance', updated);
  };

  const handleUpdatePayment = (paymentId: string, paidAmount: number, status: PaymentRecord['status'], method?: PaymentRecord['method'], trxId?: string) => {
    const updated = payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          paidAmount,
          status,
          datePaid: new Date().toISOString().split('T')[0],
          method: method || 'bKash',
          trxId: trxId || `TXN${Date.now().toString().slice(-6)}`
        };
      }
      return p;
    });
    setPayments(updated);
    persistState('tushuni_payments', updated);
  };

  const handlePayTuitionFee = (paymentId: string, amount: number, method: 'bKash' | 'Nagad' | 'Rocket', trxId: string) => {
    handleUpdatePayment(paymentId, amount, 'paid', method, trxId);
  };

  const handleAddManualPayment = (p: Omit<PaymentRecord, 'id' | 'teacherId'>) => {
    const updated = [
      {
        id: `pay-${Date.now()}`,
        teacherId: 'teacher1',
        ...p
      },
      ...payments
    ];
    setPayments(updated);
    persistState('tushuni_payments', updated);
  };

  const handleSendMessage = (channelId: string, content: string, type: 'text' | 'file', name?: string, size?: string) => {
    const updated = [
      ...chats,
      {
        id: `msg-${Date.now()}`,
        channelId,
        senderId: currentRole === 'teacher' ? 'teacher1' : currentRole === 'student' ? 'student1' : 'parent1',
        senderName: currentRole === 'teacher' ? teacher.name : currentRole === 'student' ? INITIAL_STUDENT.name : INITIAL_PARENT.name,
        senderRole: currentRole,
        content,
        timestamp: new Date().toISOString(),
        type,
        fileName: name,
        fileSize: size,
        isSeen: false,
        offlineSmsSent: channelId.startsWith('group-') && currentRole === 'teacher'
      }
    ];
    setChats(updated);
    persistState('tushuni_chats', updated);
  };

  const handleVerifyTeacher = (nid: string, certName: string) => {
    const updatedTeacher = {
      ...teacher,
      isVerified: true,
      nidUrl: 'NID_DOCUMENT_PERSIST',
      certificateUrl: certName
    };
    setTeacher(updatedTeacher);
    persistState('tushuni_teacher', updatedTeacher);
  };

  const handleAddReview = (r: Omit<ReviewRecord, 'id' | 'date'>) => {
    // Add reviewer to the targets list
    const updated = [
      {
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...r
      },
      ...reviews
    ];
    setReviews(updated);
    persistState('tushuni_reviews', updated);
  };

  const handleAddTask = (t: Omit<PersonalStudyTask, 'id' | 'status'>) => {
    const updated = [
      ...studyTasks,
      {
        id: `task-${Date.now()}`,
        status: 'todo' as const,
        ...t
      }
    ];
    setStudyTasks(updated);
    persistState('tushuni_study_tasks', updated);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = studyTasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: (t.status === 'done' ? 'todo' : 'done') as 'todo' | 'done'
        };
      }
      return t;
    });
    setStudyTasks(updated);
    persistState('tushuni_study_tasks', updated);
  };

  const handleUpdateTeacherProfile = (updatedTeacher: User) => {
    setTeacher(updatedTeacher);
    persistState('tushuni_teacher', updatedTeacher);
  };

  const handleAddCircular = (c: Omit<Circular, 'id' | 'creatorId' | 'creatorName' | 'creatorRole' | 'creatorAvatar' | 'datePosted' | 'applicants'>) => {
    const creatorUser = getCurrentUser();
    const newCirc: Circular = {
      id: `circ-${Date.now()}`,
      creatorId: creatorUser.id,
      creatorName: creatorUser.name,
      creatorRole: (creatorUser.role === 'personal_study_user' ? 'student' : creatorUser.role) as 'teacher' | 'student' | 'parent',
      creatorAvatar: creatorUser.avatar,
      datePosted: new Date().toISOString().split('T')[0],
      applicants: [],
      ...c
    };
    const updated = [newCirc, ...circulars];
    setCirculars(updated);
    persistState('tushuni_circulars', updated);
  };

  const handleApplyCircular = (circularId: string, applicant: { userId: string; userName: string; userPhone: string; userRole: string }) => {
    const updated = circulars.map(c => {
      if (c.id === circularId) {
        if (c.applicants.some(a => a.userId === applicant.userId)) return c;
        return {
          ...c,
          applicants: [
            ...c.applicants,
            { ...applicant, dateApplied: new Date().toISOString().split('T')[0] }
          ]
        };
      }
      return c;
    });
    setCirculars(updated);
    persistState('tushuni_circulars', updated);
  };

  const handleDeleteCircular = (circularId: string) => {
    const updated = circulars.filter(c => c.id !== circularId);
    setCirculars(updated);
    persistState('tushuni_circulars', updated);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#090d16] font-sans transition-colors duration-300 relative pb-16">
      
      {/* Top Header Appbar Navigation containing Glassmorphism styling */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-[#090d16]/75 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/60 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Branded Logo and Status details */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple via-brand-blue to-brand-cyan flex items-center justify-center text-white shadow-md shadow-brand-purple/20">
              <span className="font-display font-black text-xl tracking-tight">T</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                  {t.appName} <span className="text-brand-purple text-sm font-semibold">(Tushuni)</span>
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-950/20">
                  {t.pwaReady}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Platform for Educators & Parents in Bangladesh</p>
            </div>
          </div>

          {/* Quick status clock widgets */}
          <div className="hidden lg:flex items-center space-x-2.5 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
            <Clock className="w-4.5 h-4.5 text-brand-purple" />
            <span>UTC: 2026-05-28 17:09:32</span>
          </div>

          {/* Multi Actions layout */}
          <div className="flex items-center space-x-3">
            
            {/* Language switches */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-150 dark:border-slate-800">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'bn' 
                    ? 'bg-white dark:bg-slate-900 text-brand-purple shadow-sm' 
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                id="lang-bn-toggle"
              >
                {t.bengali}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white dark:bg-slate-900 text-brand-purple shadow-sm' 
                    : 'text-slate-400 hover:text-slate-705'
                }`}
                id="lang-en-toggle"
              >
                {t.english}
              </button>
            </div>

            {/* Darkmode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-500 hover:bg-slate-100 cursor-pointer"
              title="Toggle theme mode"
              id="theme-mode-toggle"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Authentic Google & Email Security Auth Indicator */}
            <div className="flex items-center space-x-2 border-l border-slate-205 dark:border-slate-805 pl-3">
              {authedUser ? (
                <div className="flex items-center space-x-2 text-left">
                  <div className="relative">
                    {authedUser.avatar ? (
                      <img 
                        src={authedUser.avatar} 
                        alt={authedUser.name} 
                        className="w-8 h-8 rounded-full border border-brand-purple/20 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs uppercase">
                        {authedUser.name.charAt(0)}
                      </div>
                    )}
                    {authedUser.role === 'teacher' && (
                      <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 border border-white dark:border-slate-900 w-2.5 h-2.5 rounded-full" title="Verified Educator" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight truncate max-w-[110px] flex items-center gap-1">
                      <span>{authedUser.name.split(' ')[0]}</span>
                      {authedUser.role === 'teacher' && <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 px-1 rounded">Edu</span>}
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-[9px] text-brand-purple hover:underline font-extrabold block text-left leading-none mt-0.5"
                    >
                      {language === 'bn' ? '🔑 প্রোফাইল পরিবর্তন' : '🔑 Change User'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-1 text-xs font-bold bg-brand-purple text-white rounded-xl hover:opacity-95 shadow-sm cursor-pointer"
                  id="header-login-btn"
                >
                  {language === 'bn' ? 'লগইন' : 'Login'}
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Primary Role workspace Switcher bar (Bento-style layout) */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Workspace Role Select Card */}
        <section className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1 justify-center md:justify-start">
              <Layers className="w-4.5 h-4.5 text-brand-purple" />
              <span>{t.selectRole}</span>
            </span>
            <p className="text-xs text-slate-500 mt-1">Switch workspaces to experience the full features of Students, Teachers, and Parents.</p>
          </div>

          <div className="grid grid-cols-2 md:flex gap-1.5 w-full md:w-auto">
            {([
              { id: 'teacher', label: t.teacher, roleColor: 'text-brand-purple' },
              { id: 'student', label: t.student, roleColor: 'text-brand-cyan' },
              { id: 'parent', label: t.parent, roleColor: 'text-brand-purple' },
              { id: 'personal_study_user', label: t.studyUser, roleColor: 'text-brand-blue' }
            ] as const).map((rl) => (
              <button
                key={rl.id}
                onClick={() => setCurrentRole(rl.id)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap outline-none ${
                  currentRole === rl.id
                    ? 'bg-gradient-to-r from-brand-purple to-brand-blue text-white shadow-md shadow-brand-purple/15'
                    : 'bg-slate-55/65 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300'
                }`}
                id={`switch-role-${rl.id}`}
              >
                {rl.label}
              </button>
            ))}
          </div>
        </section>

        {/* Navigation Selector for Dashboard view modes */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-1.5 space-x-6 text-sm font-semibold mb-6">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`pb-2.5 transition-all outline-none border-b-2 font-display font-extrabold text-xs sm:text-sm flex items-center space-x-2 cursor-pointer ${
              viewMode === 'dashboard'
                ? 'border-brand-purple text-brand-purple dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            id="nav-dashboard-mode"
          >
            <span className="text-base">🏠</span>
            <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
          </button>
          
          <button
            onClick={() => setViewMode('circulars')}
            className={`pb-2.5 transition-all outline-none border-b-2 font-display font-extrabold text-xs sm:text-sm flex items-center space-x-2 cursor-pointer ${
              viewMode === 'circulars'
                ? 'border-brand-purple text-brand-purple dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            id="nav-circulars-mode"
          >
            <span className="relative text-base">
              💼
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
            </span>
            <span>{language === 'bn' ? 'সার্কুলার ও টিউটর অনুসন্ধান' : 'Tuition & Circulars Board'}</span>
          </button>
        </div>

        {/* Dashboard Rendering block based on active user workspace Role or active Board */}
        <section className="animate-fade-in">
          
          {viewMode === 'circulars' ? (
            <TuitionCircularsBoard
              language={language}
              currentUser={getCurrentUser()}
              circulars={circulars}
              onAddCircular={handleAddCircular}
              onApplyCircular={handleApplyCircular}
              onDeleteCircular={handleDeleteCircular}
            />
          ) : (
            <>
              {currentRole === 'teacher' && (
                <TeacherDashboard
                  language={language}
                  teacher={teacher}
                  batches={batches}
                  students={students}
                  attendance={attendance}
                  payments={payments}
                  reviews={reviews}
                  notices={notices}
                  homework={homework}
                  chats={chats}
                  onAddBatch={handleAddBatch}
                  onAddNotice={handleAddNotice}
                  onAddHomework={handleAddHomework}
                  onUpdateAttendance={handleUpdateAttendance}
                  onUpdatePayment={handleUpdatePayment}
                  onAddManualPayment={handleAddManualPayment}
                  onSendMessage={handleSendMessage}
                  onVerifyTeacher={handleVerifyTeacher}
                  onUpdateTeacherProfile={handleUpdateTeacherProfile}
                />
              )}

              {currentRole === 'student' && (
                <StudentDashboard
                  language={language}
                  student={INITIAL_STUDENT}
                  teacher={teacher}
                  batches={batches.filter(b => INITIAL_STUDENT_PROFILES[0].enrolledBatchIds.includes(b.id))}
                  payments={payments}
                  notices={notices}
                  homework={homework}
                  attendance={attendance}
                  studyTasks={studyTasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onPayTuitionFee={handlePayTuitionFee}
                />
              )}

              {currentRole === 'parent' && (
                <ParentDashboard
                  language={language}
                  parent={INITIAL_PARENT}
                  teacher={teacher}
                  batches={batches}
                  students={students}
                  attendance={attendance}
                  payments={payments}
                  reviews={reviews}
                  chats={chats}
                  onAddReview={handleAddReview}
                  onPayTuitionFee={handlePayTuitionFee}
                  onSendMessage={handleSendMessage}
                />
              )}

              {currentRole === 'personal_study_user' && (
                <StudentDashboard
                  language={language}
                  student={INITIAL_STUDY_USER}
                  batches={[]}
                  payments={[]}
                  notices={notices}
                  homework={[]}
                  attendance={[]}
                  studyTasks={studyTasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onPayTuitionFee={(p, a, m, t) => console.log(p, a, m, t)}
                />
              )}
            </>
          )}

        </section>

      </main>

      {/* PWA bottom app banner */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 text-white p-3 shadow-2xl glass">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 text-xs gap-4">
          <div className="flex items-center space-x-2 text-left">
            <span className="p-1 px-1.5 rounded-md bg-brand-cyan/25 text-brand-cyan leading-none font-bold uppercase text-[9px] tracking-wider">PWA READY</span>
            <p className="font-display font-medium text-white/95 leading-none">{t.pwaInstallMsg}</p>
          </div>
          <button 
            onClick={() => alert(language === 'bn' ? 'টিউশুনি মোবাইল স্ক্রিনে ইন্সটল শুরু হচ্ছে...' : 'Tushuni Progressive Web Application launcher shortcut created!')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-[11px] text-white cursor-pointer active:scale-95 transition-all"
            id="pwa-install-app-btn"
          >
            {language === 'bn' ? 'অ্যাপ ইন্সটল করুন' : 'Install PWA App'}
          </button>
        </div>
      </footer>

      {/* Auth Gateway Dialog */}
      <AuthGatewayModal
        language={language}
        isOpen={isAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
