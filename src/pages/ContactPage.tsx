import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/AnimatedSection';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://getform.io/f/agdvpmpb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        setSubmitted(true);
        toast({ title: t('Meddelande skickat!', 'Message sent!'), description: t('Vi återkommer inom 24 timmar.', 'We\'ll get back to you within 24 hours.') });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({ title: t('Något gick fel', 'Something went wrong'), description: t('Försök igen senare.', 'Please try again later.'), variant: 'destructive' });
    }
  };

  return (
    <div className="section-padding py-20">
      <div className="container-narrow">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('Kontakta oss', 'Contact Us')}</h1>
          <p className="text-muted-foreground">{t('Har du frågor? Hör av dig så svarar vi inom 24 timmar.', 'Have questions? Reach out and we\'ll reply within 24 hours.')}</p>
        </AnimatedSection>

        {/* CTA Banner */}
        <AnimatedSection animation="fade-up" delay={50} className="mb-12">
          <div className="bg-accent-soft rounded-lg p-6 text-center">
            <h3 className="font-heading font-semibold text-lg mb-2">
              {t('Vill du se hur din sida kan se ut?', 'Want to see how your site could look?')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('Få ett gratis webb-koncept inom 72 timmar.', 'Get a free website concept within 72 hours.')}
            </p>
            <Button asChild className="group">
              <Link to="/demo">
                {t('Få ditt gratis koncept', 'Get your free concept')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <AnimatedSection animation="fade-right" delay={100}>
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
            <div className="bg-secondary/30 rounded-lg p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-6 h-6 text-accent" /></div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{t('Tack för ditt meddelande!', 'Thanks for your message!')}</h3>
                  <p className="text-muted-foreground text-sm">{t('Vi återkommer så snart som möjligt.', 'We\'ll get back to you as soon as possible.')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="name">{t('Namn', 'Name')} *</Label><Input id="name" name="name" required placeholder={t('Ditt namn', 'Your name')} /></div>
                  <div className="space-y-2"><Label htmlFor="email">E-post *</Label><Input id="email" name="email" type="email" required placeholder="din@email.se" /></div>
                  <div className="space-y-2"><Label htmlFor="subject">{t('Ämne', 'Subject')}</Label><Input id="subject" name="subject" placeholder={t('Vad gäller det?', 'What is it about?')} /></div>
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
