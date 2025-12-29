import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

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
  const [contactReason, setContactReason] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append('contact_reason', contactReason);
    
    try {
      const response = await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok || response.status === 0) {
        setSubmitted(true);
        toast({ title: t('Meddelande skickat!', 'Message sent!'), description: t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.') });
        form.reset();
        setContactReason('');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitted(true);
      toast({ title: t('Meddelande skickat!', 'Message sent!'), description: t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.') });
    }
  };

  const handleConceptClick = () => {
    setContactReason('concept-received');
    // Scroll to form
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('Kontakta oss', 'Contact Us')}</h1>
          <p className="text-muted-foreground">{t('Har du frågor? Hör av dig så svarar vi inom 24 timmar.', 'Have questions? Reach out and we\'ll reply within 24 hours.')}</p>
        </AnimatedSection>

        {/* Prominent Concept CTA */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-accent/10 to-transparent border border-accent/30 rounded-2xl p-8 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.15),transparent_70%)]" />
            <div className="relative z-10">
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
              <Button 
                size="lg" 
                onClick={handleConceptClick}
                className="group text-lg px-8 py-6 h-auto"
              >
                {t('Ja, jag vill prata om mitt koncept', 'Yes, I want to discuss my concept')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Secondary CTA Banner */}
        <AnimatedSection animation="fade-up" delay={100} className="mb-12">
          <div className="bg-secondary/30 rounded-lg p-6 text-center">
            <h3 className="font-heading font-semibold text-lg mb-2">
              {t('Inte fått ditt koncept än?', 'Haven\'t received your concept yet?')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('Få ett gratis webb-koncept inom 72 timmar.', 'Get a free website concept within 72 hours.')}
            </p>
            <Button asChild variant="outline" className="group">
              <Link to="/demo">
                {t('Få ditt gratis koncept', 'Get your free concept')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection animation="fade-right" delay={150}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-accent" /></div>
                <div><h3 className="font-heading font-semibold mb-1">E-post</h3><a href="mailto:nordicsite.help@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">nordicsite.help@gmail.com</a></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-accent" /></div>
                <div><h3 className="font-heading font-semibold mb-1">{t('Plats', 'Location')}</h3><p className="text-muted-foreground">Göteborg, Sverige</p></div>
              </div>
              <div className="pt-6 border-t border-border">
                <h3 className="font-heading font-semibold mb-2">{t('Svarstid', 'Response Time')}</h3>
                <p className="text-sm text-muted-foreground">{t('Vi svarar vanligtvis inom 24 timmar på vardagar.', 'We typically respond within 24 hours on weekdays.')}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection animation="fade-left" delay={200}>
            <div id="contact-form" className="bg-secondary/30 rounded-lg p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-6 h-6 text-accent" /></div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{t('Tack för ditt meddelande!', 'Thanks for your message!')}</h3>
                  <p className="text-muted-foreground text-sm">{t('Vi återkommer så snart som möjligt.', 'We\'ll get back to you as soon as possible.')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Contact Reason Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">{t('Vad gäller det?', 'What is this about?')} *</Label>
                    <Select value={contactReason} onValueChange={setContactReason} required>
                      <SelectTrigger className="bg-background">
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
                  
                  <div className="space-y-2"><Label htmlFor="name">{t('Namn', 'Name')} *</Label><Input id="name" name="name" required placeholder={t('Ditt namn', 'Your name')} /></div>
                  <div className="space-y-2"><Label htmlFor="email">E-post *</Label><Input id="email" name="email" type="email" required placeholder="din@email.se" /></div>
                  <div className="space-y-2"><Label htmlFor="message">{t('Meddelande', 'Message')} *</Label><Textarea id="message" name="message" required rows={4} placeholder={t('Berätta mer...', 'Tell us more...')} /></div>
                  <Button type="submit" className="w-full">{t('Skicka meddelande', 'Send message')}<Send className="w-4 h-4" /></Button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
