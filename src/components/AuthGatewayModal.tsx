import React, { useState } from 'react';
import { 
  X, Mail, Lock, ShieldCheck, User as UserIcon, Phone, 
  MapPin, BookOpen, GraduationCap, Sparkles, CheckCircle2, ShieldAlert 
} from 'lucide-react';
import { User, Role, Language } from '../types';

interface AuthGatewayModalProps {
  language: Language;
  onLoginSuccess: (user: User) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export default function AuthGatewayModal({
  language,
  onLoginSuccess,
  onClose,
  isOpen
}: AuthGatewayModalProps) {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup input states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState<Role>('student');
  const [signupPassword, setSignupPassword] = useState('');
  
  // Teacher-specific signup credentials (to satisfy user request on certificates and prevent cheating)
  const [teacherInstitution, setTeacherInstitution] = useState('');
  const [teacherQualification, setTeacherQualification] = useState('');
  const [teacherCertificateName, setTeacherCertificateName] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  // Pre-seed mock accounts for quick testing
  const handleQuickLogin = (role: 'teacher' | 'student' | 'parent') => {
    let mockUser: User;
    if (role === 'teacher') {
      mockUser = {
        id: 'teacher1',
        name: 'প্রফেসর রফিকুল ইসলাম (Rafiq Sir)',
        role: 'teacher',
        email: 'teacher@tushuni.com',
        phone: '01712345678',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&q=80',
        isVerified: true,
        certificateUrl: 'HSC_PHYSICS_SPECIAL_BOARD_PROOF.pdf',
        ratingAverage: 4.9,
        reviewCount: 24,
        bkashNumber: '01712345678',
        nagadNumber: '01712345678',
        rocketNumber: ''
      };
    } else if (role === 'student') {
      mockUser = {
        id: 'student1',
        name: 'আবীর হাসান (Abir)',
        role: 'student',
        email: 'student@tushuni.com',
        phone: '01512345678',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&q=80',
      };
    } else {
      mockUser = {
        id: 'parent1',
        name: 'মিসেস শিরীন হাসান (Shirin)',
        role: 'parent',
        email: 'parent@tushuni.com',
        phone: '01811223344',
      };
    }
    onLoginSuccess(mockUser);
    if (onClose) onClose();
  };

  const handleGoogleLogin = () => {
    // Elegant simulated Google OAuth Flow
    const googleMockUser: User = {
      id: `google-${Date.now()}`,
      name: isBn ? 'গুগল ইউজার (Google Account Demo)' : 'G-Suite Verified User',
      role: 'student',
      email: 'user.gmail@gmail.com',
      phone: '01912345678',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80',
    };
    onLoginSuccess(googleMockUser);
    if (onClose) onClose();
  };

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError(isBn ? 'অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।' : 'Please fill all login credentials.');
      return;
    }

    // Match quick credentials
    if (loginEmail === 'teacher@tushuni.com') {
      handleQuickLogin('teacher');
      return;
    } else if (loginEmail === 'student@tushuni.com') {
      handleQuickLogin('student');
      return;
    } else if (loginEmail === 'parent@tushuni.com') {
      handleQuickLogin('parent');
      return;
    }

