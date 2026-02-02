import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Persona Lookup | Tau2 Retail",
  description: "Look up user personas for testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} antialiased`}>
        <div className="min-h-screen">
          <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
                  τ2
                </div>
                <span className="text-lg font-semibold tracking-tight">Persona Lookup</span>
              </a>
              <span className="text-xs text-[var(--text-secondary)]">RETAIL TEST DATA</span>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
