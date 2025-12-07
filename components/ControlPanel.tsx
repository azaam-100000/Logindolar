import React from 'react';
import { RegistrationConfig } from '../types';
import { Play, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ControlPanelProps {
  config: RegistrationConfig;
  isRunning: boolean;
  onConfigChange: (newConfig: RegistrationConfig) => void;
  onStart: () => void;
  onStop: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  isRunning,
  onConfigChange,
  onStart,
  onStop,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onConfigChange({
      ...config,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        
        {/* Target URL */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            رابط الـ API (وليس صفحة الويب)
          </label>
          <input
            type="text"
            name="targetUrl"
            value={config.targetUrl}
            onChange={handleChange}
            disabled={isRunning}
            placeholder="مثال: https://zaminer.cc/api/register"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all disabled:opacity-50 text-left dir-ltr"
            dir="ltr"
          />
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
             <AlertTriangle size={12} className="text-amber-500"/>
             تأكد أن الرابط هو Endpoint (POST) وليس رابط الصفحة الرئيسية.
          </p>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            عدد الحسابات
          </label>
          <input
            type="number"
            name="count"
            min="1"
            max="10000"
            value={config.count}
            onChange={handleChange}
            disabled={isRunning}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary-600 outline-none disabled:opacity-50"
          />
        </div>

        {/* Action Button */}
        <div>
          {!isRunning ? (
            <button
              onClick={onStart}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2"
            >
              <Play size={18} fill="currentColor" />
              بدء العملية
            </button>
          ) : (
            <button
              onClick={onStop}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2"
            >
              <Loader2 size={18} className="animate-spin" />
              إيقاف
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Invite Code */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
                كود الدعوة (اختياري)
            </label>
            <input
                type="text"
                name="inviteCode"
                value={config.inviteCode}
                onChange={handleChange}
                disabled={isRunning}
                placeholder="اتركه فارغاً إذا لم يكن مطلوباً"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary-600 outline-none disabled:opacity-50"
            />
          </div>

          {/* Speed / Delay */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
                تأخير زمني (مللي ثانية)
            </label>
            <input
                type="number"
                name="delayMs"
                min="0"
                value={config.delayMs}
                onChange={handleChange}
                disabled={isRunning}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary-600 outline-none disabled:opacity-50"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-4">
             {/* Proxy Toggle */}
             <label className="flex items-center cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="useProxy"
                    checked={config.useProxy}
                    onChange={handleChange}
                    className="sr-only peer"
                    disabled={isRunning}
                />
                <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <div className="ms-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                    <span className="font-medium flex items-center gap-1.5">
                        <ShieldCheck size={14} className={config.useProxy ? "text-emerald-400" : "text-slate-500"}/>
                        تفعيل وسيط بروكسي
                    </span>
                    <span className="block text-[10px] text-slate-500">لحل مشاكل الحظر (CORS)</span>
                </div>
             </label>

             {/* Mock Mode Toggle */}
             <label className="flex items-center cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="useMockMode"
                    checked={config.useMockMode}
                    onChange={handleChange}
                    className="sr-only peer"
                    disabled={isRunning}
                />
                <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                <div className="ms-3 text-sm text-slate-300 group-hover:text-white transition-colors">
                    <span className="font-medium">وضع المحاكاة (وهمي)</span>
                    <span className="block text-[10px] text-slate-500">للتجربة بدون إرسال حقيقي</span>
                </div>
             </label>
          </div>
      </div>
    </div>
  );
};