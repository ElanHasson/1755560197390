import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webinar Presentation',
  description: 'AI-Generated Webinar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}