import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
