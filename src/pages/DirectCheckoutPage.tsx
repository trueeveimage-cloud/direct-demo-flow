import { useState, useEffect } from 'react';
import { WebsiteOrderWizard } from '@/components/wizard';
import { WizardSkeleton } from '@/components/wizard/WizardSkeleton';

export default function DirectCheckoutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Brief loading state to allow fonts and styles to load
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <WizardSkeleton />;
  }

  return <WebsiteOrderWizard isPostDemoFlow={false} />;
}
