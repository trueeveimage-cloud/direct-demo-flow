import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { NomiaIntro, useNomiaIntro } from "@/components/NomiaIntro";
import { CookieConsent } from "@/components/CookieConsent";
import { SEOHead } from "@/components/SEOHead";
import { getAnalytics } from "@/lib/posthog";
import Index from "./pages/Index";
import FreeDemoPage from "./pages/FreeDemoPage";
import PricingPage from "./pages/PricingPage";
import PortfolioPage from "./pages/PortfolioPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import PostDemoPage from "./pages/PostDemoPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import DirectCheckoutPage from "./pages/DirectCheckoutPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelledPage from "./pages/PaymentCancelledPage";
import AdminPage from "./pages/AdminPage";
import GalleryPage from "./pages/GalleryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { showIntro, isLoading, markIntroSeen, replayIntro } = useNomiaIntro();
  const [introComplete, setIntroComplete] = useState(false);

  // Initialize analytics on mount
  useEffect(() => {
    getAnalytics();
  }, []);

  const handleIntroComplete = () => {
    markIntroSeen();
    setIntroComplete(true);
  };

  // Store replayIntro in window for footer access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__nomiaReplayIntro = replayIntro;
    }
  }, [replayIntro]);

  // Show loading state briefly while checking localStorage
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-[99999]" />
    );
  }

  // Determine if we should show the intro
  const shouldShowIntro = showIntro && !introComplete;

  return (
    <>
      {shouldShowIntro && (
        <NomiaIntro onComplete={handleIntroComplete} />
      )}
      <BrowserRouter>
        <SEOHead />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<FreeDemoPage />} />
            <Route path="/priser" element={<PricingPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<CaseStudyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/villkor" element={<TermsPage />} />
            <Route path="/integritet" element={<PrivacyPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/efter-demo" element={<PostDemoPage />} />
            <Route path="/bestall" element={<DirectCheckoutPage />} />
            <Route path="/betalning-klar" element={<PaymentSuccessPage />} />
            <Route path="/betalning-avbruten" element={<PaymentCancelledPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <CookieConsent />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
