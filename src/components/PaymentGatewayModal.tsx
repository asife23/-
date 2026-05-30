import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, Landmark } from 'lucide-react';
import { PaymentRecord, Language, User } from '../types';
import { TRANSLATE_DICT } from '../data/initialData';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  payment: PaymentRecord | { amount: number; studentId: string; batchId: string; teacherId: string };
  studentName: string;
  batchName: string;
  onPaymentSuccess: (amountPaid: number, method: 'bKash' | 'Nagad' | 'Rocket', trxId: string) => void;
  teacher?: User;
}

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  language,
  payment,
  studentName,
  batchName,
  onPaymentSuccess,
  teacher
}: PaymentGatewayModalProps) {
  const t = TRANSLATE_DICT[language];
  const [gateway, setGateway] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [step, setStep] = useState<'details' | 'process' | 'success'>('details');
  const [phoneNo, setPhoneNo] = useState('+8801');
  const [pin, setPin] = useState('');
  const [payAmount, setPayAmount] = useState<number>(
    'amount' in payment ? (payment.amount - ('paidAmount' in payment ? (payment.paidAmount || 0) : 0)) : 0
  );
  const [errors, setErrors] = useState<string>('');

  if (!isOpen) return null;

  const handleProceed = () => {
    if (payAmount <= 0) {
      setErrors(language === 'bn' ? 'সঠিক টাকার পরিমাণ দিন' : 'Enter a valid payment amount');
      return;
    }
    setErrors('');
    setStep('process');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNo.length < 11) {
      setErrors(language === 'bn' ? 'মোবাইল নম্বর সঠিক নয়' : 'Invalid wallet number');
      return;
    }
    if (pin.length < 4) {
      setErrors(language === 'bn' ? 'সঠিক ৪-৬ সংখ্যার পিন দিন' : 'Enter solid security PIN');
      return;
    }

    // Simulate TxId
    const randChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let txId = gateway.toUpperCase().substring(0, 2);
    for (let i = 0; i < 8; i++) {
      txId += randChars.charAt(Math.floor(Math.random() * randChars.length));
    }

    onPaymentSuccess(payAmount, gateway, txId);
    setStep('success');
  };

  // Vibe Colors based on gateway
  const getBrandColor = () => {
    if (gateway === 'bKash') return 'bg-[#d12053]'; // bKash Pink
    if (gateway === 'Nagad') return 'bg-[#f04f23]'; // Nagad Orange
    return 'bg-[#8c2e8c]'; // Rocket Purple
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className={`p-5 text-white ${getBrandColor()} flex items-center justify-between transition-colors duration-300`}>
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6" />
            <div>
              <h3 className="font-display font-semibold text-lg leading-tight">
                {gateway} {t.appName} Pay
              </h3>
              <p className="text-xs text-white/80">Secured Tuition Payment</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/25 transition-all"
            id="close-gateway-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gateway Multi-selector bar */}
        {step === 'details' && (
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            {(['bKash', 'Nagad', 'Rocket'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGateway(g)}
                className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                  gateway === g 
                    ? 'text-brand-purple' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                id={`gateway-select-${g.toLowerCase()}`}
              >
                {g}
                {gateway === g && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {step === 'details' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex flex-col space-y-1">
                <span className="text-xs text-slate-500 font-medium">{language === 'bn' ? 'শিক্ষার্থী' : 'Student'}</span>
                <span className="font-display font-semibold text-slate-900 dark:text-white">{studentName}</span>
                <span className="text-xs text-slate-500 font-medium mt-2">{language === 'bn' ? 'ব্যাচ ও কোর্স' : 'Batch / Class'}</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{batchName}</span>
              </div>

              {teacher && (
                <div className="p-4 bg-indigo-50/50 dark:bg-slate-850 rounded-2xl border border-indigo-100/40 dark:border-slate-800 text-left space-y-1.5 flex items-center space-x-3">
                  <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-xl font-bold text-lg leading-none">💡</div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                      {language === 'bn' ? 'প্রাপক শিক্ষক' : 'Recipient Educator'}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {teacher.name}
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium font-mono block">
                      {gateway} {language === 'bn' ? 'নম্বর' : 'Number'}: {' '}
                      <strong className="text-brand-purple">
                        {gateway === 'bKash' 
                          ? (teacher.bkashNumber || 'N/A') 
                          : gateway === 'Nagad' 
                          ? (teacher.nagadNumber || 'N/A') 
                          : (teacher.rocketNumber || 'N/A')}
                      </strong>
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{t.enterAmount}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-semibold text-slate-400">৳</span>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-display font-semibold text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    placeholder="0.00"
                    id="payment-amount-input"
                  />
                </div>
              </div>

              {errors && <p className="text-sm text-red-500 font-medium mt-1">{errors}</p>}

              <button
                onClick={handleProceed}
                className="w-full py-3.5 rounded-2xl font-display font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-blue hover:shadow-lg hover:shadow-brand-purple/20 transition-all flex items-center justify-center space-x-2 mt-2"
                id="proceed-payment-btn"
              >
                <span>{language === 'bn' ? 'এগিয়ে যান' : 'Proceed Payment'}</span>
              </button>
            </div>
          )}

          {step === 'process' && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="flex flex-col items-center justify-center text-center py-2 space-y-1">
                <div className={`p-3 rounded-full ${gateway === 'bKash' ? 'bg-[#d12053]/10 text-[#d12053]' : gateway === 'Nagad' ? 'bg-[#f04f23]/10 text-[#f04f23]' : 'bg-[#8c2e8c]/10 text-[#8c2e8c]'} mb-2`}>
                  <Smartphone className="w-8 h-8" />
                </div>
                <h4 className="font-display font-semibold text-slate-800 dark:text-white">
                  {language === 'bn' ? `${gateway} ওয়ালেট ভেরিফিকেশন` : `${gateway} Wallet Verification`}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'আপনার মোবাইল নম্বর এবং পিন দিয়ে সাবমিট করুন' : 'Enter your mobile account number & secure pin'}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{language === 'bn' ? 'ওয়ালেট নম্বর' : 'Wallet Mobile Account'}</label>
                  <input
                    type="tel"
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 font-display text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    id="wallet-number-input"
                    placeholder="+8801xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{language === 'bn' ? 'সিকিউরিটি পিন (PIN)' : 'PIN Code'}</label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 tracking-widest font-mono text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    id="pin-code-input"
                    placeholder="••••"
                    maxLength={6}
                  />
                </div>
              </div>

              {errors && <p className="text-sm text-red-500 font-medium">{errors}</p>}

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>{language === 'bn' ? 'আপনার পাসওয়ার্ড বা ওটিপি সম্পূর্ণ নিরাপদ' : 'End-to-end encrypted validation mechanism.'}</span>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 py-3 text-sm font-medium rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
                  id="back-payment-btn"
                >
                  {language === 'bn' ? 'পিছনে' : 'Back'}
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 text-sm font-display font-semibold rounded-2xl text-white ${getBrandColor()}`}
                  id="final-pay-btn"
                >
                  {language === 'bn' ? 'টাকা পরিশোধ করুন' : 'Confirm Pay'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{t.paySuccess}</h3>
                <p className="text-sm text-slate-500">
                  {language === 'bn' ? 'ডিজিটাল রশিদ স্বয়ংক্রিয়ভাবে সেভ করা হয়েছে' : 'Digital receipt created & ledger balance adjusted.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl text-left text-sm space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.amount}</span>
                  <span className="font-display font-bold text-brand-purple">৳{payAmount} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'গেটওয়ে' : 'Gateway'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{gateway} Mobile Wallet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.trxId}</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">TXN{Date.now().toString().slice(-6)}AP</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-display font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:opacity-95 transition-all text-sm"
                id="close-success-btn"
              >
                {language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Workspace'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
