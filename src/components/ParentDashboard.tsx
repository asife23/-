import React, { useState } from 'react';
import { 
  Users, Calendar, CreditCard, MessageSquare, Star, Send, ShieldCheck, 
  HelpCircle, AlertTriangle, MessageSquareHeart, Check, ThumbsUp, Activity
} from 'lucide-react';
import { 
  Batch, StudentProfile, AttendanceRecord, PaymentRecord, ReviewRecord, 
  Language, User, ChatMessage 
} from '../types';
import { TRANSLATE_DICT } from '../data/initialData';
import ChatWindow from './ChatWindow';
import PaymentGatewayModal from './PaymentGatewayModal';
import PaymentHistoryChart from './PaymentHistoryChart';

interface ParentDashboardProps {
  language: Language;
  parent: User;
  teacher?: User;
  batches: Batch[];
  students: StudentProfile[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  reviews: ReviewRecord[];
  chats: ChatMessage[];
  onAddReview: (review: Omit<ReviewRecord, 'id' | 'date'>) => void;
  onPayTuitionFee: (paymentId: string, amount: number, method: 'bKash' | 'Nagad' | 'Rocket', trxId: string) => void;
  onSendMessage: (channelId: string, content: string, type: 'text' | 'file', name?: string, size?: string) => void;
}

export default function ParentDashboard({
  language,
  parent,
  teacher,
  batches,
  students,
  attendance,
  payments,
  reviews,
  chats,
  onAddReview,
  onPayTuitionFee,
  onSendMessage
}: ParentDashboardProps) {
  const t = TRANSLATE_DICT[language];
  const [activeTab, setActiveTab] = useState<'child' | 'ledger' | 'messaging' | 'feedback'>('child');
  
  // Gateways
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [targetTeacherId, setTargetTeacherId] = useState('teacher1');
  const [reviewPosted, setReviewPosted] = useState(false);

  // Active Chats
  const [activeChatChannel, setActiveChatChannel] = useState<string>('direct-teacher1-parent1');

  // Multi-batch child mapping
  const child = students.find(s => s.parentId === parent.id) || students[0];

  const handleReviewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddReview({
      teacherId: targetTeacherId,
      reviewerName: parent.name,
      reviewerRole: 'parent',
      rating,
      comment,
      isAnonymous
    });

    setComment('');
    setReviewPosted(true);
    setTimeout(() => setReviewPosted(false), 3000);
  };

  const triggerPaymentFlow = (p: PaymentRecord) => {
    setSelectedPayment(p);
    setIsPayOpen(true);
  };

