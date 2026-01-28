import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Debounce helper
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useEmailCapture(source: string = 'wizard') {
  const capturedEmails = useRef<Set<string>>(new Set());

  const captureEmail = useCallback(
    debounce(async (email: string, businessName?: string) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      
      // Don't capture the same email twice in this session
      if (capturedEmails.current.has(email)) return;
      capturedEmails.current.add(email);

      try {
        // Check if email already exists
        const { data: existing } = await supabase
          .from('email_captures')
          .select('id')
          .eq('email', email)
          .eq('source', source)
          .maybeSingle();

        if (existing) {
          console.log('[EmailCapture] Email already captured:', email);
          return;
        }

        // Insert new capture
        const { error } = await supabase
          .from('email_captures')
          .insert({
            email,
            business_name: businessName || null,
            source,
            user_agent: navigator.userAgent || null,
          });

        if (error) {
          console.error('[EmailCapture] Error:', error);
        } else {
          console.log('[EmailCapture] Captured:', email, 'from', source);
        }
      } catch (err) {
        console.error('[EmailCapture] Failed:', err);
      }
    }, 1500), // 1.5 second debounce
    [source]
  );

  return { captureEmail };
}
