import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight, Sparkles, Instagram, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const contactReasons = [
  { value: 'concept-received', labelSv: 'Jag har fått mitt koncept', labelEn: 'I received my concept' },
  { value: 'general-question', labelSv: 'Allmän fråga', labelEn: 'General question' },
  { value: 'pricing', labelSv: 'Fråga om priser', labelEn: 'Question about pricing' },
  { value: 'support', labelSv: 'Support / Hjälp', labelEn: 'Support / Help' },
  { value: 'partnership', labelSv: 'Samarbete', labelEn: 'Partnership' },
  { value: 'other', labelSv: 'Annat', labelEn: 'Other' },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactReason, setContactReason] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message, contactReason },
      });

      if (error) throw error;
      
      setSubmitted(true);
      toast({ title: t('Meddelande skickat!', 'Message sent!'), description: t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.') });
      form.reset();
      setContactReason('');
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitted(true);
      toast({ title: t('Meddelande skickat!', 'Message sent!'), description: t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="section-padding pt-28 pb-20 relative z-10">
        <div className="container-narrow">
          {/* Header */}
          <div className="animate-hero-fade-in text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('Svar inom 24 timmar', 'Reply within 24 hours')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {t('Kontakta ', 'Contact ')}
              <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
                {t('oss', 'us')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('Har du frågor? Hör av dig så svarar vi inom 24 timmar.', 'Have questions? Reach out and we\'ll reply within 24 hours.')}
            </p>
          </div>

          {/* Prominent Concept CTA */}
          <div className="animate-hero-fade-in animation-delay-100 mb-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/15 via-accent/5 to-transparent rounded-2xl border border-accent/30 p-8 sm:p-10">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-accent/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-accent/30 rounded-br-2xl" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  {t('Fått ditt koncept?', 'Received your concept?')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  {t('Har du fått ditt gratis koncept?', 'Have you received your free concept?')}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {t('Berätta vad du tycker och ta nästa steg.', 'Tell us what you think and take the next step.')}
                </p>
                <Button asChild size="lg" className="rounded-full group text-base px-8 w-full sm:w-auto">
                  <Link to="/efter-demo">
                    {t('Ja, jag vill prata om mitt koncept', 'Yes, I want to discuss my concept')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="animate-hero-fade-in animation-delay-200 mb-12">
            <div className="bg-secondary/30 rounded-xl p-6 text-center border border-border/50">
              <h3 className="font-semibold text-lg mb-2">
                {t('Inte fått ditt koncept än?', 'Haven\'t received your concept yet?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('Få ett gratis koncept inom 72 timmar.', 'Get a free concept within 72 hours.')}
              </p>
              <Button asChild variant="outline" className="rounded-full group">
                <Link to="/demo">
                  {t('Få ditt gratis koncept', 'Get your free concept')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-2 animate-hero-fade-in animation-delay-300">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">E-post</h3>
                  <a href="mailto:nordicsite.help@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    nordicsite.help@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t('Plats', 'Location')}</h3>
                  <p className="text-muted-foreground">Göteborg, Sverige</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                  <Instagram className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instagram</h3>
                  <a href="https://www.instagram.com/nomia.se/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    @nomia.se
                  </a>
                </div>
              </div>
              
              <div className="pt-4 mt-4 border-t border-border mx-4">
                <h3 className="font-semibold mb-2">{t('Svarstid', 'Response Time')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('Vi svarar vanligtvis inom 24 timmar.', 'We typically respond within 24 hours.')}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-hero-fade-in animation-delay-400">
              <div className="relative bg-secondary/30 rounded-2xl p-6 sm:p-8 border border-border/50 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                      <Send className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{t('Tack för ditt meddelande!', 'Thanks for your message!')}</h3>
                    <p className="text-muted-foreground">{t('Vi återkommer så snart som möjligt.', 'We\'ll get back to you soon.')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="reason">{t('Vad gäller det?', 'What is this about?')} *</Label>
                      <Select value={contactReason} onValueChange={setContactReason} required>
                        <SelectTrigger className="bg-background rounded-xl">
                          <SelectValue placeholder={t('Välj ett ämne...', 'Choose a topic...')} />
                        </SelectTrigger>
                        <SelectContent>
                          {contactReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {t(reason.labelSv, reason.labelEn)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('Namn', 'Name')} *</Label>
                      <Input id="name" name="name" required placeholder={t('Ditt namn', 'Your name')} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-post *</Label>
                      <Input id="email" name="email" type="email" required placeholder="din@email.se" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('Meddelande', 'Message')} *</Label>
                      <Textarea id="message" name="message" required rows={4} placeholder={t('Berätta mer...', 'Tell us more...')} className="rounded-xl" />
                    </div>
                    <Button type="submit" className="w-full rounded-xl group" disabled={isSubmitting}>
                      {isSubmitting ? t('Skickar...', 'Sending...') : t('Skicka meddelande', 'Send message')}
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
