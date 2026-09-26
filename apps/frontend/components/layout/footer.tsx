'use client';

import React, { useEffect, useState } from 'react';

export function Footer() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkApiHealth() {
      const startTime = performance.now();
      try {
        const res = await fetch('http://localhost:4012/health', {
          method: 'GET',
          cache: 'no-store',
        }).catch(() => null);

        const duration = Math.round(performance.now() - startTime);

        if (!isMounted) return;

        if (res && res.ok) {
          setStatus('connected');
          setLatency(duration);
        } else {
          setStatus('disconnected');
          setLatency(null);
        }
      } catch {
        if (!isMounted) return;
        setStatus('disconnected');
        setLatency(null);
      }
    }

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 30000); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <footer className="pt-8 pb-4 mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        {status === 'connected' && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-zinc-300 font-medium">API Conectada</span>
            {latency !== null && (
              <span className="text-[10px] text-zinc-500 font-mono">({latency}ms)</span>
            )}
          </>
        )}
        {status === 'disconnected' && (
          <>
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span className="text-rose-400 font-medium">API Desconectada</span>
          </>
        )}
        {status === 'checking' && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-zinc-400 font-medium">Verificando API...</span>
          </>
        )}

        <span className="text-zinc-600">•</span>
        <span>App Finance v2.2</span>
      </div>

      <div className="flex items-center gap-6 text-[11px]">
        <span className="text-zinc-500">Porta 4012 (Backend NestJS)</span>
        <span className="text-zinc-600">•</span>
        <span>© 2026 App Finance Inc.</span>
      </div>
    </footer>
  );
}
