import React, { useState, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ResultsTable } from './components/ResultsTable';
import { StatsCard } from './components/StatsCard';
import { AccountData, RegistrationConfig, Stats } from './types';
import { generateRandomEmail, generateRandomPassword, formatTime } from './utils/generator';
import { Terminal, Database, Code } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [config, setConfig] = useState<RegistrationConfig>({
    targetUrl: 'https://zaminer.cc/api/register', // Updated to a more likely API endpoint structure
    count: 50,
    inviteCode: '',
    delayMs: 1500, // Increased default delay to avoid rate limits
    useMockMode: false,
    useProxy: true, // Default to true to help users bypass CORS immediately
  });

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<AccountData[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Derived State ---
  const stats: Stats = {
    total: config.count,
    success: logs.filter((l) => l.status === 'success').length,
    failed: logs.filter((l) => l.status === 'failed').length,
    pending: logs.filter((l) => l.status === 'pending').length,
  };

  // --- Logic ---

  const handleStart = useCallback(async () => {
    setIsRunning(true);
    setLogs([]); // Clear previous logs
    abortControllerRef.current = new AbortController();

    const { count, targetUrl, inviteCode, delayMs, useMockMode, useProxy } = config;

    for (let i = 0; i < count; i++) {
      if (abortControllerRef.current.signal.aborted) {
        break;
      }

      const email = generateRandomEmail();
      const password = generateRandomPassword();
      const id = Math.random().toString(36).substring(7);
      const timestamp = formatTime(new Date());

      // Add to logs as pending
      const newEntry: AccountData = {
        id,
        email,
        password,
        timestamp,
        status: 'pending',
      };

      setLogs((prev) => [...prev, newEntry]);

      // Perform Request
      try {
        let success = false;
        let msg = 'تم التسجيل بنجاح';

        if (useMockMode) {
            // Simulation
            await new Promise(r => setTimeout(r, Math.random() * 500 + 100)); 
            // 95% success rate simulation
            success = Math.random() > 0.05;
            if(!success) msg = "خطأ عشوائي (محاكاة)";
        } else {
            // Real Network Request
            const payload = {
                email: email,
                password: password,
                password_confirmation: password, // Common field name
                invite_code: inviteCode || undefined, // Send if exists
            };

            // Prepare URL with Proxy if enabled
            // Using corsproxy.io as a stable public proxy for POST requests
            const finalUrl = useProxy 
                ? `https://corsproxy.io/?${encodeURIComponent(targetUrl)}` 
                : targetUrl;

            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal,
            });

            if (response.ok) {
                success = true;
            } else {
                success = false;
                msg = `خطأ HTTP: ${response.status}`;
                // Try to parse error message
                try {
                    const text = await response.text();
                    try {
                        const errData = JSON.parse(text);
                        if(errData.message) msg = errData.message;
                        else if(errData.error) msg = errData.error;
                        else msg = text.substring(0, 50) + '...'; // Show snippet of response
                    } catch {
                        // Response wasn't JSON (likely HTML error page)
                         msg = `خطأ ${response.status}: استجابة غير متوقعة (HTML)`;
                    }
                } catch(e) {}
            }
        }

        // Update Log status
        setLogs((prev) =>
            prev.map((item) =>
            item.id === id ? { ...item, status: success ? 'success' : 'failed', message: msg } : item
            )
        );

      } catch (error: any) {
        if (error.name === 'AbortError') break;
        
        let errorMessage = error.message || 'خطأ غير معروف';
        if (errorMessage === 'Failed to fetch') {
            errorMessage = 'تعذر الاتصال (حظر CORS أو خطأ في الشبكة)';
        }

        setLogs((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'failed', message: errorMessage } : item
          )
        );
      }

      // Delay logic
      if (i < count - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    setIsRunning(false);
  }, [config]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
  };

  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Timestamp,Email,Password,Status,Message\n' +
      logs.map((row) => `${row.timestamp},${row.email},${row.password},${row.status},"${row.message || ''}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `accounts_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full p-4 lg:p-8 gap-6">
      {/* Header */}
      <header className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <div className="p-3 bg-primary-600 rounded-lg shadow-lg shadow-primary-900/30">
          <Terminal className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">المسجل التلقائي <span className="text-primary-500">AutoRegistrar</span></h1>
          <p className="text-slate-400 text-sm">أداة إنشاء الحسابات والتسجيل التلقائي</p>
        </div>
        <div className="mr-auto flex gap-4 text-xs text-slate-500" dir="ltr">
            <div className="flex items-center gap-1"><Database size={14}/> منطق محلي</div>
            <div className="flex items-center gap-1"><Code size={14}/> React TypeScript</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden gap-6">
        
        {/* Top Section: Stats & Controls */}
        <div className="flex flex-col gap-0">
             <StatsCard stats={stats} />
             <ControlPanel
                config={config}
                isRunning={isRunning}
                onConfigChange={setConfig}
                onStart={handleStart}
                onStop={handleStop}
            />
        </div>

        {/* Bottom Section: Logs */}
        <div className="flex-1 min-h-0">
          <ResultsTable data={logs} onExport={handleExport} />
        </div>
      </main>
    </div>
  );
};

export default App;