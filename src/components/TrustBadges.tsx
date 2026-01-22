import { Shield, Clock, Users, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ScrollTriggeredCounter } from './ScrollTriggeredCounter';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: t('100% pengarna tillbaka', '100% money-back'),
      desc: t('Om du inte gillar demon', 'If you don\'t like the demo'),
      hasCounter: true,
      counterValue: 100,
      counterSuffix: '%',
      labelSv: 'pengarna tillbaka',
      labelEn: 'money-back'
    },
    {
      icon: Clock,
      title: t('Svar inom 24h', 'Reply within 24h'),
      desc: t('Snabb och personlig service', 'Fast and personal service'),
      hasCounter: true,
      counterValue: 24,
      counterSuffix: 'h',
      labelSv: 'svar',
      labelEn: 'reply'
    },
    {
      icon: Users,
      title: t('50+ nöjda kunder', '50+ happy customers'),
      desc: t('Företag som litar på oss', 'Businesses that trust us'),
      hasCounter: true,
      counterValue: 50,
      counterSuffix: '+',
      labelSv: 'nöjda kunder',
      labelEn: 'happy customers'
    },
    {
      icon: RefreshCcw,
      title: t('Demo inom 72h', 'Demo in 72h'),
      desc: t('Snabb leverans garanterad', 'Fast delivery guaranteed'),
      hasCounter: true,
      counterValue: 72,
      counterSuffix: 'h',
      labelSv: 'demo',
      labelEn: 'demo'
    }
  ];

  return (
    <section className="section-padding py-12 border-y border-border bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <badge.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-heading font-semibold text-sm">
                  {badge.hasCounter ? (
                    <>
                      <ScrollTriggeredCounter 
                        end={badge.counterValue} 
                        duration={1500} 
                        suffix={badge.counterSuffix}
                        className="text-accent"
                      />
                      {' '}{t(badge.labelSv, badge.labelEn)}
                    </>
                  ) : badge.title}
                </p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}