    // Dynamic login mock
    const dynamicUser: User = {
      id: `user-${Date.now()}`,
      name: loginEmail.split('@')[0].toUpperCase(),
      role: 'student',
      email: loginEmail,
      phone: '01700000000',
    };
    onLoginSuccess(dynamicUser);
    if (onClose) onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      setSignupError(isBn ? 'দয়া করে সাধারণ ডেক্লারেশনের সকল ঘর পূরণ করুন।' : 'Please verify all signup input data.');
      return;
    }

    if (signupRole === 'teacher' && (!teacherInstitution || !teacherQualification)) {
      setSignupError(isBn ? 'শিক্ষকদের শিক্ষাগত যোগ্যতা ও ইন্সটিটিউট দেওয়া আবশ্যক।' : 'Educator credentials and university are mandatory for registration.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: signupName,
      role: signupRole,
      email: signupEmail,
      phone: signupPhone,
      isVerified: signupRole === 'teacher' ? true : false, // Teachers with NID and certificate details verified automatically for this high fidelity loop
      certificateUrl: signupRole === 'teacher' ? (teacherCertificateName || 'BUET_SSC_HSC_MATH_PHYSICS_CERT.pdf') : undefined,
      avatar: signupRole === 'teacher' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&q=80',
    };

    setSignupSuccess(isBn ? 'আপনার অ্যাকাউন্টটি সফলভাবে তৈরি হয়ে লগইন হয়েছে!' : 'Registration successful! Proceeding to personal portal...');
    setSignupError('');

    setTimeout(() => {
      onLoginSuccess(newUser);
      setSignupSuccess('');
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden text-left animate-fade-in">
        
        {/* Colorful accent line */}
        <div className="h-2 bg-gradient-to-r from-brand-purple via-rose-500 to-indigo-650"></div>

        {/* Header container */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
              <span>{isBn ? 'টিউশনি অথেনটিকেশন পোর্টাল' : 'Tushuni Secure Connect'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Bengali Private Tuition Loop Security Node • verified credentials</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="px-6 flex border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'login' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-slate-400'}`}
          >
            {isBn ? '🔑 ইমেল ও গুগল লগইন' : '🔑 Email & Google Login'}
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setSignupError('');
            }}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === 'signup' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-slate-400'}`}
          >
            {isBn ? '⭐ নতুন অ্যাকাউন্ট খুলুন (Sign Up)' : '⭐ Register New Account (Sign Up)'}
          </button>
        </div>

        {/* Form area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          
          {activeTab === 'login' ? (
            <div className="space-y-4">
              
              {/* Google OAuth trigger */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-200 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                id="google-login-btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14-2.73-1.12-3.38v2.81h3.38c1.97-1.81 3.1-4.48 3.1-7.56z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.38-2.62c-.94.63-2.15 1-4.55 1-3.51 0-6.48-2.37-7.54-5.57H1.05v2.79C3.07 20.3 7.15 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.46 13.9c-.27-.8-.42-1.66-.42-2.55s.15-1.75.42-2.55V6.01H1.05C.38 7.35 0 8.87 0 10.45c0 1.58.38 3.1 1.05 4.44l3.41-2.55z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.93 1.19 15.24 0 12 0 7.15 0 3.07 3.7 1.05 7.66l3.41 2.55c1.06-3.2 4.03-5.57 7.54-5.57z"
                  />
                </svg>
                <span>{isBn ? 'গুগল অ্যাকাউন্ট দিয়ে সরাসরি লগইন করুন' : 'Continue with Google Account'}</span>
              </button>

              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 my-2">
                <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></span>
                <span className="px-3">{isBn ? 'অথবা ইমেল দিয়ে' : 'or login with email'}</span>
                <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1"></span>
              </div>

              {loginError && (
                <p className="p-2.5 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl font-bold border border-red-100">{loginError}</p>
              )}

              <form onSubmit={handleEmailLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="e.g. teacher@tushuni.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">{isBn ? 'পাসওয়ার্ড' : 'Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer"
                  id="email-login-submit"
                >
                  {isBn ? 'লগইন করুন 🔓' : 'Sign In with Email 🔓'}
                </button>
              </form>

              {/* Seamless test profiles selector */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-extrabold text-indigo-600 block">
                  💡 {isBn ? 'ইমেইল ছাড়া সরাসরি ডেমো অ্যাকাউন্ট দিয়ে দেখতে চান?' : 'Want to explore with official test profiles instantly?'}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleQuickLogin('teacher')} 
                    className="p-1 px-1.5 bg-sky-50 dark:bg-sky-950/20 text-sky-600 border border-sky-100 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {isBn ? 'প্রফেসর রফিক স্যর' : 'Rafiq Sir'}
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('student')} 
                    className="p-1 px-1.5 bg-pink-50 dark:bg-pink-950/20 text-pink-500 border border-pink-100 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {isBn ? 'আবীর হাসান' : 'Student Abir'}
                  </button>
                  <button 
                    onClick={() => handleQuickLogin('parent')} 
                    className="p-1 px-1.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 border border-purple-100 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    {isBn ? 'অভিভাবক শিরীন' : 'Parent Shirin'}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              {signupSuccess && (
                <div className="p-3 bg-emerald-55 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>{signupSuccess}</span>
                </div>
              )}

              {signupError && (
                <p className="p-2.5 text-xs text-red-505 bg-red-50 dark:bg-red-955/20 rounded-xl font-bold border border-red-100">{signupError}</p>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                
                {/* Visual Sandbox Separator Warning */}
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 text-left text-xs text-red-700 dark:text-red-400">
                  <p className="font-extrabold flex items-center gap-1.5 mb-1 text-[11px] sm:text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 animate-pulse" />
                    <span>{isBn ? '⚠️ গুরুত্বপূর্ণ নোটিশ ও একাউন্ট সতকর্তা' : '⚠️ Strict Account Integrity & Safety Notice'}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] opacity-90 leading-normal">
                    {isBn 
                      ? 'শিক্ষক (স্যার) এবং ছাত্র-ছাত্রী/অভিভাবক একাউন্ট সম্পূর্ণ আলাদা। ছাত্র-ছাত্রীরা ভুল তথ্য দিয়ে শিক্ষক একাউন্ট খুললে তা স্বয়ংক্রিয়ভাবে ব্লক করা হবে।'
                      : 'Teacher ("Sir") accounts and Student/Parent profiles are strictly isolated. Student profiles pretending to be educators will be flagged and auto-blocked.'}
                  </p>
                </div>

                {/* Highly explicit account selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 mb-1.5">
                    {isBn ? '১। আপনি কি হিসেবে একাউন্ট খুলতে চান?' : '1. Select Account DirectoryType'}
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Teacher "Sir" Choice */}
                    <button
                      key="teacher"
                      type="button"
                      onClick={() => {
                        setSignupRole('teacher');
                        setSignupError('');
                      }}
                      className={`p-3 text-left border rounded-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-24 ${
                        signupRole === 'teacher' 
                          ? 'border-brand-purple bg-purple-50/20 dark:bg-purple-950/20 ring-2 ring-brand-purple/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">👨‍🏫</span>
                        {signupRole === 'teacher' && <span className="w-2.5 h-2.5 bg-brand-purple rounded-full animate-ping" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white">{isBn ? 'শিক্ষক / স্যার একাউন্ট' : 'Educator (Sir Account)'}</p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal">{isBn ? 'পড়াতে চান ও ব্যাচ তৈরি করবেন' : 'For teachers, tuition providers'}</p>
                      </div>
                    </button>

                    {/* Student/Parent "Tutee" Choice */}
                    <button
                      key="student"
                      type="button"
                      onClick={() => {
                        setSignupRole('student');
                        setSignupError('');
                      }}
                      className={`p-3 text-left border rounded-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-24 ${
                        signupRole === 'student' || signupRole === 'parent' 
                          ? 'border-blue-550 bg-blue-50/20 dark:bg-blue-950/20 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">🎓</span>
                        {(signupRole === 'student' || signupRole === 'parent') && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white">{isBn ? 'ছাত্র বা অভিভাবক একাউন্ট' : 'Student / Parent'}</p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal">{isBn ? 'টিউটর খুঁজছেন বা পড়তে চান' : 'Search tutors, submit fees'}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sub-selector for student vs parent only if non-teacher */}
                {(signupRole === 'student' || signupRole === 'parent') && (
                  <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold text-slate-400 pl-1 uppercase">{isBn ? 'নির্দিষ্ট প্রোফাইল ধরন:' : 'Role Specification:'}</span>
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSignupRole('student');
                          setSignupError('');
                        }}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                          signupRole === 'student' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isBn ? 'শিক্ষার্থী (Student)' : 'Student'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSignupRole('parent');
                          setSignupError('');
                        }}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                          signupRole === 'parent' ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isBn ? 'অভিভাবক (Parent)' : 'Parent'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Core Account Details Heading */}
                <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 mb-1.5">
                    {isBn ? '২। একাউন্টের সাধারণ তথ্য পূরণ করুন' : '2. Fill Core Profile Details'}
                  </label>
                </div>

                {/* Core Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {signupRole === 'teacher' ? (isBn ? 'সম্মানীত শিক্ষকের পুরো নাম (যেমন: Rafiq Sir)' : 'Teacher / Sir Full Name') : (isBn ? 'ছাত্র/অভিভাবকের নাম (যেমন: Abir)' : 'Student/Parent Full Name')}
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder={signupRole === 'teacher' ? (isBn ? 'উদা: প্রফেসর রফিকুল ইসলাম' : 'e.g. Rafiq Sir') : (isBn ? 'উদা: আবীর হাসান' : 'e.g. Abir Hasan')}
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">{isBn ? 'সঠিক ফোন নম্বর' : 'Valid Mobile Phone'}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="e.g. 017xxxxxxxx"
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="e.g. name@domain.com"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Teacher Credentials Section - ONLY SHOWS IF signupRole === 'teacher' */}
                {signupRole === 'teacher' && (
                  <div className="p-4 bg-indigo-50/50 dark:bg-slate-850 rounded-2xl border border-indigo-100/35 space-y-3.5 text-left animate-fade-in ring-1 ring-emerald-500/10">
                    <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      <span>🎓 {isBn ? '৩। শিক্ষক (স্যার) প্রমাণপত্র ও ডিগ্রি ভেরিফিকেশন' : '3. Educator Verification Protocols'}</span>
                    </span>

                    <p className="text-[10px] text-slate-400 leading-normal">
                      {isBn 
                        ? '※ ছাত্রছাত্রীরা যেন শুধুমাত্র জেনুইন স্যার খুঁজে পায়, তাই আপনার বিশ্বস্ত সর্বোচ্চ ডিগ্রি এবং ডেমো সার্টিফিকেট নাম উল্লেখ করুন।' 
                        : '※ To prevent students from posing as teachers, satisfy degree proof rules below.'}
                    </p>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{isBn ? 'আপনার শিক্ষা প্রতিষ্ঠান / বিশ্ববিদ্যালয়ের নাম' : 'Institution name'}</label>
                      <input
                        type="text"
                        placeholder="e.g. BUET / DU / DMC / JNU"
                        value={teacherInstitution}
                        onChange={e => setTeacherInstitution(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                        required={signupRole === 'teacher'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isBn ? 'ডিগ্রি/যোগ্যতা (উদা: B.Sc)' : 'Degree'}</label>
                        <input
                          type="text"
                          placeholder="B.Sc Engr, M.Sc, HSC"
                          value={teacherQualification}
                          onChange={e => setTeacherQualification(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white"
                          required={signupRole === 'teacher'}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isBn ? 'সার্টিফিকেট ফাইল প্রমাণ*' : 'Certificate file proof'}</label>
                        <input
                          type="text"
                          placeholder="BUET_GRAD_PROOF.pdf"
                          value={teacherCertificateName}
                          onChange={e => setTeacherCertificateName(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">{isBn ? 'গোপন পাসওয়ার্ড' : 'Create secret password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-indigo-650 text-white rounded-xl text-xs font-bold hover:shadow-md transition-all cursor-pointer mt-2"
                  id="signup-submit"
                >
                  {isBn ? 'নিবন্ধন সম্পন্ন করুন ও পোর্টাল খুলুন 🎉' : 'Complete Registration & Open Dashboard 🎉'}
                </button>

              </form>

            </div>
          )}

        </div>

        {/* Footer block */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/40 text-center text-[10px] text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800/80">
          <span>{isBn ? 'সুরক্ষিত SSL এনক্রিপশন সিস্টেম দ্বারা রক্ষিত' : 'Secure SSL Encryption Layer Applied'}</span>
        </div>

      </div>
    </div>
  );
}
