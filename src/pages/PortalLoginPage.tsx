import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

export default function PortalLoginPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/portal');
    } catch (err: any) {
      toast({ title: t('Fel', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin + '/portal',
        },
      });
      if (error) throw error;
      toast({ title: t('Konto skapat!', 'Account created!'), description: t('Kolla din e-post för verifiering.', 'Check your email for verification.') });
    } catch (err: any) {
      toast({ title: t('Fel', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/portal/reset-password',
      });
      if (error) throw error;
      toast({ title: t('Skickat!', 'Sent!'), description: t('Kolla din e-post.', 'Check your email.') });
      setShowForgot(false);
    } catch (err: any) {
      toast({ title: t('Fel', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-2">{t('Återställ lösenord', 'Reset password')}</h1>
            <p className="text-muted-foreground text-sm mb-6">{t('Ange din e-post så skickar vi en återställningslänk.', 'Enter your email and we\'ll send a reset link.')}</p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label>{t('E-post', 'Email')}</Label>
                <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('Skicka länk', 'Send link')}
              </Button>
              <button type="button" onClick={() => setShowForgot(false)} className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
                {t('Tillbaka till inloggning', 'Back to login')}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">NOMIA<span className="text-accent">.</span></h1>
            <p className="text-muted-foreground text-sm mt-2">
              {isLogin ? t('Logga in på din kundportal', 'Log in to your customer portal') : t('Skapa ditt kundkonto', 'Create your customer account')}
            </p>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <div>
                <Label>{t('Namn', 'Full name')}</Label>
                <div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10" required />
                </div>
              </div>
            )}
            <div>
              <Label>{t('E-post', 'Email')}</Label>
              <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>{t('Lösenord', 'Password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-accent hover:underline">
                {t('Glömt lösenordet?', 'Forgot password?')}
              </button>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              {isLogin ? t('Logga in', 'Log in') : t('Skapa konto', 'Create account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground">
              {isLogin ? t('Har du inget konto? Skapa ett', 'Don\'t have an account? Create one') : t('Har du redan ett konto? Logga in', 'Already have an account? Log in')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
