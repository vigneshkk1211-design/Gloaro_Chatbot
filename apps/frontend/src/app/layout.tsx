import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'WhatsApp Team Inbox | Admin Dashboard',
  description:
    'Production-grade WhatsApp Automation Chatbot Admin Dashboard. Manage conversations, switch between bot and human agent modes, and reply to customers in real time.',
  keywords: ['WhatsApp', 'chatbot', 'team inbox', 'admin dashboard', 'automation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
