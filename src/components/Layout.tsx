import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { BackToTop } from './BackToTop';
import { ScrollProgress } from './ScrollProgress';
import { FloatingContactButton } from './FloatingContactButton';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollProgress />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </div>
  );
}
