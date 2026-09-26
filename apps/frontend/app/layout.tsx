import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'App Finance | Portfolio & Wealth Management',
  description: 'Sistema financeiro de alta precisão e gestão patrimonial pessoal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0c] text-zinc-100 antialiased selection:bg-pink-500/30 selection:text-pink-200">
        {children}
      </body>
    </html>
  );
}
