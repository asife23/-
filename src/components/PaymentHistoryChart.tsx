import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { PaymentRecord, Language, Batch } from '../types';
import { CreditCard, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react';

interface PaymentHistoryChartProps {
  language: Language;
  payments: PaymentRecord[];
  childId: string;
  batches: Batch[];
}

const translateMonthBn = (monthStr: string) => {
  const parts = monthStr.split(' ');
  const m = parts[0];
  const year = parts[1] || '';
  const dict: Record<string, string> = {
    'December': 'ডিসেম্বর',
    'January': 'জানুয়ারি',
    'February': 'ফেব্রুয়ারি',
    'March': 'মার্চ',
    'April': 'এপ্রিল',
    'May': 'মে',
    'June': 'জুন',
    'July': 'জুলাই',
    'August': 'আগস্ট',
    'September': 'সেপ্টেম্বর',
    'October': 'অক্টোবর',
    'November': 'নভেম্বর'
  };
  return `${dict[m] || m} ${year}`;
};

export default function PaymentHistoryChart({
  language,
  payments,
  childId,
  batches
}: PaymentHistoryChartProps) {
  const isBn = language === 'bn';

  // Last 6 months range relative to May 2026
  const monthOrder = [
    'December 2025',
    'January 2026',
    'February 2026',
    'March 2026',
    'April 2026',
    'May 2026'
  ];

  // Filter payments for this specific child
  const childPayments = payments.filter(p => p.studentId === childId);

  // Compute spending data for recharts
  const chartData = monthOrder.map(month => {
    // Find all completed/partial payments for this month
    const monthPayments = childPayments.filter(p => p.month === month && (p.status === 'paid' || p.paidAmount > 0));
    const totalPaid = monthPayments.reduce((sum, p) => sum + p.paidAmount, 0);

    return {
      monthLabel: isBn ? translateMonthBn(month) : month,
      amount: totalPaid,
      rawMonth: month,
    };
  });

  // Calculate high-level stats
  const totalSpending6Months = chartData.reduce((sum, item) => sum + item.amount, 0);
  const averageSpent = Math.round(totalSpending6Months / monthOrder.length);
  const completedCount = childPayments.filter(p => p.status === 'paid').length;

  // Custom tool-tip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg text-xs leading-none">
          <p className="font-bold text-slate-900 dark:text-white mb-2">{payload[0].payload.monthLabel}</p>
          <p className="font-display font-semibold text-brand-purple">
            {isBn ? 'পরিশোধিত: ' : 'Paid Amount: '}
            <span className="text-slate-900 dark:text-slate-100 font-bold">৳{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 text-left">
      
      {/* Header section with icons & info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-50 dark:border-slate-850">
        <div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-purple" />
            <span>{isBn ? 'টিউশন ফি প্রদানের ৬ মাসের ইতিহাস' : '6-Month Tuition Fee Spending Analysis'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isBn ? 'বিগত ৬ মাসের পরিশোধিত ফি-এর চার্ট এবং বিবরণ' : 'Visual ledger trends and breakdown of paid school fees'}
          </p>
        </div>
        <div className="flex items-center space-x-1.5 self-start px-3 py-1.5 bg-brand-purple/5 text-brand-purple rounded-xl text-[11px] font-semibold border border-brand-purple/10">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Dec 2025 - May 2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total stats */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="p-2.5 bg-brand-purple/10 text-brand-purple rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {isBn ? 'সর্বমোট পরিশোধিত ফি' : 'Total Paid'}
            </span>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white">
              ৳{totalSpending6Months}
            </span>
          </div>
        </div>

        {/* Avg stats */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {isBn ? 'গড় মাসিক খরচ' : 'Monthly Average'}
            </span>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white">
              ৳{averageSpent}
            </span>
          </div>
        </div>

        {/* Total Invoices Cleared */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-500 rounded-xl">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {isBn ? 'পরিশোধিত রসিদ সংখ্যা' : 'Cleared Invoices'}
            </span>
            <span className="font-display font-bold text-base text-slate-900 dark:text-white">
              {completedCount} {isBn ? 'টি' : 'Invoices'}
            </span>
          </div>
        </div>
      </div>

      {/* Area Chart Section */}
      <div className="p-4 bg-slate-50/30 dark:bg-slate-850/10 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#e2e8f0" 
                className="dark:stroke-slate-800"
              />
              <XAxis 
                dataKey="monthLabel" 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `৳${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#a855f7" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSpent)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
