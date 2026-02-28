import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clave-Lex | Plataforma de Auditoría",
  description: "Plataforma SaaS Premium para Auditores Tributarios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar Area (Left) */}
          <aside className="w-64 bg-white border-r border-[#e4e7ed] hidden md:flex flex-col">
            <div className="p-6 border-b border-[#e4e7ed]">
              <h1 className="text-2xl font-bold text-[var(--green-700)] tracking-tight">Clave-Lex</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/" className="flex items-center px-4 py-3 text-[#374151] rounded-lg hover:bg-[#f0fdf4] hover:text-[var(--green-700)] transition-colors font-medium">
                Dashboard
              </a>
              <a href="/auditoria/nueva" className="flex items-center px-4 py-3 text-[#374151] rounded-lg hover:bg-[#f0fdf4] hover:text-[var(--green-700)] transition-colors font-medium">
                Nueva Auditoría
              </a>
            </nav>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <header className="h-16 bg-white border-b border-[#e4e7ed] flex items-center justify-between px-8">
              <h2 className="text-lg font-semibold text-[#111827]">Panel de Control</h2>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--green-100)] flex items-center justify-center text-[var(--green-700)] font-bold">
                  A
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-8 bg-[var(--gray-50)]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
