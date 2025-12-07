import React, { useRef, useEffect } from 'react';
import { AccountData } from '../types';
import { Download, Copy, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ResultsTableProps {
  data: AccountData[];
  onExport: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, onExport }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.length]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          سجل الحسابات
          <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            {data.length} عنصر
          </span>
        </h2>
        <button
          onClick={onExport}
          disabled={data.length === 0}
          className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          <Download size={14} />
          تصدير CSV
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <table className="w-full text-right border-collapse">
          <thead className="bg-slate-950 sticky top-0 z-10 shadow-md">
            <tr>
              <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-24">الوقت</th>
              <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">الإيميل</th>
              <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">كلمة المرور</th>
              <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-32">الحالة</th>
              <th className="p-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-16">نسخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-600 text-sm italic">
                        لم تبدأ أي عمليات بعد. اضغط على "بدء العملية".
                    </td>
                </tr>
            ) : (
                data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-3 text-xs font-mono text-slate-400 whitespace-nowrap" dir="ltr">
                    {row.timestamp}
                    </td>
                    <td className="p-3 text-sm text-slate-200 font-mono select-all text-left" dir="ltr">
                    {row.email}
                    </td>
                    <td className="p-3 text-sm text-slate-200 font-mono select-all text-left" dir="ltr">
                    {row.password}
                    </td>
                    <td className="p-3">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        row.status === 'success'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50'
                            : row.status === 'failed'
                            ? 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title={row.message}
                    >
                        {row.status === 'success' && <CheckCircle size={12} />}
                        {row.status === 'failed' && <XCircle size={12} />}
                        {row.status === 'pending' && <Clock size={12} />}
                        {row.status === 'success' ? 'ناجح' : row.status === 'failed' ? 'فشل' : 'جاري...'}
                    </span>
                    </td>
                    <td className="p-3">
                        <button 
                            onClick={() => copyToClipboard(`${row.email}:${row.password}`)}
                            className="text-slate-600 hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="نسخ المستخدم:كلمة المرور"
                        >
                            <Copy size={14} />
                        </button>
                    </td>
                </tr>
                ))
            )}
            <div ref={bottomRef} />
          </tbody>
        </table>
      </div>
    </div>
  );
};