  // Calculations for Child stats
  const childAttendance = attendance.filter(a => a.studentId === child?.id);
  const presentCount = childAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 bg-gradient-to-r from-brand-purple/10 to-brand-cyan/10 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={parent.avatar} 
            alt={parent.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-purple"
          />
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-xl text-slate-905 dark:text-white">{parent.name}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.parent} • Sibling Enrolled: <strong>{child?.name}</strong>
            </p>
          </div>
        </div>

        {/* Quick Vibe Tracker */}
        <div className="flex space-x-3">
          <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <span className="block text-[10px] text-slate-400 font-bold uppercase">Attendance Rate</span>
            <span className="font-display font-bold text-lg text-emerald-500 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500 mr-1.5" /> {attendanceRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl no-scrollbar">
        {([
          { id: 'child', label: 'Student Classroom monitoring', icon: Users },
          { id: 'ledger', label: 'Tution accounts payment', icon: CreditCard },
          { id: 'messaging', label: 'Direct query messenger', icon: MessageSquare },
          { id: 'feedback', label: t.reviews, icon: Star }
        ] as const).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-brand-purple shadow-sm'
                  : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Container */}
      <div className="transition-all duration-300">
        
        {/* Child Attendance Monitor */}
        {activeTab === 'child' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Class Attendance log: <strong>{child?.name}</strong></span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">History of class attendance and schedules</p>
            </div>

            {/* Attendance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <h4 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wide">Weekly Active Batches</h4>
                <div className="space-y-3">
                  {batches.filter(b => child?.enrolledBatchIds.includes(b.id)).map(b => (
                    <div key={b.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 block">{b.name}</span>
                        <span className="text-[10px] text-slate-400">{b.scheduleDays.join(', ')} • {b.time}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-8 w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                <h4 className="font-bold text-xs uppercase text-slate-400 mb-3 tracking-wide">Historical Register Log</h4>
                <div className="space-y-2.5">
                  {childAttendance.slice(-4).map((att) => {
                    const matchedBatch = batches.find(b => b.id === att.batchId);
                    return (
                      <div key={att.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{att.date}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{matchedBatch?.name.split(' - ')[0]}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold ${
                          att.status === 'present' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20' 
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-955/20'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Ledger Dues */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            {child && (
              <PaymentHistoryChart
                language={language}
                payments={payments}
                childId={child.id}
                batches={batches}
              />
            )}
            
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-semibold text-slate-905 dark:text-white flex items-center space-x-1.5">
                  <CreditCard className="w-5 h-5 text-indigo-500" />
                  <span>Family Tuition fee tracker ledger</span>
                </h3>
                <p className="text-xs text-slate-500">Auto-merged child accounts dashboard</p>
              </div>

              <div className="space-y-3.5">
                {payments.filter(p => p.studentId === child?.id).map((p) => {
                  const b = batches.find(bat => bat.id === p.batchId);
                  const outstanding = p.amount - p.paidAmount;
                  return (
                    <div key={p.id} className="p-5 bg-slate-55/65 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <span className="px-2.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600">Month: {p.month}</span>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white pt-1">{b?.name}</h4>
                        <p className="text-xs text-slate-405 font-mono">Ledger Code Reference: {p.id}</p>
                      </div>

                      <div className="flex items-center space-x-5">
                        <div className="text-right leading-tight">
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Pending due</span>
                          <span className={`font-display font-bold text-base ${p.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            ৳{outstanding > 0 ? outstanding : p.amount}
                          </span>
                        </div>

                        {p.status !== 'paid' ? (
                          <button
                            onClick={() => triggerPaymentFlow(p)}
                            className="px-5 py-2.5 rounded-xl font-display font-bold text-xs text-white bg-[#d12053] hover:opacity-90 shadow-sm transition-all cursor-pointer"
                            id={`parent-pay-btn-${p.id}`}
                          >
                            Complete with bKash
                          </button>
                        ) : (
                          <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-950/20 rounded-xl font-bold text-xs flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Cleared on ledger</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Teacher Direct Messengers */}
        {activeTab === 'messaging' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 text-left">
              <h3 className="font-display font-bold text-slate-900 dark:text-white px-2">Contacts Desk</h3>
              
              <div className="space-y-1">
                <button
                  onClick={() => setActiveChatChannel('direct-teacher1-parent1')}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    activeChatChannel === 'direct-teacher1-parent1'
                      ? 'bg-brand-purple/10 text-brand-purple'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500'
                  }`}
                >
                  <div>
                    <span className="block font-bold">Prof. Rafiqul Islam</span>
                    <span className="text-[10px] text-slate-400 font-medium">Course Instructor</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <ChatWindow
                language={language}
                currentUser={{ id: parent.id, name: parent.name, role: 'parent' }}
                messages={chats.filter(c => c.channelId === activeChatChannel)}
                onSendMessage={(content, type, fName, fSize) => onSendMessage(activeChatChannel, content, type, fName, fSize)}
                activeChannelName="Prof. Rafiqul Islam (Physics teacher)"
                isGroup={false}
              />
            </div>
          </div>
        )}

        {/* Ratings Feedback Reviews */}
        {activeTab === 'feedback' && (
          <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
            <div className="text-center space-y-1.5 pb-4 border-b border-slate-50 dark:border-slate-850">
              <div className="inline-flex p-3 rounded-full bg-brand-purple/10 text-brand-purple mb-1">
                <MessageSquareHeart className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">{t.addReview}</h3>
              <p className="text-xs text-slate-505">Submit constructive anonymous evaluation logs directly to Teachers</p>
            </div>

            {reviewPosted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 text-center space-y-2 text-emerald-600">
                <ThumbsUp className="w-8 h-8 mx-auto animate-bounce text-emerald-500" />
                <h4 className="font-bold text-sm">Rating submitted successfully!</h4>
                <p className="text-xs text-emerald-505">Thank you for validating of Bangladeshi academic educators structure.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewPost} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Target Teacher ID</label>
                  <select
                    value={targetTeacherId}
                    onChange={e => setTargetTeacherId(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-sm border border-slate-205 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    id="parent-review-teacher-select"
                  >
                    <option value="teacher1">Prof. Rafiqul Islam (Physics Physics)</option>
                    <option value="teacher2">Jahanara Akter Mim</option>
                    <option value="teacher3">Tanvir Ahmed sir</option>
                  </select>
                </div>

                {/* Rating selection star icons */}
                <div>
                  <span className="block text-xs font-semibold text-slate-500 mb-2">{t.ratePrompt}</span>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        className="transition-all hover:scale-110 cursor-pointer"
                        id={`star-select-${val}`}
                      >
                        <Star 
                          className={`w-7 h-7 ${val <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-505 mb-1.5">{t.commentPrompt}</span>
                  <textarea
                    required
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    placeholder="Write detailed feedback about teaching, punctuality, and syllabus completion..."
                    className="w-full px-4 py-3 rounded-2xl text-sm border border-slate-205 bg-slate-50 dark:bg-slate-905 text-slate-900 dark:text-white"
                    id="parent-review-comment"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parent-anon-checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-605"
                  />
                  <label htmlFor="parent-anon-checkbox" className="ml-2 text-xs font-medium text-slate-500">{t.isAnonPrompt}</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-purple hover:bg-indigo-600 text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-brand-purple/10"
                  id="submit-review-btn"
                >
                  <span>{t.submitReview}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* Sibling Gateway */}
      {selectedPayment && (
        <PaymentGatewayModal
          isOpen={isPayOpen}
          onClose={() => {
            setIsPayOpen(false);
            setSelectedPayment(null);
          }}
          language={language}
          payment={selectedPayment}
          studentName={child?.name || 'Your Sibling Student'}
          batchName={batches.find(b => b.id === selectedPayment.batchId)?.name || 'Tuition Course'}
          onPaymentSuccess={(amountPaid, gatewayMethod, trxId) => {
            onPayTuitionFee(selectedPayment.id, amountPaid, gatewayMethod, trxId);
            setIsPayOpen(false);
            setSelectedPayment(null);
          }}
          teacher={teacher}
        />
      )}

    </div>
  );
}
