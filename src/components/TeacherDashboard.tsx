import React, { useState } from 'react';
import { 
  Users, Calendar, CreditCard, ShieldCheck, Star, PlusCircle, CheckCircle, 
  Trash2, Send, Download, FileSpreadsheet, Plus, AlertCircle, Sparkles, Check, CheckSquare, X
} from 'lucide-react';
import { 
  Batch, StudentProfile, AttendanceRecord, PaymentRecord, ReviewRecord, 
  NoticeRecord, HomeworkRecord, Language, User, ChatMessage 
} from '../types';
import { TRANSLATE_DICT } from '../data/initialData';
import ChatWindow from './ChatWindow';

interface TeacherDashboardProps {
  language: Language;
  teacher: User;
  batches: Batch[];
  students: StudentProfile[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
  reviews: ReviewRecord[];
  notices: NoticeRecord[];
  homework: HomeworkRecord[];
  chats: ChatMessage[];
  onAddBatch: (batch: Omit<Batch, 'id' | 'teacherId'>) => void;
  onAddNotice: (notice: Omit<NoticeRecord, 'id' | 'teacherId' | 'date'>) => void;
  onAddHomework: (homework: Omit<HomeworkRecord, 'id' | 'teacherId' | 'submissionsCount'>) => void;
  onUpdateAttendance: (date: string, batchId: string, studentId: string, status: 'present' | 'absent' | 'late') => void;
  onUpdatePayment: (paymentId: string, paidAmount: number, status: PaymentRecord['status'], method?: PaymentRecord['method'], trxId?: string) => void;
  onAddManualPayment: (payment: Omit<PaymentRecord, 'id' | 'teacherId'>) => void;
  onSendMessage: (channelId: string, content: string, type: 'text' | 'file', name?: string, size?: string) => void;
  onVerifyTeacher: (nid: string, certName: string) => void;
  onUpdateTeacherProfile: (updatedTeacher: User) => void;
}

export default function TeacherDashboard({
  language,
  teacher,
  batches,
  students,
  attendance,
  payments,
  reviews,
  notices,
  homework,
  chats,
  onAddBatch,
  onAddNotice,
  onAddHomework,
  onUpdateAttendance,
  onUpdatePayment,
  onAddManualPayment,
  onSendMessage,
  onVerifyTeacher,
  onUpdateTeacherProfile
}: TeacherDashboardProps) {
  const t = TRANSLATE_DICT[language];
  const [activeTab, setActiveTab] = useState<'batches' | 'attendance' | 'payments' | 'chats' | 'notices' | 'homework' | 'verification' | 'reviews'>('batches');
  
  // States of forms
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', subject: '', fee: 2000, scheduleDays: [] as string[], time: '04:00 PM' });
  const [bDays, setBDays] = useState<Record<string, boolean>>({ Sat: false, Sun: false, Mon: false, Tue: false, Wed: false, Thu: false, Fri: false });

  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({ batchId: 'all', title: '', content: '', isPinned: false });

  const [showAddHomework, setShowAddHomework] = useState(false);
  const [newHw, setNewHw] = useState({ batchId: batches[0]?.id || '', title: '', description: '', deadline: '2026-06-05' });

  // Verification pipeline
  const [nidVal, setNidVal] = useState('');
  const [certVal, setCertVal] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Manual payment State
  const [showManualPay, setShowManualPay] = useState(false);
  const [manualPay, setManualPay] = useState({ studentId: students[0]?.id || '', batchId: batches[0]?.id || '', amount: 2000, paidAmount: 2005, month: 'May 2026', method: 'Cash' as PaymentRecord['method'] });

  // Secure Teacher receive wallet configuration (bKash & Nagad number setup)
  const [bkashInput, setBkashInput] = useState(teacher.bkashNumber || '');
  const [nagadInput, setNagadInput] = useState(teacher.nagadNumber || '');
  const [rocketInput, setRocketInput] = useState(teacher.rocketNumber || '');
  const [isWalletLocked, setIsWalletLocked] = useState(true);
  const [walletPinChallenge, setWalletPinChallenge] = useState('');
  const [walletPinError, setWalletPinError] = useState('');
  const [walletSuccessMsg, setWalletSuccessMsg] = useState('');

  React.useEffect(() => {
    setBkashInput(teacher.bkashNumber || '');
    setNagadInput(teacher.nagadNumber || '');
    setRocketInput(teacher.rocketNumber || '');
  }, [teacher.bkashNumber, teacher.nagadNumber, teacher.rocketNumber]);

  // Filter attendance states
  const [attDate, setAttDate] = useState('2026-05-28');
  const [attBatchId, setAttBatchId] = useState(batches[0]?.id || '');

  // Active chat channel
  const [activeChatChannel, setActiveChatChannel] = useState<string>('group-batch1');

  // Multi-batch combine list (Accounting calculations)
  const [autoMergeFilter, setAutoMergeFilter] = useState(true);

  // CSV exporting Logic
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,Batch Name,Month,Payment Amount,Paid Amount,Dues/Status,Method,TrxID\n";
    
    payments.forEach((p) => {
      const stud = students.find(s => s.id === p.studentId);
      const bat = batches.find(b => b.id === p.batchId);
      const row = `"${stud?.name || p.studentId}","${bat?.name || p.batchId}","${p.month}",${p.amount},${p.paidAmount},"${p.status}","${p.method || 'N/A'}","${p.trxId || 'N/A'}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tushuni_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDays = Object.keys(bDays).filter(k => bDays[k]);
    if (!newBatch.name || selectedDays.length === 0) return;
    onAddBatch({
      name: newBatch.name,
      subject: newBatch.subject || 'Academic',
      fee: Number(newBatch.fee),
      scheduleDays: selectedDays,
      time: newBatch.time
    });
    setNewBatch({ name: '', subject: '', fee: 2000, scheduleDays: [], time: '04:00 PM' });
    setBDays({ Sat: false, Sun: false, Mon: false, Tue: false, Wed: false, Thu: false, Fri: false });
    setShowAddBatch(false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    onAddNotice(newNotice);
    setNewNotice({ batchId: 'all', title: '', content: '', isPinned: false });
    setShowAddNotice(false);
  };

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHw.title || !newHw.description) return;
    onAddHomework(newHw);
    setNewHw({ batchId: batches[0]?.id || '', title: '', description: '', deadline: '2026-06-05' });
    setShowAddHomework(false);
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidVal || !certVal) return;
    setVerifying(true);
    setTimeout(() => {
      onVerifyTeacher(nidVal, certVal);
      setVerifying(false);
    }, 1500);
  };

  const handleUnlockWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletPinChallenge === '1234') {
      setIsWalletLocked(false);
      setWalletPinChallenge('');
      setWalletPinError('');
    } else {
      setWalletPinError(language === 'bn' ? 'সঠিক অ্যাকাউন্ট পিন দিন (সঠিক পিন: 1234)' : 'Incorrect account pin code (Correct PIN: 1234)');
    }
  };

  const handleSaveWalletDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherProfile({
      ...teacher,
      bkashNumber: bkashInput,
      nagadNumber: nagadInput,
      rocketNumber: rocketInput,
    });
    setIsWalletLocked(true);
    setWalletSuccessMsg(language === 'bn' ? 'মোবাইল ওয়ালেট নম্বরসমূহ সফলভাবে সংরক্ষিত এবং লক করা হয়েছে!' : 'Mobile wallets successfully saved and locked!');
    setTimeout(() => setWalletSuccessMsg(''), 4000);
  };

  const handleAddManualPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isPaid = manualPay.paidAmount >= manualPay.amount;
    const isPartial = manualPay.paidAmount > 0 && manualPay.paidAmount < manualPay.amount;
    const status: PaymentRecord['status'] = isPaid ? 'paid' : isPartial ? 'partial' : 'due';

    onAddManualPayment({
      month: manualPay.month,
      batchId: manualPay.batchId,
      studentId: manualPay.studentId,
      amount: Number(manualPay.amount),
      paidAmount: Number(manualPay.paidAmount),
      status,
      method: manualPay.method,
      trxId: 'MANUAL_CASH'
    });
    setShowManualPay(false);
  };

  // Grouped payments logic - Auto-merge simulation (consolidate parents due check)
  const getConsolidatedPayments = () => {
    if (!autoMergeFilter) return payments;
    
    // Auto-merge logic:
    // If multiple PaymentRecords are "due" or "partial" for the SAME parent ID (mapped via students list) in the Same Month,
    // consolidate them so teacher can issue standard due statement invoices.
    const parentMap: Record<string, { totalAmount: number; totalPaid: number; payRecords: PaymentRecord[] }> = {};
    
    payments.forEach(p => {
      const stud = students.find(s => s.id === p.studentId);
      if (!stud) return;
      const key = `${stud.parentId}-${p.month}`;
      
      if (!parentMap[key]) {
        parentMap[key] = { totalAmount: 0, totalPaid: 0, payRecords: [] };
      }
      parentMap[key].totalAmount += p.amount;
      parentMap[key].totalPaid += p.paidAmount;
      parentMap[key].payRecords.push(p);
    });

    return payments; // Displaying both consolidated highlights and original balances is best.
  };

  return (
    <div className="space-y-6">
      
      {/* Header Profile Section */}
      <div className="p-6 bg-gradient-to-r from-brand-purple/10 via-brand-blue/10 to-brand-cyan/10 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img 
            src={teacher.avatar} 
            alt={teacher.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-brand-purple"
          />
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">{teacher.name}</h2>
              {teacher.isVerified && (
                <span className="inline-flex p-1 rounded-full bg-blue-500 text-white" title={t.blueTick}>
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.teacher} • {teacher.phone}</p>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="flex space-x-4">
          <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <span className="block text-xs text-slate-500 font-semibold">{t.avgRating}</span>
            <span className="font-display font-bold text-lg text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 mr-1" /> {teacher.ratingAverage}
            </span>
          </div>
          <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <span className="block text-xs text-slate-500 font-semibold">{t.totalReviews}</span>
            <span className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
              {teacher.reviewCount}
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Menu Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl no-scrollbar">
        {([
          { id: 'batches', label: t.batches, icon: Users },
          { id: 'attendance', label: t.attendance, icon: Calendar },
          { id: 'payments', label: t.payments, icon: CreditCard },
          { id: 'chats', label: t.chats, icon: Send },
          { id: 'notices', label: t.notices, icon: AlertCircle },
          { id: 'homework', label: t.homework, icon: CheckSquare },
          { id: 'verification', label: t.verification, icon: ShieldCheck },
          { id: 'reviews', label: t.reviews, icon: Star }
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

      {/* Main Tab Render Grid */}
      <div className="transition-all duration-300">
        
        {/* TAB A: Batches View */}
        {activeTab === 'batches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>{t.batches}</span>
              </h3>
              <button
                onClick={() => setShowAddBatch(!showAddBatch)}
                className="px-4 py-2 bg-brand-purple hover:bg-opacity-95 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-sm shadow-brand-purple/20"
                id="toggle-add-batch"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addNewBatch}</span>
              </button>
            </div>

            {showAddBatch && (
              <form onSubmit={handleCreateBatch} className="p-6 bg-white dark:bg-slate-905 border border-indigo-100 dark:border-indigo-950/20 rounded-3xl space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t.batchName}</label>
                    <input
                      type="text"
                      required
                      value={newBatch.name}
                      onChange={e => setNewBatch({ ...newBatch, name: e.target.value })}
                      placeholder="e.g. Class 11 Physics A"
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                      id="new-batch-name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t.subject}</label>
                    <input
                      type="text"
                      required
                      value={newBatch.subject}
                      onChange={e => setNewBatch({ ...newBatch, subject: e.target.value })}
                      placeholder="e.g. Higher Match"
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                      id="new-batch-subject"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{language === 'bn' ? 'বেতন (৳ BDT)' : 'Monthly Tuition Fee (৳ BDT)'}</label>
                    <input
                      type="number"
                      required
                      value={newBatch.fee}
                      onChange={e => setNewBatch({ ...newBatch, fee: Number(e.target.value) })}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                      id="new-batch-fee"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">{t.weeklySchedule}</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(bDays).map((day) => (
                      <label 
                        key={day}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                          bDays[day]
                            ? 'bg-brand-purple/15 border-brand-purple text-brand-purple'
                            : 'border-slate-200 text-slate-500 hover:border-slate-350'
                        }`}
                        id={`day-select-${day.toLowerCase()}`}
                      >
                        <input
                          type="checkbox"
                          checked={bDays[day]}
                          onChange={(e) => setBDays({ ...bDays, [day]: e.target.checked })}
                          className="hidden"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddBatch(false)}
                    className="px-4 py-2 text-xs font-medium rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    id="cancel-batch-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-brand-purple hover:bg-opacity-95"
                    id="save-batch-btn"
                  >
                    Add Batch
                  </button>
                </div>
              </form>
            )}

            {/* Grid of Batches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map((b) => {
                const bStudents = students.filter(s => s.enrolledBatchIds.includes(b.id));
                return (
                  <div key={b.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/30 text-brand-purple uppercase">
                          {b.subject}
                        </span>
                        <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-2">{b.name}</h4>
                      </div>
                      <span className="font-display font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-3.5 py-1.5 rounded-2xl text-base">
                        ৳{b.fee}
                      </span>
                    </div>

                    <div className="flex gap-4 text-xs text-slate-500">
                      <div>
                        <span className="block font-semibold text-slate-400">Class Hours:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{b.time}</span>
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-400">Weekdays:</span>
                        <span className="font-medium text-slate-705 dark:text-slate-300">{b.scheduleDays.join(', ')}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-slate-850 flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-500">{t.enrolledStudents}: <strong>{bStudents.length} Students</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB B: Attendance Register */}
        {activeTab === 'attendance' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-50 dark:border-slate-800">
              <div>
                <h3 className="font-display font-semibold text-lg text-slate-905 dark:text-white">{t.attendance}</h3>
                <p className="text-xs text-slate-500">View and update daily student checkins</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2.5">
                <input
                  type="date"
                  value={attDate}
                  onChange={(e) => setAttDate(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white"
                  id="att-date-filter"
                />
                <select
                  value={attBatchId}
                  onChange={(e) => setAttBatchId(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-white"
                  id="att-batch-filter"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance Register table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                    <th className="py-3 px-2">Student Name</th>
                    <th className="py-3 px-2">Phone No</th>
                    <th className="py-3 px-2">Status Log</th>
                    <th className="py-3 px-2 text-right">Action status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
                  {students.filter(s => s.enrolledBatchIds.includes(attBatchId)).map((stud) => {
                    const record = attendance.find(a => a.studentId === stud.id && a.date === attDate && a.batchId === attBatchId);
                    
                    return (
                      <tr key={stud.id} className="text-sm">
                        <td className="py-3.5 px-2 font-display font-semibold text-slate-800 dark:text-slate-100">{stud.name}</td>
                        <td className="py-3.5 px-2 text-xs font-mono text-slate-500">{stud.phone}</td>
                        <td className="py-3.5 px-2">
                          {record ? (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                              record.status === 'present' 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                : record.status === 'late'
                                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                            }`}>
                              {record.status}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-405 font-medium italic">Unrecorded</span>
                          )}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex justify-end gap-1.5">
                            {(['present', 'absent', 'late'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => onUpdateAttendance(attDate, attBatchId, stud.id, st)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                                  record?.status === st
                                    ? st === 'present'
                                      ? 'bg-emerald-500 text-white'
                                      : st === 'absent'
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-amber-500 text-white'
                                    : 'border border-slate-200 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                                id={`set-att-${stud.id}-${st}`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB C: Smart Accounting Ledger (Tuition Fee tracker) */}
        {activeTab === 'payments' && (
          <div className="space-y-4">

            {/* Securing receiver wallets numbers settings panel */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-slate-850">
                <div className="text-left">
                  <h4 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="p-1.5 bg-pink-500/10 text-pink-500 rounded-lg">🔒</span>
                    <span>{language === 'bn' ? 'ব্যক্তিগত মোবাইল ওয়ালেট নম্বর সেটআপ (সুরক্ষিত)' : 'Merchant Mobile Wallets Setup (Locked)'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'bn' 
                      ? 'অবিভাবকদের ফি পেমেন্টের জন্য আপনার নম্বর দিন। এটি পরিবর্তন করা পিন দিয়ে সংরক্ষিত।' 
                      : 'Set numbers for automatic parent payments. Only account owner can change these.'}
                  </p>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isWalletLocked ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'}`}>
                  {isWalletLocked 
                    ? (language === 'bn' ? '🔒 লকড (সুরক্ষিত)' : '🔒 LOCKED (SECURE)') 
                    : (language === 'bn' ? '🔓 আনলকড (সম্পাদনা করুন)' : '🔓 UNLOCKED (EDIT MODE)')}
                </span>
              </div>

              {walletSuccessMsg && (
                <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 text-emerald-600 rounded-xl font-medium">
                  {walletSuccessMsg}
                </div>
              )}

              {isWalletLocked ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-850/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="text-left space-y-2">
                    <div className="flex flex-wrap gap-4 text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-300">bKash (বিকাশ): <strong className="text-pink-600 font-mono font-bold">{bkashInput || 'Not Provisioned'}</strong></span>
                      <span className="text-slate-600 dark:text-slate-300">Nagad (নগদ): <strong className="text-orange-500 font-mono font-bold">{nagadInput || 'Not Provisioned'}</strong></span>
                      <span className="text-slate-600 dark:text-slate-300">Rocket (রকেট): <strong className="text-purple-600 font-mono font-bold">{rocketInput || 'Not Provisioned'}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {language === 'bn' 
                        ? '※ পেমেন্ট সিকিউরিটি সুরক্ষার কারণে অন্য কেউ আপনার নম্বর পরিবর্তন করতে পারবে না।' 
                        : '※ To prevent fraud or unauthorized updates, these fields require owner identification.'}
                    </p>
                  </div>

                  <form onSubmit={handleUnlockWallet} className="flex gap-2 self-start md:self-center">
                    <input
                      type="password"
                      placeholder={language === 'bn' ? 'অ্যাকাউন্ট পিন (1234)' : 'Account secret PIN (1234)'}
                      value={walletPinChallenge}
                      onChange={e => setWalletPinChallenge(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-slate-205 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-center tracking-widest w-40 text-slate-950 dark:text-white"
                      id="wallet-unlock-pin"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-slate-950 dark:bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-all cursor-pointer"
                      id="wallet-unlock-btn"
                    >
                      {language === 'bn' ? 'আনলক' : 'Unlock'}
                    </button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleSaveWalletDetails} className="space-y-4 text-left p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-indigo-950/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-505 mb-1">bKash Receiver Number</label>
                      <input
                        type="text"
                        value={bkashInput}
                        onChange={e => setBkashInput(e.target.value)}
                        placeholder="e.g. 017xxxxxxxx"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-205 bg-white dark:bg-slate-900 text-slate-955 dark:text-white font-mono"
                        id="bkash-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-505 mb-1">Nagad Receiver Number</label>
                      <input
                        type="text"
                        value={nagadInput}
                        onChange={e => setNagadInput(e.target.value)}
                        placeholder="e.g. 017xxxxxxxx"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-205 bg-white dark:bg-slate-900 text-slate-955 dark:text-white font-mono"
                        id="nagad-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-505 mb-1">Rocket Receiver Number</label>
                      <input
                        type="text"
                        value={rocketInput}
                        onChange={e => setRocketInput(e.target.value)}
                        placeholder="e.g. 017xxxxxxxx"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-205 bg-white dark:bg-slate-900 text-slate-955 dark:text-white font-mono"
                        id="rocket-input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[11px] text-amber-500 font-semibold">
                      {language === 'bn' 
                        ? '⚠ সংরক্ষণের সাথে সাথে প্যানেল স্বয়ংক্রিয়ভাবে লক হয়ে যাবে।' 
                        : '⚠ Saving will instantly lock the numbers to ensure secure persistence.'}
                    </p>
                    <div className="flex gap-2 font-semibold text-xs">
                      <button
                        type="button"
                        onClick={() => setIsWalletLocked(true)}
                        className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-200 transition-all font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-brand-purple text-white font-bold hover:opacity-95 transition-all shadow-md shadow-brand-purple/10"
                        id="save-wallets-btn"
                      >
                        {language === 'bn' ? 'সংরক্ষণ ও লক 🔒' : 'Save & Lock 🔒'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {walletPinError && (
                <p className="text-xs text-red-500 font-bold text-left">{walletPinError}</p>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-50 dark:border-slate-800 gap-3">
                <div>
                  <h3 className="font-display font-semibold text-lg text-slate-950 dark:text-white flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-indigo-500" />
                    <span>{t.accountBook}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Record, organize and export tuition fee statements</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* CSV Export Action Trigger */}
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all cursor-pointer flex items-center space-x-2"
                    id="export-csv-btn"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel/CSV</span>
                  </button>

                  <button
                    onClick={() => setShowManualPay(!showManualPay)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                    id="add-payment-invoice-btn"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Manual Ledger</span>
                  </button>
                </div>
              </div>

              {/* Auto Merge Toggle banner for multi-batch students */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-5 h-5 text-brand-purple" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">{t.autoMergeActive}</span>
                    <span className="text-[10px] text-slate-500">Aggregates sibling/multiple tuition records under single unified account.</span>
                  </div>
                </div>
              </div>

              {/* Add manual payment overlay */}
              {showManualPay && (
                <form onSubmit={handleAddManualPaySubmit} className="p-5 bg-slate-50 dark:bg-slate-850/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.studentSelector}</label>
                      <select
                        value={manualPay.studentId}
                        onChange={e => setManualPay({ ...manualPay, studentId: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white"
                        id="select-stud-manual"
                      >
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.batchSelector}</label>
                      <select
                        value={manualPay.batchId}
                        onChange={e => setManualPay({ ...manualPay, batchId: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white"
                        id="select-batch-manual"
                      >
                        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.month}</label>
                      <input
                        type="text"
                        value={manualPay.month}
                        onChange={e => setManualPay({ ...manualPay, month: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white"
                        id="select-month-manual"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{t.paymentMethod}</label>
                      <select
                        value={manualPay.method}
                        onChange={e => setManualPay({ ...manualPay, method: e.target.value as PaymentRecord['method'] })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white"
                        id="select-method-manual"
                      >
                        <option value="Cash">Cash (নগদ নগদ)</option>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{language === 'bn' ? 'বেতন পরিমাণ (৳)' : 'Course Fee (৳)'}</label>
                      <input
                        type="number"
                        value={manualPay.amount}
                        onChange={e => setManualPay({ ...manualPay, amount: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white font-mono"
                        id="select-amount-manual"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">{language === 'bn' ? 'আদায় করা হয়েছে (৳)' : 'Collected Amount (৳)'}</label>
                      <input
                        type="number"
                        value={manualPay.paidAmount}
                        onChange={e => setManualPay({ ...manualPay, paidAmount: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-955 dark:text-white font-mono"
                        id="select-paid-manual"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-1.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManualPay(false)}
                      className="px-4 py-2 text-xs font-medium rounded-xl text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold rounded-xl text-white bg-brand-purple hover:bg-indigo-600"
                    >
                      Record In Ledger
                    </button>
                  </div>
                </form>
              )}

              {/* Transactions Ledger Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Batch Name</th>
                      <th className="py-2.5">Month</th>
                      <th className="py-2.5">Invoice Amount</th>
                      <th className="py-2.5">Received</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Quick action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-850 text-sm">
                    {getConsolidatedPayments().map((p) => {
                      const stud = students.find(s => s.id === p.studentId);
                      const bat = batches.find(b => b.id === p.batchId);
                      return (
                        <tr key={p.id}>
                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-100">{stud?.name || p.studentId}</td>
                          <td className="py-3 text-xs text-slate-500">{bat?.name || 'Academic Batch'}</td>
                          <td className="py-3 text-xs font-medium text-slate-600 dark:text-slate-400">{p.month}</td>
                          <td className="py-3 font-mono font-semibold">৳{p.amount}</td>
                          <td className="py-3 font-mono text-emerald-600 dark:text-emerald-400">৳{p.paidAmount}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                              p.status === 'paid'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                                : p.status === 'partial'
                                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                                : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {p.status !== 'paid' && (
                              <button
                                onClick={() => onUpdatePayment(p.id, p.amount, 'paid', 'Cash', 'CASH_RECEIVED')}
                                className="px-2 py-1 text-[10px] rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-all uppercase"
                                id={`quick-receive-${p.id}`}
                              >
                                {language === 'bn' ? 'উসুল' : 'Received'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* TAB D: Real-time Messenger Linkage */}
        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sidebar Contacts List */}
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white px-2 mb-2">{t.chats}</h3>
              
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">{t.groupMessages}</span>
                <button
                  onClick={() => setActiveChatChannel('group-batch1')}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    activeChatChannel === 'group-batch1'
                      ? 'bg-brand-purple/10 text-brand-purple'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>Physics Course Alpha Group</span>
                  <span className="p-1 rounded-full bg-cyan-500 w-2 h-2" />
                </button>
              </div>

              <div className="space-y-1 pt-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">{t.directMessages}</span>
                {students.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveChatChannel(`direct-teacher1-${st.parentId}`)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      activeChatChannel === `direct-teacher1-${st.parentId}`
                        ? 'bg-brand-purple/10 text-brand-purple'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Parent of {st.name.split(' ')[0]}</span>
                    <span className="text-[9px] bg-slate-150 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">Chat</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Window */}
            <div className="lg:col-span-2">
              <ChatWindow
                language={language}
                currentUser={{ id: teacher.id, name: teacher.name, role: 'teacher' }}
                messages={chats.filter(c => c.channelId === activeChatChannel)}
                onSendMessage={(content, type, fName, fSize) => onSendMessage(activeChatChannel, content, type, fName, fSize)}
                activeChannelName={
                  activeChatChannel.startsWith('group-') 
                    ? 'Physics Batch Alpha (Circular)'
                    : 'Gurdian (Mrs. Shirin Hasan)'
                }
                isGroup={activeChatChannel.startsWith('group-')}
                smsGatewayActive={true}
                onSendSmsAlert={(msg) => console.log('Offline Parent SMS Delivered via Greenweb Gateway:', msg)}
              />
            </div>

          </div>
        )}

        {/* TAB E: Urgent Announcement Bulletin Board */}
        {activeTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-indigo-500" />
                <span>{t.notices}</span>
              </h3>
              <button
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm shadow-brand-purple/20"
                id="toggle-add-notice"
              >
                <Plus className="w-4 h-4" />
                <span>New Circular</span>
              </button>
            </div>

            {showAddNotice && (
              <form onSubmit={handleCreateNotice} className="p-6 bg-white dark:bg-slate-905 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Target Batch group</label>
                    <select
                      value={newNotice.batchId}
                      onChange={e => setNewNotice({ ...newNotice, batchId: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                      id="notice-batch-select"
                    >
                      <option value="all">Broad-Notice (All Batches)</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newNotice.title}
                      onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                      id="new-notice-title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Announcement Content</label>
                  <textarea
                    required
                    value={newNotice.content}
                    onChange={e => setNewNotice({ ...newNotice, content: e.target.value })}
                    rows={3}
                    placeholder="Type details in Bangla or English..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                    id="new-notice-content"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pin-status-checkbox"
                    checked={newNotice.isPinned}
                    onChange={e => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-650"
                  />
                  <label htmlFor="pin-status-checkbox" className="ml-2 text-xs font-medium text-slate-500">Pin to Notice Board header</label>
                </div>

                <div className="flex justify-end space-x-1.5 pt-2">
                  <button type="button" onClick={() => setShowAddNotice(false)} className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-brand-purple hover:bg-indigo-600 rounded-xl">Broadcast Circular</button>
                </div>
              </form>
            )}

            {/* List of active circulars */}
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col space-y-3 relative overflow-hidden">
                  {n.isPinned && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-brand-purple text-white text-[9px] font-bold uppercase rounded-bl-xl">Pinned notice</div>
                  )}
                  
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{n.date}</span>
                    <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">{n.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB F: Homework Grid */}
        {activeTab === 'homework' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-indigo-500" />
                <span>{t.homework} assignments</span>
              </h3>
              <button
                onClick={() => setShowAddHomework(!showAddHomework)}
                className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm shadow-brand-purple/20"
                id="toggle-add-homework"
              >
                <Plus className="w-4 h-4" />
                <span>Add Homework</span>
              </button>
            </div>

            {showAddHomework && (
              <form onSubmit={handleCreateHw} className="p-6 bg-white dark:bg-slate-905 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Select Batch</label>
                    <select
                      value={newHw.batchId}
                      onChange={e => setNewHw({ ...newHw, batchId: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                      id="homework-batch-select"
                    >
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Homework Topic Name</label>
                    <input
                      type="text"
                      required
                      value={newHw.title}
                      onChange={e => setNewHw({ ...newHw, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                      id="new-hw-title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Deadline Date</label>
                    <input
                      type="date"
                      required
                      value={newHw.deadline}
                      onChange={e => setNewHw({ ...newHw, deadline: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                      id="new-hw-deadline"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Problem Statements / Homework Description</label>
                  <textarea
                    required
                    value={newHw.description}
                    onChange={e => setNewHw({ ...newHw, description: e.target.value })}
                    rows={3}
                    placeholder="List book exercises or special guidelines..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                    id="new-hw-description"
                  />
                </div>

                <div className="flex justify-end space-x-1.5 pt-2">
                  <button type="button" onClick={() => setShowAddHomework(false)} className="px-4 py-2 text-xs text-slate-500 hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-brand-purple hover:bg-indigo-600 rounded-xl">Assign Homework</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homework.map((hw) => {
                const targetBatch = batches.find(b => b.id === hw.batchId);
                return (
                  <div key={hw.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600 uppercase">
                        {targetBatch?.name || 'Class Match'}
                      </span>
                      <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mt-2">{hw.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 hover:text-slate-850 dark:text-slate-400 font-medium leading-relaxed">{hw.description}</p>
                    <div className="pt-3 border-t border-slate-50 dark:border-slate-850 flex justify-between items-center text-[11px] font-semibold">
                      <span className="text-rose-500">Deadline: {hw.deadline}</span>
                      <span className="text-slate-400">Submissions: {hw.submissionsCount}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* TAB G: Verification Pipeline */}
        {activeTab === 'verification' && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-brand-purple/10 text-brand-purple mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{t.verifyTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">{t.verifySub}</p>
            </div>

            {teacher.isVerified ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center space-y-3">
                <div className="inline-flex p-2.5 bg-emerald-500 text-white rounded-full animate-pulse">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-400">{language === 'bn' ? 'প্রোফাইল সম্পূর্ণ ভেরিফাইড!' : 'Profile Fully Verified!'}</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Your Blue Badge is now active & visible on all student queries.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitVerification} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t.nidLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1993451290"
                      value={nidVal}
                      onChange={e => setNidVal(e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-205 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                      id="verify-nid-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t.certificateLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BSc in Physics, Dhaka University"
                      value={certVal}
                      onChange={e => setCertVal(e.target.value)}
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-205 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 text-slate-900 dark:text-white"
                      id="verify-cert-input"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-650 transition-all cursor-pointer">
                  <Plus className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <span className="block text-xs font-semibold text-slate-500">{t.uploadDrag}</span>
                  <span className="block text-[10px] text-slate-400 mt-1">NID_Front.pdf, Academic_Certificate.jpg</span>
                </div>

                <button
                  type="submit"
                  disabled={verifying || !nidVal || !certVal}
                  className="w-full py-3 bg-brand-purple hover:bg-opacity-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-purple/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                  id="submit-verif-docs"
                >
                  {verifying ? (
                    <span>Verifying and approving...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.submitDoc}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB H: Verified Ratings & Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-905 dark:text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>{t.reviews}</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-purple font-bold flex items-center justify-center text-xs">
                        {rev.isAnonymous ? 'A' : rev.reviewerName.slice(0, 1)}
                      </div>
                      <div>
                        <span className="block font-semibold text-slate-800 dark:text-slate-105 text-sm">
                          {rev.isAnonymous ? `${t.anonymous}` : rev.reviewerName}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase font-mono">{rev.reviewerRole}</span>
                      </div>
                    </div>

                    {/* Rendering stars */}
                    <div className="flex items-center space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(rev.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm italic text-slate-650 dark:text-slate-350 bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-2xl">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
