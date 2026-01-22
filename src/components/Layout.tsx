import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  // Hide layout elements on admin page
  const isAdminPage = location.pathname === '/admin';
  
  // Hide header/footer on ordering pages (they have their own standalone layout)
  const isOrderingPage = ['/bestall', '/efter-demo', '/demo'].includes(location.pathname);

  if (isAdminPage || isOrderingPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollProgress />
      <main className="flex-1 [&_.scroll-snap-container]:h-auto [&_.scroll-snap-container]:overflow-visible">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <FloatingContactButton />
    </div>
  );
}
