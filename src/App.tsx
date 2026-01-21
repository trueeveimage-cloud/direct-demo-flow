import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import { NomiaIntro, useNomiaIntro } from "@/components/NomiaIntro";
import { CookieConsent } from "@/components/CookieConsent";
import { SEOHead } from "@/components/SEOHead";
import { PageTransition } from "@/components/PageTransition";
import { getAnalytics } from "@/lib/posthog";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import Index from "./pages/Index";
import FreeDemoPage from "./pages/FreeDemoPage";
import PricingPage from "./pages/PricingPage";
import PortfolioPage from "./pages/PortfolioPage";
import HowItWorksPage from "./pages/HowItWorksPage";
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
import NotFound from "./pages/NotFound";
import IndustryRestaurantsPage from "./pages/IndustryRestaurantsPage";
import IndustrySalonsPage from "./pages/IndustrySalonsPage";
import IndustryEcommercePage from "./pages/IndustryEcommercePage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import { ExitIntentPopup } from "./components/ExitIntentPopup";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/demo" element={<FreeDemoPage />} />
        <Route path="/priser" element={<PricingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/hur-det-fungerar" element={<HowItWorksPage />} />
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
        <Route path="/kundcase" element={<CaseStudiesPage />} />
        <Route path="/case/:slug" element={<CaseStudyPage />} />
        <Route path="/tjanster/restauranger" element={<IndustryRestaurantsPage />} />
        <Route path="/tjanster/salonger" element={<IndustrySalonsPage />} />
        <Route path="/tjanster/e-handel" element={<IndustryEcommercePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
}

function AppContent() {
  const { showIntro, isLoading, markIntroSeen, replayIntro } = useNomiaIntro();
  const [introComplete, setIntroComplete] = useState(false);
  const [showBlurTransition, setShowBlurTransition] = useState(false);
  
  // Konami code easter egg
  useKonamiCode();

  // Initialize analytics on mount
  useEffect(() => {
    getAnalytics();
  }, []);

  const handleIntroComplete = () => {
    markIntroSeen();
    setShowBlurTransition(true);
    // After 1 second blur transition, show the site
    setTimeout(() => {
      setIntroComplete(true);
      setShowBlurTransition(false);
    }, 1000);
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
      
      {/* Blur transition overlay - starts blurred during intro, then fades out over 1s */}
      {(shouldShowIntro || showBlurTransition) && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: showBlurTransition ? 0 : 1,
          }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          style={{
            backdropFilter: showBlurTransition ? 'blur(0px)' : 'blur(20px)',
            transition: 'backdrop-filter 1s ease-out'
          }}
          className="fixed inset-0 z-[99998] bg-background/30 pointer-events-none"
        />
      )}
      
      <BrowserRouter>
        <SEOHead />
        <Layout>
          <AnimatedRoutes />
        </Layout>
        <CookieConsent />
        <ExitIntentPopup />
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
