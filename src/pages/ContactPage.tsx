import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight, Sparkles, Instagram, MessageSquare, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, useInView } from 'framer-motion';

const contactReasons = [
  { value: 'concept-received', labelSv: 'Jag har fått mitt koncept', labelEn: 'I received my concept' },
  { value: 'general-question', labelSv: 'Allmän fråga', labelEn: 'General question' },
  { value: 'pricing', labelSv: 'Fråga om priser', labelEn: 'Question about pricing' },
  { value: 'support', labelSv: 'Support / Hjälp', labelEn: 'Support / Help' },
  { value: 'partnership', labelSv: 'Samarbete', labelEn: 'Partnership' },
  { value: 'other', labelSv: 'Annat', labelEn: 'Other' },
];

// Floating decorative element
const FloatingIcon = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// Contact info item component
const ContactInfoItem = ({ icon: Icon, title, content, href, delay }: { 
  icon: any; 
  title: string; 
  content: string; 
  href?: string; 
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-300">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-accent/20 group-hover:bg-accent/20 transition-colors"
        >
          <Icon className="w-5 h-5 text-accent" />
        </motion.div>
        <div>
          <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">{title}</h3>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              {content}
            </a>
          ) : (
            <p className="text-muted-foreground">{content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactReason, setContactReason] = useState('');
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true });

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
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
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

      {/* Floating decorative elements - hidden on mobile */}
      <div className="hidden md:block">
        <FloatingIcon delay={0} className="top-32 left-[8%]">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-accent/40" />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={1.5} className="top-48 right-[12%]">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary/40" />
          </div>
        </FloatingIcon>
        <FloatingIcon delay={3} className="bottom-40 left-[15%]">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent/40" />
          </div>
        </FloatingIcon>
      </div>

      <div className="section-padding py-20 relative z-10">
        <div className="container-narrow">
          {/* Header */}
          <motion.div 
            ref={heroRef}
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                {t('Svar inom 24 timmar', 'Reply within 24 hours')}
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {t('Kontakta ', 'Contact ')}
              <span className="bg-gradient-to-r from-accent via-orange-400 to-accent bg-clip-text text-transparent">
                {t('oss', 'us')}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('Har du frågor? Hör av dig så svarar vi inom 24 timmar.', 'Have questions? Reach out and we\'ll reply within 24 hours.')}
            </p>
          </motion.div>

          {/* Prominent Concept CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/15 via-accent/5 to-transparent rounded-2xl border border-accent/30 p-8 sm:p-10">
              {/* Animated gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Corner accents */}
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
                  {t('Berätta vad du tycker och ta nästa steg mot din nya hemsida.', 'Tell us what you think and take the next step towards your new website.')}
                </p>
                <Button asChild size="lg" className="rounded-full group text-lg px-8">
                  <Link to="/efter-demo">
                    {t('Ja, jag vill prata om mitt koncept', 'Yes, I want to discuss my concept')}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="bg-secondary/30 rounded-xl p-6 text-center border border-border/50">
              <h3 className="font-semibold text-lg mb-2">
                {t('Inte fått ditt koncept än?', 'Haven\'t received your concept yet?')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('Få ett gratis webb-koncept inom 72 timmar.', 'Get a free website concept within 72 hours.')}
              </p>
              <Button asChild variant="outline" className="rounded-full group">
                <Link to="/demo">
                  {t('Få ditt gratis koncept', 'Get your free concept')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-2">
              <ContactInfoItem 
                icon={Mail} 
                title="E-post" 
                content="nordicsite.help@gmail.com" 
                href="mailto:nordicsite.help@gmail.com"
                delay={0.1}
              />
              <ContactInfoItem 
                icon={MapPin} 
                title={t('Plats', 'Location')} 
                content="Göteborg, Sverige"
                delay={0.2}
              />
              <ContactInfoItem 
                icon={Instagram} 
                title="Instagram" 
                content="@nomia.se" 
                href="https://www.instagram.com/nomia.se/"
                delay={0.3}
              />
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all duration-300">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-accent/20 group-hover:bg-accent/20 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-accent" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">TikTok</h3>
                    <a href="https://www.tiktok.com/@nomia.se" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      @nomia.se
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="pt-4 mt-4 border-t border-border mx-4"
              >
                <h3 className="font-semibold mb-2">{t('Svarstid', 'Response Time')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('Vi svarar vanligtvis inom 24 timmar på vardagar.', 'We typically respond within 24 hours on weekdays.')}
                </p>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div 
              ref={formRef}
              initial={{ opacity: 0, x: 30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative bg-secondary/30 rounded-2xl p-6 sm:p-8 border border-border/50 overflow-hidden">
                {/* Form glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                
                {submitted ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20"
                    >
                      <Send className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h3 className="font-semibold text-xl mb-2">{t('Tack för ditt meddelande!', 'Thanks for your message!')}</h3>
                    <p className="text-muted-foreground">{t('Vi återkommer så snart som möjligt.', 'We\'ll get back to you as soon as possible.')}</p>
                  </motion.div>
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}