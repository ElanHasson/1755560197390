import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why devcontainers WILL simplify your life and other flows',
  description: 'Devcontainers help with environment uniformity for a project, we want to show how to use them, why we use them, and the time it could save. Talk about repeatble environments and other related whys',
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