import { Shield, Clock, Users, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedSection } from './AnimatedSection';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: t('100% pengarna tillbaka', '100% money-back'),
      desc: t('Om du inte gillar demon', 'If you don\'t like the demo')
    },
    {
      icon: Clock,
      title: t('Svar inom 24h', 'Reply within 24h'),
      desc: t('Snabb och personlig service', 'Fast and personal service')
    },
    {
      icon: Users,
      title: t('50+ nöjda kunder', '50+ happy customers'),
      desc: t('Småföretag som oss litar på', 'Small businesses trust us')
    },
    {
      icon: RefreshCcw,
      title: t('Demo inom 72h', 'Demo in 72h'),
      desc: t('Snabb leverans garanterad', 'Fast delivery guaranteed')
    }
  ];

  return (
    <section className="section-padding py-12 border-y border-border bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={index * 75}>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <badge.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
