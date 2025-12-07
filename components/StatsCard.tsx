import React from 'react';
import { Stats } from '../types';

interface StatsCardProps {
  stats: Stats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const progress = stats.total > 0 ? ((stats.success + stats.failed) / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
        <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">الهدف</h3>
        <p className="text-2xl font-mono font-bold text-white mt-1">{stats.total}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border border-emerald-900/50 shadow-sm">
        <h3 className="text-emerald-400 text-xs uppercase font-bold tracking-wider">نجاح</h3>
        <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{stats.success}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border border-rose-900/50 shadow-sm">
        <h3 className="text-rose-400 text-xs uppercase font-bold tracking-wider">فشل</h3>
        <p className="text-2xl font-mono font-bold text-rose-400 mt-1">{stats.failed}</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm flex flex-col justify-between">
         <h3 className="text-blue-400 text-xs uppercase font-bold tracking-wider">التقدم</h3>
         <div className="w-full bg-slate-700 h-2.5 rounded-full mt-2" dir="ltr">
            <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
         </div>
         <p className="text-left text-xs text-slate-400 mt-1" dir="ltr">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};