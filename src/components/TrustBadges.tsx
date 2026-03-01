import { Shield, Clock, Users, RefreshCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ScrollTriggeredCounter } from './ScrollTriggeredCounter';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Shield,
      title: t('100% pengarna tillbaka', '100% money-back', { no: '100% pengene tilbake', dk: '100% pengene tilbage' }),
      desc: t('Om du inte gillar demon', 'If you don\'t like the demo', { no: 'Hvis du ikke liker demoen', dk: 'Hvis du ikke kan lide demoen' }),
      hasCounter: true,
      counterValue: 100,
      counterSuffix: '%',
      labelSv: 'pengarna tillbaka',
      labelEn: 'money-back',
      labelNo: 'pengene tilbake',
      labelDk: 'pengene tilbage'
    },
    {
      icon: Clock,
      title: t('Svar inom 24h', 'Reply within 24h', { no: 'Svar innen 24t', dk: 'Svar inden 24t' }),
      desc: t('Snabb och personlig service', 'Fast and personal service', { no: 'Rask og personlig service', dk: 'Hurtig og personlig service' }),
      hasCounter: true,
      counterValue: 24,
      counterSuffix: 'h',
      labelSv: 'svar',
      labelEn: 'reply',
      labelNo: 'svar',
      labelDk: 'svar'
    },
    {
      icon: Users,
      title: t('50+ nöjda kunder', '50+ happy customers', { no: '50+ fornøyde kunder', dk: '50+ tilfredse kunder' }),
      desc: t('Företag som litar på oss', 'Businesses that trust us', { no: 'Bedrifter som stoler på oss', dk: 'Virksomheder der stoler på os' }),
      hasCounter: true,
      counterValue: 50,
      counterSuffix: '+',
      labelSv: 'nöjda kunder',
      labelEn: 'happy customers',
      labelNo: 'fornøyde kunder',
      labelDk: 'tilfredse kunder'
    },
    {
      icon: RefreshCcw,
      title: t('Demo inom 72h', 'Demo in 72h', { no: 'Demo innen 72t', dk: 'Demo inden 72t' }),
      desc: t('Snabb leverans garanterad', 'Fast delivery guaranteed', { no: 'Rask levering garantert', dk: 'Hurtig levering garanteret' }),
      hasCounter: true,
      counterValue: 72,
      counterSuffix: 'h',
      labelSv: 'demo',
      labelEn: 'demo',
      labelNo: 'demo',
      labelDk: 'demo'
    }
  ];

  return (
    <section className="section-padding py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background pointer-events-none" />
      <div className="container-wide relative">
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
                      {' '}{t(badge.labelSv, badge.labelEn, { no: badge.labelNo, dk: badge.labelDk })}
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
