import React, { useState } from 'react';
import { 
  Search, Plus, MapPin, BookOpen, Clock, Phone, UserCheck, Trash2, 
  Sparkles, Filter, CheckCircle, Briefcase, RefreshCw, Layers, 
  ShieldCheck, FileText, Award, ShieldAlert, CheckCircle2, Lock
} from 'lucide-react';
import { Circular, Language, User } from '../types';

interface TuitionCircularsBoardProps {
  language: Language;
  currentUser: User; // The active simulated user
  circulars: Circular[];
  onAddCircular: (c: Omit<Circular, 'id' | 'creatorId' | 'creatorName' | 'creatorRole' | 'creatorAvatar' | 'datePosted' | 'applicants'>) => void;
  onApplyCircular: (circularId: string, applicant: { userId: string; userName: string; userPhone: string; userRole: string }) => void;
  onDeleteCircular: (circularId: string) => void;
}

export default function TuitionCircularsBoard({
  language,
  currentUser,
  circulars,
  onAddCircular,
  onApplyCircular,
  onDeleteCircular
}: TuitionCircularsBoardProps) {
  const isBn = language === 'bn';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tuition_needed' | 'tutor_available'>('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  // Interactive certificate expander state
  const [expandedCertId, setExpandedCertId] = useState<string | null>(null);

  // Form states for creating a circular
  const [showForm, setShowForm] = useState(false);
  
  // Safety rule: if non-teacher, set form type to ONLY tuition_needed.
  const [formType, setFormType] = useState<'tuition_needed' | 'tutor_available'>(
    currentUser.role === 'teacher' ? 'tutor_available' : 'tuition_needed'
  );
  const [subjectInput, setSubjectInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [salaryInput, setSalaryInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [phoneInput, setPhoneInput] = useState(currentUser.phone || '');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Extract unique subjects & classes for filters
  const subjects = ['all', ...Array.from(new Set(circulars.map(c => c.subject.split('(')[0].trim())))];
  const classes = ['all', ...Array.from(new Set(circulars.map(c => c.class.split('(')[0].trim())))];

  // Helper function to extract or mock certificate info for teacher accounts
  const getTeacherVerificationData = (id: string, name: string) => {
    if (id === 'teacher1' || name.includes('রফিকুল')) {
      return {
        qualification: isBn ? 'এমএসসি (পদার্থবিজ্ঞান ১ম শ্রেণী, ঢাকা বিশ্ববিদ্যালয়)' : 'M.Sc (Physics 1st Class, Dhaka University)',
        nidNumber: 'NID-XXXX-XXXX-8972',
        certificateName: 'DU_PHYSICS_GRAD_CERT_2015.pdf',
        authority: isBn ? 'ঢাকা শিক্ষা বোর্ড ও টিশনি এডু কমিটি' : 'Dhaka Board of Education & Tushuni Review Board',
        verifiedDate: '2026-03-12'
      };
    }
    if (id === 'teacher2' || name.includes('সাদিয়া')) {
      return {
        qualification: isBn ? 'বিএসসি কেমিক্যাল ইঞ্জিনিয়ারিং ৩য় বর্ষ (বুয়েট)' : 'B.Sc Chemical Engineering 3rd Year (BUET)',
        nidNumber: 'NID-XXXX-XXXX-2144',
        certificateName: 'BUET_STUDENT_ID_PROOF_2024.pdf',
        authority: isBn ? 'বুয়েট রেজিস্ট্রি ও টিশনি বোর্ড' : 'BUET Academic Registry & Tushuni Verification Module',
        verifiedDate: '2026-04-18'
      };
    }
    // Dynamic newly signed up teachers
    return {
      qualification: isBn ? 'ইন্টারন্যাশনাল স্ট্যান্ডার্ড এডুকেটর (Tushuni Registered)' : 'International Standards Verified Tutor (Tushuni Registered)',
      nidNumber: 'NID-XXXX-XXXX-0099',
      certificateName: 'TUSHUNI_EDUCATOR_CRED_DOC.pdf',
      authority: isBn ? 'তশনি ভেরিফিকেশন টিম' : 'Tushuni Verification Team',
      verifiedDate: new Date().toISOString().split('T')[0]
    };
  };

  // Filter circulars list
  const filteredCirculars = circulars.filter(c => {
    // Type Filter
    if (filterType !== 'all' && c.type !== filterType) return false;
    
    // Subject Filter
    if (filterSubject !== 'all' && !c.subject.toLowerCase().includes(filterSubject.toLowerCase())) return false;
    
    // Class Filter
    if (filterClass !== 'all' && !c.class.toLowerCase().includes(filterClass.toLowerCase())) return false;

    // Search query
    const query = searchTerm.toLowerCase();
    if (query) {
      return (
        c.subject.toLowerCase().includes(query) ||
        c.class.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.creatorName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput || !classInput || !salaryInput || !locationInput || !phoneInput || !descriptionInput) {
      setFormError(isBn ? 'অনুগ্রহ করে সকল ঘর পূরণ করুন।' : 'Please fill all fields.');
      return;
    }

    // Double security role enforcement
    const enforcedType = currentUser.role === 'teacher' ? 'tutor_available' : 'tuition_needed';

    onAddCircular({
      type: enforcedType,
      subject: subjectInput,
      class: classInput,
      salary: salaryInput,
      location: locationInput,
      phone: phoneInput,
      description: descriptionInput,
      status: 'active'
    });

    setFormSuccess(isBn ? 'সার্কুলারটি সফলভাবে পোস্ট করা হয়েছে!' : 'Circular successfully posted!');
    setSubjectInput('');
    setClassInput('');
    setSalaryInput('');
    setLocationInput('');
    setDescriptionInput('');
    setFormError('');
    setTimeout(() => {
      setFormSuccess('');
      setShowForm(false);
    }, 2000);
  };

  const handleApply = (circularId: string) => {
    onApplyCircular(circularId, {
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userRole: currentUser.role
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Hero Section */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-brand-purple to-purple-900 rounded-3xl text-white relative overflow-hidden shadow-md text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Briefcase className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-3.5 max-w-2xl">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isBn ? 'সার্কুলার ও টিউটর কানেক্ট' : 'Tushuni Recruitment Loop'}</span>
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight">
            {isBn 
              ? 'খুঁজে নিন আপনার সেরা টিউশনি অথবা দক্ষ বিশ্বস্ত টিউটর' 
              : 'Find Prime Tuition Inquiries or Verified Professional Educators'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium">
            {isBn 
              ? 'আমাদের সার্কুলার বোর্ডে শিক্ষকেরা সরাসরি ব্যাচ ঘোষণা করতে পারেন এবং অভিভাবক/শিক্ষার্থীরা টিউশন নিয়োগের জন্য সরাসরি বিজ্ঞপ্তি প্রকাশ করতে পারেন।' 
              : 'Our open job board allows teachers to announce slot vacancies, and lets students/parents post learning requirements.'}
          </p>

          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                setFormType(currentUser.role === 'teacher' ? 'tutor_available' : 'tuition_needed');
                setShowForm(!showForm);
              }}
              className="px-5 py-2.5 bg-white text-brand-purple hover:bg-slate-50 rounded-2xl font-display font-extrabold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              id="toggle-post-circular-btn"
            >
              <Plus className="w-4 h-4 font-bold" />
              <span>
                {isBn 
                  ? (currentUser.role === 'teacher' ? 'নতুন ব্যাচ/টিউটর টিপস পোস্ট করুন' : 'টিউটর নিয়োগের বিজ্ঞপ্তি দিন') 
                  : (currentUser.role === 'teacher' ? 'Post Tutor Slot' : 'Request a Tutor')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Write Post Circular Form */}
      {showForm && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-indigo-100 dark:border-slate-800 shadow-md space-y-4 animate-fade-in text-left">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-purple" />
              <span>
                {isBn 
                  ? (currentUser.role === 'teacher' ? 'নতুন ব্যাচ/পড়ানোর বিজ্ঞপ্তি তৈরি করুন' : 'টিউটর চেয়ে নিয়োগ বিজ্ঞপ্তি দিন') 
                  : (currentUser.role === 'teacher' ? 'Create Tutor Availability Notice' : 'Post Tuition Requirement Circular')}
              </span>
            </h3>
            <button 
              onClick={() => setShowForm(false)}
              className="px-2.5 py-1 text-xs rounded-xl bg-slate-105 hover:bg-slate-205 dark:bg-slate-800 text-slate-500 cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Core Security Role Access locks indicator (Students cannot pose as teachers) */}
          <div className={`p-4 rounded-2xl border text-xs leading-normal flex items-start gap-3 ${
            currentUser.role === 'teacher' 
              ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-100 text-sky-700 dark:text-sky-400' 
              : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 text-amber-700 dark:text-amber-400'
          }`}>
            <span className="text-base">🛡️</span>
            <div>
              <p className="font-extrabold flex items-center gap-1.5">
                {currentUser.role === 'teacher' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{isBn ? 'শিক্ষক প্রোফাইল নিরাপত্তা মোড সক্রিয়' : 'Educator Anti-Spoof System On'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>{isBn ? 'নিরাপত্তা লক: শিক্ষার্থী ও অভিভাবক প্রোফাইল মোড' : 'Protected Loop: Student/Parent Enrolled Profile'}</span>
                  </>
                )}
              </p>
              <p className="mt-1 opacity-90 font-medium">
                {isBn 
                  ? (currentUser.role === 'teacher' 
                      ? 'পড়ানোর অফার দেওয়ার জন্য আপনার সার্টিফিকেট ও শিক্ষাগত প্রমাণপত্র স্বয়ংক্রিয়ভাবে অভিভাবক ও শিক্ষার্থীদের কাছে দৃশ্যমান করা হবে।' 
                      : 'ছাত্রদের শিক্ষক সেজে ছদ্ম পোস্ট করা রোধ করতে আপনি শুধুমাত্র টিউটর নিয়োগের রিকুয়েস্ট দিতে পারবেন। শিক্ষক হয়ে বিজ্ঞপ্তি দেওয়ার অপশন লক করা রয়েছে।')
                  : (currentUser.role === 'teacher' 
                      ? 'Your registered university certificates and National ID verification state are dynamically linked as proof.' 
                      : 'To prevent student profiles from pretending to be tutors, you are only allowed to post Tuition Requests. Educator slot offers are locked.')}
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/20 rounded-xl font-medium border border-red-100 animate-shake">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="p-3 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl font-medium border border-emerald-100">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  {isBn ? 'বিষয়সমূহ (যেমন: পদার্থবিজ্ঞান ও কেমিস্ট্রি)' : 'Subjects (e.g., Physics & Chemistry)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics, ICT, Biology"
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                  id="circular-subject"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  {isBn ? 'শ্রেণী/ক্লাস (যেমন: Class 9)' : 'Grade / Class (e.g. Class 10)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class 9, HSC 1st Year, Class 5"
                  value={classInput}
                  onChange={e => setClassInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                  id="circular-class"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  {isBn ? 'সম্মানী/বেতন (মাসিক)' : 'Expected Salary / Budget (Monthly)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. ৳4,000 / Month, Negotiable"
                  value={salaryInput}
                  onChange={e => setSalaryInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                  id="circular-salary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  {isBn ? 'লোকেশন এবং এলাকা' : 'Location & Area'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mirpur, Dhaka / Remote"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                  id="circular-location"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {isBn ? 'যোগাযোগের মোবাইল নম্বর (নিরাপদ: পরিবর্তনযোগ্য নয়)' : 'Contact Phone Number'}
              </label>
              <input
                type="text"
                value={phoneInput}
                disabled
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-mono"
                id="circular-phone"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isBn 
                  ? '※ নিরাপত্তার জন্য অন্য কেউ যেন অন্যের মোবাইল নম্বর ব্যবহার না করতে পারে, তাই আপনার একাউন্টের সংরক্ষিত নম্বরটিই এখানে স্বয়ংক্রিয়ভাবে ব্যবহৃত হচ্ছে।' 
                  : '※ For identity safety, only your registered account phone number is loaded here to prevent spoofing.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                {isBn ? 'বিস্তারিত বর্ণনা (দিন সংখ্যা, প্রয়োজনীয় যোগ্যতা ইত্যাদি)' : 'Circular Details / Requirements'}
              </label>
              <textarea
                rows={3}
                placeholder={isBn ? 'সপ্তহে ৩ দিন পড়াতে হবে। ক্লাস টেস্ট নেওয়া হবে ও শিট দেওয়া হবে...' : 'Enter tutor experience criteria, schedules, preferred university, free trial classes...'}
                value={descriptionInput}
                onChange={e => setDescriptionInput(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                id="circular-desc"
              />
            </div>

            <div className="flex justify-end gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-550 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border-slate-850 cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-md shadow-brand-purple/10 hover:opacity-95 cursor-pointer"
                id="submit-circular-btn"
              >
                {isBn ? 'পোস্ট করুন 🚀' : 'Post Circular 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm flex flex-col gap-4 text-left">
        
        {/* Core Search & Mode Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'সার্কুলার খুঁজুন (যেমন: Physics, Mirpur)' : 'Search by subject, place, tutor name...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 text-slate-900 dark:text-white"
              id="search-circulars-input"
            />
          </div>

          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 self-start md:self-center">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'all' ? 'bg-white dark:bg-slate-850 shadow-sm text-brand-purple' : 'text-slate-550'}`}
            >
              {isBn ? 'সব পোস্ট' : 'All Circulars'}
            </button>
            <button
              onClick={() => setFilterType('tutor_available')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'tutor_available' ? 'bg-white dark:bg-slate-850 shadow-sm text-brand-purple' : 'text-slate-550'}`}
            >
              {isBn ? 'শিক্ষকেরা দিয়েছেন (Tutor Available)' : 'Tutors Available'}
            </button>
            <button
              onClick={() => setFilterType('tuition_needed')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterType === 'tuition_needed' ? 'bg-white dark:bg-slate-850 shadow-sm text-indigo-505' : 'text-slate-550'}`}
            >
              {isBn ? 'টিউটর প্রয়োজন (Tuition Request)' : 'Tuitions Request'}
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-slate-50 dark:border-slate-850">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফিল্টার:' : 'Quick Filters:'}</span>
          </span>

          {/* Subject Dropdown */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-tight font-semibold">{isBn ? 'বিষয়:' : 'Subject:'}</span>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300 font-semibold"
            >
              <option value="all">{isBn ? 'সকল বিষয়' : 'All Subjects'}</option>
              {subjects.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-tight font-semibold">{isBn ? 'ক্লাস:' : 'Class:'}</span>
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300 font-semibold"
            >
              <option value="all">{isBn ? 'সকল ক্লাস' : 'All Classes'}</option>
              {classes.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterSubject('all');
              setFilterClass('all');
            }}
            className="text-[11px] text-slate-400 font-bold ml-auto hover:text-red-500 transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{isBn ? 'রিসেট' : 'Reset Filters'}</span>
          </button>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
        {filteredCirculars.length > 0 ? (
          filteredCirculars.map((c) => {
            const isCreator = c.creatorId === currentUser.id;
            const hasApplied = c.applicants.some(a => a.userId === currentUser.id);
            const isTeacher = c.creatorRole === 'teacher';
            const teachData = isTeacher ? getTeacherVerificationData(c.creatorId, c.creatorName) : null;
            const isCertExpanded = expandedCertId === c.id;

            return (
              <div 
                key={c.id} 
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Header Information */}
                <div>
                  
                  {/* Highly polished verified educator ribbon / stamp on the background */}
                  {isTeacher && (
                    <div className="absolute top-0 right-0 py-1.5 px-3 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-bl-2xl flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isBn ? 'সার্টিফিকেট ভেরিফাইড' : 'CERTIFICATE VERIFIED'}</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3 mb-3.5 pr-20">
                    <div className="flex items-center space-x-2.5">
                      {c.creatorAvatar ? (
                        <img 
                          src={c.creatorAvatar} 
                          alt={c.creatorName} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-sm">
                          {c.creatorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{c.creatorName}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Posted on {c.datePosted} • {c.creatorRole === 'parent' ? (isBn ? 'অভিভাবকের পোস্ট' : 'Parent Profile') : (isBn ? 'শিক্ষকের পোস্ট' : 'Teacher Profile')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic qualification data if creator is a verified teacher */}
                  {isTeacher && teachData && (
                    <div className="mb-3 px-3 py-2.5 bg-gradient-to-r from-emerald-50/60 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-2xl border border-emerald-100/35 flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-extrabold text-slate-805 dark:text-slate-200">{isBn ? 'ডিগ্রি ও একাডেমিক ব্যাকগ্রাউন্ড:' : 'Degree & Academic Background:'}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-350 font-semibold mt-0.5">{teachData.qualification}</p>
                        
                        <button
                          onClick={() => setExpandedCertId(isCertExpanded ? null : c.id)}
                          className="mt-1.5 text-[10px] font-extrabold text-brand-purple dark:text-brand-blue flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{isCertExpanded ? (isBn ? 'ভেরিফিকেট উইন্ডো গুটিয়ে রাখুন' : 'Close Verification Shield') : (isBn ? 'ভেরিফাইড সার্টিফিকেট ও এনআইডি দেখুন 📜' : 'View Verified Certificate Proof 📜')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Interactive Certificate Verification Drawer */}
                  {isTeacher && teachData && isCertExpanded && (
                    <div className="mb-3.5 p-3.5 bg-slate-950 text-slate-200 rounded-2xl border border-emerald-500/30 animate-fade-in font-mono text-[10px] space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{isBn ? 'বাংলাদেশ এডুকেশন ভেরিফাইড সিলম্যাচ' : 'SECURE CREDENTIAL SYSTEM'}</span>
                        </span>
                        <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 rounded uppercase font-black">
                          {isBn ? 'অনুমোদিত' : 'PASSED'}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-300">
                        <p><span className="text-slate-500">{isBn ? 'সার্টিফিকেট ফাইল:' : 'Certificate File:'}</span> <span className="text-sky-350 font-bold">{teachData.certificateName}</span></p>
                        <p><span className="text-slate-500">{isBn ? 'জাতীয় পরিচয়পত্র (NID):' : 'National ID (NID):'}</span> <span>{teachData.nidNumber}</span></p>
                        <p><span className="text-slate-500">{isBn ? 'যাচাইকারী কর্তৃপক্ষ:' : 'Verifying Authority:'}</span> <span>{teachData.authority}</span></p>
                        <p><span className="text-slate-500">{isBn ? 'অনুমোদন তারিখ:' : 'Approval Stamp Date:'}</span> <span>{teachData.verifiedDate}</span></p>
                      </div>

                      <div className="p-2 bg-slate-900/60 rounded border border-slate-800/80 text-[9px] text-slate-400 leading-normal">
                        {isBn 
                          ? '※ এই শিক্ষকের জাতীয় পরিচয়পত্র ও বিশ্ববিদ্যালয় এডমিশন/ডিগ্রি সার্টিফিকেট তশনি এডমিন কাউন্সিল দ্বারা অনুমোদিত এবং ভেরিফাইড।' 
                          : '※ The educational credentials and National Identification key matches official registrar records.'}
                      </div>
                    </div>
                  )}

                  {/* Core Card Specs */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-350 font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-brand-purple" />
                        <span>{isBn ? 'বিষয়: ' : 'Subject: '}{c.subject}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-350 font-bold">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isBn ? 'শ্রেণী: ' : 'Class: '}{c.class}</span>
                      </span>
                    </div>

                    <h5 className="font-display font-extrabold text-base text-slate-850 dark:text-slate-100 pt-0.5">
                      {isBn ? 'সম্মানী/বাজেট:' : 'Salary:'} <span className="text-emerald-500">{c.salary}</span>
                    </h5>

                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-normal bg-slate-55/65 dark:bg-slate-900/50 p-3 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800">
                      {c.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono py-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Engagement controls */}
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-850 space-y-3">
                  
                  {/* Contact Info (Number hides unless applies or authorized) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">
                        {isCreator || hasApplied ? (
                          <strong className="text-indigo-650 font-bold dark:text-indigo-400">{c.phone}</strong>
                        ) : (
                          <span>{c.phone.slice(0, 5)}******</span>
                        )}
                      </span>
                    </div>
                    {!(isCreator || hasApplied) && (
                      <span className="text-[10px] text-slate-400 italic">
                        {isBn ? 'সঠিক নম্বর দেখতে আবেদন করুন' : 'Apply to view contact'}
                      </span>
                    )}
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="flex gap-2">
                    {isCreator ? (
                      <div className="w-full flex items-center justify-between gap-2.5">
                        <span className="text-[11px] text-indigo-550 font-bold bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 px-3 py-1.5 rounded-xl">
                          {isBn ? `আবেদনকারী সংখ্যা: ${c.applicants.length}` : `Applicants: ${c.applicants.length}`}
                        </span>
                        
                        <button
                          onClick={() => onDeleteCircular(c.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-650 border border-red-100/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          id={`delete-circ-btn-${c.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(c.id)}
                        disabled={hasApplied}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${hasApplied ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100' : 'bg-slate-950 dark:bg-slate-800 text-white hover:bg-slate-900 border border-transparent'}`}
                        id={`apply-circ-btn-${c.id}`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>{isBn ? 'আবেদন সফল হয়েছে' : 'Applied Success'}</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span>
                              {c.type === 'tutor_available' 
                                ? (isBn ? 'ব্যাচে যোগদানের অফার নিন' : 'Apply for Seat') 
                                : (isBn ? 'টিউটর হিসেবে আবেদন করুন' : 'Apply as Tutor')}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Private applicants list - ONLY VISIBLE TO THE CREATOR */}
                  {isCreator && c.applicants.length > 0 && (
                    <div className="p-3 bg-indigo-50/40 dark:bg-slate-855 rounded-2xl border border-indigo-100/40 dark:border-slate-800 mt-2 text-left">
                      <h6 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                        <span>👥</span>
                        <span>{isBn ? 'প্রাপ্ত আবেদনকারীদের তালিকা' : 'Applications List'}</span>
                      </h6>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {c.applicants.map((app, index) => (
                          <div key={index} className="pb-1.5 border-b border-indigo-55/40 last:border-0 text-[11px] flex justify-between items-center text-left">
                            <div>
                              <p className="font-bold text-slate-700 dark:text-slate-300">
                                {app.userName}
                                <span className="text-[9px] bg-slate-205 dark:bg-slate-800 px-1 ml-1 text-slate-500 rounded">{app.userRole}</span>
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">Phone: {app.userPhone}</p>
                            </div>
                            <span className="text-[9px] text-slate-450 font-mono italic">{app.dateApplied}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-850 text-slate-400">
            <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">
              {isBn 
                ? 'এই ক্যাটাগরিতে কোনো বিজ্ঞপ্তি পাওয়া যায়নি।' 
                : 'No circular postings matching the current filter options.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
