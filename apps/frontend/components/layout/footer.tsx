import React from 'react';

export function Footer() {
  return (
    <footer className="pt-8 pb-4 mt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-zinc-400 font-medium">API Conectada</span>
        <span className="text-zinc-600">•</span>
        <span>App Finance v2.1</span>
      </div>

      <div className="flex items-center gap-6 text-[11px]">
        <span className="hover:text-zinc-400 cursor-pointer">Segurança JWT</span>
        <span className="hover:text-zinc-400 cursor-pointer">Privacidade</span>
        <span>© 2026 App Finance Inc.</span>
      </div>
    </footer>
  );
}
