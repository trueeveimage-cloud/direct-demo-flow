import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Clock, Users, Scissors, Calendar, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';

import gailsHairImg from '@/assets/portfolio-gailshair.png';

export default function IndustrySalonsPage() {
  const { t } = useLanguage();

  const features = [
    { icon: Calendar, title: t('Online-bokning', 'Online Booking'), desc: t('Ditt eget bokningssystem – inga tredjepartsavgifter.', 'Your own booking system – no third-party fees.') },
    { icon: Image, title: t('Före/Efter-galleri', 'Before/After Gallery'), desc: t('Visa dina transformationer och öka konverteringar.', 'Showcase your transformations and boost conversions.') },
    { icon: Star, title: t('Recensioner', 'Reviews'), desc: t('Automatisk visning av Google-recensioner.', 'Automatic display of Google reviews.') },
    { icon: Users, title: t('Team-presentation', 'Team Showcase'), desc: t('Låt kunder välja sin favoritstylist.', 'Let clients choose their favorite stylist.') },
  ];

  return (
    <>
      <SEOHead 
        title={t('Webbdesign för Frisörer & Salonger | Nomia', 'Web Design for Salons & Barbers | Nomia')}
        description={t('Professionella webbplatser för frisörer, salonger och barbershops. Bokning, galleri och recensioner.', 'Professional websites for salons and barbers. Booking, gallery, and reviews.')}
      />
      <div className="overflow-hidden">
        {/* Hero */}
        <section className="min-h-[60vh] flex items-center relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
          <div className="container-narrow text-center relative z-10 section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6"
            >
              <Scissors className="w-4 h-4" />
              {t('Frisörer & Salonger', 'Salons & Barbers')}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              {t('Fyll din kalender automatiskt', 'Fill your calendar automatically')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              {t('Webbplatser som konverterar besökare till bokade tider. Eget bokningssystem, galleri och allt du behöver.', 'Websites that convert visitors into booked appointments. Your own booking system, gallery, and everything you need.')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="group">
                <Link to="/demo">
                  {t('Få gratis koncept', 'Get free concept')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/portfolio">{t('Se exempel', 'See examples')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 border-y border-border/50">
          <div className="container-wide section-padding">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '+89%', label: t('bokningar', 'bookings') },
                { value: '€0', label: t('tredjepartsavgifter', 'third-party fees') },
                { value: '24/7', label: t('online-bokning', 'online booking') },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="container-wide section-padding">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              {t('Allt en salong behöver', 'Everything a salon needs')}
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl border border-border/50 bg-secondary/30"
                >
                  <f.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="py-24 bg-secondary/30">
          <div className="container-wide section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-accent font-medium text-sm">CASE STUDY</span>
                <h2 className="text-3xl font-bold mt-2 mb-4">Gail's Hair Gallery</h2>
                <p className="text-muted-foreground mb-6">
                  {t('En frisörsalong som gick från telefonbokningar till ett fullt automatiserat bokningssystem. Resultatet? 89% fler bokningar på bara 3 månader.', 'A hair salon that went from phone bookings to a fully automated booking system. The result? 89% more bookings in just 3 months.')}
                </p>
                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-accent">+89%</div>
                    <div className="text-sm text-muted-foreground">{t('Bokningar', 'Bookings')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">-50%</div>
                    <div className="text-sm text-muted-foreground">{t('Telefonsamtal', 'Phone calls')}</div>
                  </div>
                </div>
                <Button asChild className="group">
                  <a href="https://gailshairgallery.lovable.app/book" target="_blank" rel="noopener noreferrer">
                    {t('Se live-sajt', 'View live site')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-border/50"
              >
                <img src={gailsHairImg} alt="Gail's Hair Gallery" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container-narrow section-padding text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              {t('Redo att fylla kalendern?', 'Ready to fill your calendar?')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-8"
            >
              {t('Få ett gratis koncept inom 72 timmar.', 'Get a free concept within 72 hours.')}
            </motion.p>
            <Button asChild size="lg" className="group">
              <Link to="/demo">
                {t('Kom igång gratis', 'Get started free')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
