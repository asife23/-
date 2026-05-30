import React, { useState } from 'react';
import { 
  Calendar, CreditCard, AlertCircle, CheckSquare, Plus, Check, Star, 
  BookOpen, Sparkles, AlertTriangle, ShieldCheck, Clock 
} from 'lucide-react';
import { 
  Batch, StudentProfile, AttendanceRecord, PaymentRecord, NoticeRecord, 
  HomeworkRecord, PersonalStudyTask, Language, User, ChatMessage 
} from '../types';
import { TRANSLATE_DICT } from '../data/initialData';
import PaymentGatewayModal from './PaymentGatewayModal';

interface StudentDashboardProps {
  language: Language;
  student: User;
  teacher?: User;
  batches: Batch[];
  payments: PaymentRecord[];
  notices: NoticeRecord[];
  homework: HomeworkRecord[];
  attendance: AttendanceRecord[];
  studyTasks: PersonalStudyTask[];
  onAddTask: (task: Omit<PersonalStudyTask, 'id' | 'status'>) => void;
  onToggleTask: (taskId: string) => void;
  onPayTuitionFee: (paymentId: string, amount: number, method: 'bKash' | 'Nagad' | 'Rocket', trxId: string) => void;
}

export default function StudentDashboard({
  language,
  student,
  teacher,
  batches,
  payments,
  notices,
  homework,
  attendance,
  studyTasks,
  onAddTask,
  onToggleTask,
  onPayTuitionFee
}: StudentDashboardProps) {
  const t = TRANSLATE_DICT[language];
  const [activeTab, setActiveTab] = useState<'routine' | 'dues' | 'homework' | 'notices' | 'study'>('routine');
  
  // Modal for gateways
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Task form details
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00 AM - 09:30 AM');

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle,
      timeSlot: newTaskTime
    });
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const triggerPaymentFlow = (p: PaymentRecord) => {
    setSelectedPayment(p);
    setIsPayOpen(true);
  };

  // Completion calculation for tasks progress ring
  const completedCount = studyTasks.filter(t => t.status === 'done').length;
  const totalCount = studyTasks.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Profile Section */}
      <div className="p-6 bg-gradient-to-r from-brand-blue/10 via-brand-cyan/10 to-brand-purple/10 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={student.avatar} 
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-cyan"
          />
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-xl text-slate-905 dark:text-white">{student.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{t.student} • Class 11 (HSC Batch)</p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="px-5 py-3 h-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <Clock className="w-5 h-5 text-cyan-500" />
          <div className="text-left font-display">
            <span className="block text-[10px] text-slate-400 font-bold uppercase leading-none">Class Attendance</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              {attendance.filter(a => a.studentId === student.id && a.status === 'present').length} Present Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex space-x-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl no-scrollbar">
        {([
          { id: 'routine', label: 'Class Scheduler Routine', icon: Calendar },
          { id: 'dues', label: 'Tution Ledger Accounts', icon: CreditCard },
          { id: 'homework', label: 'Homework assignments', icon: CheckSquare },
          { id: 'notices', label: t.notices, icon: AlertCircle },
          { id: 'study', label: 'Independent Self Study', icon: BookOpen }
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-brand-cyan shadow-sm'
                  : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Sub Views rendering */}
      <div className="transition-all duration-300">
        
        {/* VIEW 1: Color-coded Scheduler Grid */}
        {activeTab === 'routine' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>{t.routineCalendar}</span>
              </h3>
              <p className="text-xs text-slate-500">Weekly schedules for Tuition and Self-study sessions</p>
            </div>

            {/* Grid of weekdays representing current schedule */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {(['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const).map((day) => {
                const dayBatches = batches.filter(b => b.scheduleDays.includes(day));
                return (
                  <div key={day} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <span className="font-display font-bold text-xs uppercase text-slate-400 block tracking-wider">{day}</span>
                    <div className="space-y-2">
                      {dayBatches.map(db => (
                        <div key={db.id} className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-brand-blue/10 border-l-4 border-cyan-500 text-left space-y-1">
                          <span className="font-bold text-[10px] text-cyan-600 block">{db.time}</span>
                          <span className="font-semibold text-xs leading-tight text-slate-800 dark:text-white block">{db.name.split(' - ')[0]}</span>
                          <span className="text-[9px] text-slate-400 block">{db.subject.split(' ')[0]}</span>
                        </div>
                      ))}
                      {dayBatches.length === 0 && (
                        <span className="text-[10px] text-slate-400 italic block py-2">No tuition classes</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Tuition Fee Payments Ledger & Gateways */}
        {activeTab === 'dues' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-display font-semibold text-slate-905 dark:text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-cyan-500" />
                <span>Smart Payment Gateways (bKash/Nagad)</span>
              </h3>
              <p className="text-xs text-slate-500">Pay your monthly course fees securely using native Bangladeshi mobile money</p>
            </div>

            {/* Outstanding dues overview */}
            <div className="space-y-3">
              {payments.filter(p => p.studentId === student.id).map((p) => {
                const b = batches.find(bat => bat.id === p.batchId);
                const outstanding = p.amount - p.paidAmount;
                
                return (
                  <div key={p.id} className="p-5 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-slate-105 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600">May 2026</span>
                        <span className="text-xs font-semibold text-indigo-500">{b?.subject}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">{b?.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">Invoice reference: {p.id}</p>
                    </div>

                    <div className="flex items-center space-x-5">
                      <div className="text-right font-display leading-tight">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">{p.status === 'paid' ? 'Paid BDT' : 'Pending Fee'}</span>
                        <span className={`font-bold text-base ${p.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          ৳{outstanding > 0 ? outstanding : p.amount} BDT
                        </span>
                      </div>

                      {p.status !== 'paid' ? (
                        <button
                          onClick={() => triggerPaymentFlow(p)}
                          className="px-5 py-2.5 rounded-xl font-display font-bold text-xs text-white bg-[#d12053] hover:opacity-95 shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
                          id={`pay-fee-btn-${p.id}`}
                        >
                          <span>Complete bKash/Nagad</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-500 font-bold text-xs flex items-center space-x-1.5 border border-emerald-100 dark:border-emerald-950/30">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Paid Invoice</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: Homework Exercises Tracker */}
        {activeTab === 'homework' && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-905 dark:text-white flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-505" />
              <span>{t.homework} Board</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homework.map((hw) => {
                const b = batches.find(bat => bat.id === hw.batchId);
                return (
                  <div key={hw.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-brand-purple uppercase">
                          {b?.name || 'Class Homework'}
                        </span>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">{hw.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 font-medium leading-relaxed">{hw.description}</p>
                    <div className="pt-3 border-t border-slate-50 dark:border-slate-850 flex justify-between items-center text-[10px] sm:text-xs">
                      <span className="font-semibold text-rose-500 flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Deadline: {hw.deadline}</span>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: Notice Board */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-905 dark:text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              <span>Campus Circular Bulletin Pinboard</span>
            </h3>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col space-y-3">
                  {n.isPinned && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-brand-cyan text-slate-950 text-[9px] font-bold uppercase rounded-bl-xl font-display">Special Alert</div>
                  )}
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">{n.date}</span>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">{n.title}</h4>
                  </div>
                  <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: Self Study Tracker with fill-up ring animations */}
        {activeTab === 'study' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Completion Ring Card */}
            <div className="p-6 bg-gradient-to-tr from-brand-cyan/20 to-brand-blue/20 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="50" className="stroke-slate-100 dark:stroke-slate-850" strokeWidth="10" fill="transparent" />
                  <circle cx="64" cy="64" r="50" className="stroke-cyan-500 transition-all duration-700" strokeWidth="10" 
                    strokeDasharray={2 * Math.PI * 50} 
                    strokeDashoffset={2 * Math.PI * 50 * (1 - percentComplete / 100)}
                    fill="transparent" 
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute font-display text-center leading-none">
                  <span className="block font-bold text-2xl text-slate-900 dark:text-white">{percentComplete}%</span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Done Sprints</span>
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Study Completion Sprint</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">Reviewing, solving and preparing daily targets</p>
              </div>
            </div>

            {/* Checklist with Add Action */}
            <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-850">
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Dynamic Study Sprints</h4>
                  <p className="text-xs text-slate-400">Mark done as you achieve topics</p>
                </div>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="p-1 px-3 bg-brand-cyan hover:opacity-90 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1"
                  id="toggle-add-sprint"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Sprint</span>
                </button>
              </div>

              {showAddTask && (
                <form onSubmit={handleTaskSubmit} className="p-4 bg-slate-50 dark:bg-slate-855 rounded-2xl space-y-3 border border-slate-100 dark:border-slate-800 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sprint Chapter</label>
                      <input
                        type="text"
                        required
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        placeholder="e.g. Organic Chem reaction booklets"
                        className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        id="new-task-title-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Schedule Window</label>
                      <input
                        type="text"
                        required
                        value={newTaskTime}
                        onChange={e => setNewTaskTime(e.target.value)}
                        className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        id="new-task-time-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-1.5 pt-1">
                    <button type="submit" className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 hover:opacity-95 text-white text-xs font-semibold rounded-lg">Add to checklist</button>
                  </div>
                </form>
              )}

              {/* List of Tasks */}
              <div className="space-y-2">
                {studyTasks.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => onToggleTask(st.id)}
                    className="p-4 bg-slate-55/65 dark:bg-slate-850/40 rounded-2xl flex items-center justify-between cursor-pointer border border-transparent hover:border-cyan-300 dark:hover:border-cyan-900/40 transition-all"
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`p-1.5 rounded-lg border ${st.status === 'done' ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-350 text-slate-300'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className={`block font-semibold text-xs ${st.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-205'}`}>{st.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{st.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Payment Gateway Modal triggers */}
      {selectedPayment && (
        <PaymentGatewayModal
          isOpen={isPayOpen}
          onClose={() => {
            setIsPayOpen(false);
            setSelectedPayment(null);
          }}
          language={language}
          payment={selectedPayment}
          studentName={student.name}
          batchName={batches.find(b => b.id === selectedPayment.batchId)?.name || 'Tuition Course'}
          onPaymentSuccess={(amtPaid, mthd, txn) => {
            onPayTuitionFee(selectedPayment.id, amtPaid, mthd, txn);
            setIsPayOpen(false);
            setSelectedPayment(null);
          }}
          teacher={teacher}
        />
      )}

    </div>
  );
}
