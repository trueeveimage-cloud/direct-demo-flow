import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, ShoppingCart, CreditCard, Package, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';

export default function IndustryEcommercePage() {
  const { t } = useLanguage();

  const features = [
    { icon: ShoppingCart, title: t('Produktkatalog', 'Product Catalog'), desc: t('Visa produkter med bilder, priser och varianter.', 'Display products with images, prices, and variants.') },
    { icon: CreditCard, title: t('Säker betalning', 'Secure Checkout'), desc: t('Stripe, Klarna och fler betalmetoder.', 'Stripe, Klarna, and more payment methods.') },
    { icon: Package, title: t('Orderhantering', 'Order Management'), desc: t('Håll koll på ordrar och lager.', 'Keep track of orders and inventory.') },
    { icon: Shield, title: t('SSL & GDPR', 'SSL & GDPR'), desc: t('Säkerhet och compliance inbyggt.', 'Security and compliance built-in.') },
  ];

  const benefits = [
    t('Inga månadsavgifter som Shopify', 'No monthly fees like Shopify'),
    t('Full kontroll över din butik', 'Full control over your store'),
    t('Anpassad design som matchar ditt varumärke', 'Custom design that matches your brand'),
    t('Snabb laddtid = bättre konvertering', 'Fast load time = better conversion'),
  ];

  return (
    <>
      <SEOHead 
        title={t('Webbdesign för E-handel & Onlinebutiker | Nomia', 'Web Design for E-commerce & Online Stores | Nomia')}
        description={t('Professionella e-handelswebbplatser utan månadsavgifter. Produkter, betalning och ordrar.', 'Professional e-commerce websites without monthly fees. Products, payments, and orders.')}
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
              <ShoppingCart className="w-4 h-4" />
              {t('E-handel', 'E-commerce')}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              {t('Sälj online utan månadsavgifter', 'Sell online without monthly fees')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              {t('Slipp Shopifys avgifter. Få en skräddarsydd e-handelslösning som du äger helt.', 'Skip Shopify\'s fees. Get a custom e-commerce solution you fully own.')}
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
                <Link to="/priser">{t('Se priser', 'View pricing')}</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 border-y border-border/50">
          <div className="container-wide section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold">{t('Varför Nomia istället för Shopify?', 'Why Nomia instead of Shopify?')}</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{b}</span>
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
              {t('Allt du behöver för att sälja', 'Everything you need to sell')}
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

        {/* Pricing comparison */}
        <section className="py-24 bg-secondary/30">
          <div className="container-narrow section-padding">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-12"
            >
              {t('Jämför kostnader', 'Compare costs')}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shopify */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-border/50 bg-background"
              >
                <h3 className="font-semibold text-lg mb-4 text-muted-foreground">Shopify</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>{t('Månadsavgift', 'Monthly fee')}</span><span>~€30/mån</span></div>
                  <div className="flex justify-between"><span>{t('Transaktionsavgift', 'Transaction fee')}</span><span>2%+</span></div>
                  <div className="flex justify-between"><span>{t('Appar & plugins', 'Apps & plugins')}</span><span>~€50/mån</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border"><span>{t('År 1 totalt', 'Year 1 total')}</span><span>~€1,000+</span></div>
                </div>
              </motion.div>
              
              {/* Nomia */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border-2 border-accent bg-accent/5"
              >
                <h3 className="font-semibold text-lg mb-4 text-accent">Nomia</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>{t('Engångspris', 'One-time price')}</span><span>€790-€1,290</span></div>
                  <div className="flex justify-between"><span>{t('Månadsavgift', 'Monthly fee')}</span><span>€25-€75</span></div>
                  <div className="flex justify-between"><span>{t('Transaktionsavgift', 'Transaction fee')}</span><span>€0</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t border-accent/30"><span>{t('År 1 totalt', 'Year 1 total')}</span><span>~€1,100</span></div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">{t('+ du äger allt, ingen inlåsning', '+ you own everything, no lock-in')}</p>
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
              {t('Redo att börja sälja?', 'Ready to start selling?')}
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
