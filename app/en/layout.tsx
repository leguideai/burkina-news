import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Burkina News — Facts. Data. Direction.',
  description: 'Understanding what is really changing in Burkina Faso. Monthly investigative journal and live infrastructure tracker.',
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer lang="en" />
    </>
  );
}
