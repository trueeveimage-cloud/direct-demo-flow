import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Clock, Users, Utensils, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';

import bambaImg from '@/assets/portfolio-bamba.png';
import ohMyCoffeeImg from '@/assets/portfolio-ohmycoffee.png';
import enDeliHagaImg from '@/assets/portfolio-endelihaga.png';

export default function IndustryRestaurantsPage() {
  const { t } = useLanguage();

  const features = [
    { icon: Utensils, title: t('Interaktiv meny', 'Interactive Menu'), desc: t('Visa er meny snyggt med bilder och beskrivningar.', 'Display your menu beautifully with images and descriptions.') },
    { icon: Calendar, title: t('Bordbokning', 'Table Booking'), desc: t('Låt gäster boka bord direkt online.', 'Let guests book tables directly online.') },
    { icon: MapPin, title: t('Hitta hit', 'Find Us'), desc: t('Google Maps-integration med öppettider.', 'Google Maps integration with opening hours.') },
    { icon: Star, title: t('Recensioner', 'Reviews'), desc: t('Visa era Google-recensioner automatiskt.', 'Display your Google reviews automatically.') },
  ];

  const projects = [
    { name: 'Bamba', type: t('Restaurang', 'Restaurant'), stat: '+177%', statLabel: t('bokningar/vecka', 'bookings/week'), image: bambaImg, url: 'https://bamba.lovable.app/' },
    { name: 'Oh My Coffee', type: t('Café', 'Café'), image: ohMyCoffeeImg, url: 'https://ohmycoffee-gbg-web.lovable.app/' },
    { name: 'En Deli Haga', type: t('Delikatess & Café', 'Deli & Café'), image: enDeliHagaImg, url: 'https://en-deli-cozy-vibes.lovable.app/' },
  ];

  return (
    <>
      <SEOHead 
        title={t('Webbdesign för Restauranger & Caféer | Nomia', 'Web Design for Restaurants & Cafés | Nomia')}
        description={t('Professionella webbplatser för restauranger, caféer och barer. Meny, bokning och Google Maps.', 'Professional websites for restaurants, cafés, and bars. Menu, booking, and Google Maps.')}
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
              <Utensils className="w-4 h-4" />
              {t('Restauranger & Caféer', 'Restaurants & Cafés')}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              {t('Fyll din restaurang med fler gäster', 'Fill your restaurant with more guests')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              {t('Webbplatser som gör gäster hungriga. Meny, bokning, och allt som behövs för att fylla stolarna.', 'Websites that make guests hungry. Menu, booking, and everything needed to fill the seats.')}
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
                { value: '+177%', label: t('bokningar', 'bookings') },
                { value: '72h', label: t('koncept leverans', 'concept delivery') },
                { value: '100%', label: t('mobilanpassat', 'mobile-ready') },
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
              {t('Allt en restaurang behöver', 'Everything a restaurant needs')}
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

        {/* Portfolio */}
        <section className="py-24 bg-secondary/30">
          <div className="container-wide section-padding">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              {t('Restauranger vi byggt', 'Restaurants we\'ve built')}
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50"
                >
                  {p.stat && (
                    <div className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold">
                      {p.stat} {p.statLabel}
                    </div>
                  )}
                  <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-bold text-primary-foreground">{p.name}</p>
                    <p className="text-sm text-primary-foreground/70">{p.type}</p>
                  </div>
                </motion.a>
              ))}
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
              {t('Redo att fylla stolarna?', 'Ready to fill the seats?')}
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
