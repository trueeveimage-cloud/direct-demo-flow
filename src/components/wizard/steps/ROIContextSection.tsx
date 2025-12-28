import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Globe, Users, DollarSign, MessageSquare, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { WizardFormData } from '../wizardConfig';

interface ROIContextSectionProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
};

const leadOptions = [
  { id: '0-10', label: { sv: '0–10 leads/mån', en: '0–10 leads/month' } },
  { id: '10-50', label: { sv: '10–50 leads/mån', en: '10–50 leads/month' } },
  { id: '50-200', label: { sv: '50–200 leads/mån', en: '50–200 leads/month' } },
  { id: '200+', label: { sv: '200+ leads/mån', en: '200+ leads/month' } },
];

const contactMethodOptions = [
  { id: 'call', label: { sv: 'Telefonsamtal', en: 'Phone calls' } },
  { id: 'dm', label: { sv: 'DM / Sociala medier', en: 'DM / Social media' } },
  { id: 'form', label: { sv: 'Kontaktformulär', en: 'Contact form' } },
  { id: 'walkin', label: { sv: 'Walk-in', en: 'Walk-in' } },
  { id: 'booking', label: { sv: 'Bokningssystem', en: 'Booking system' } },
];

const avgOrderOptions = [
  { id: '<50', label: { sv: 'Under 50 kr', en: 'Under $5' } },
  { id: '50-150', label: { sv: '50–150 kr', en: '$5–$15' } },
  { id: '150-500', label: { sv: '150–500 kr', en: '$15–$50' } },
  { id: '500-2000', label: { sv: '500–2000 kr', en: '$50–$200' } },
  { id: '2000+', label: { sv: '2000+ kr', en: '$200+' } },
];

const problemOptions = [
  { id: 'not-enough-calls', label: { sv: 'Får inte tillräckligt med samtal', en: 'Not getting enough calls' } },
  { id: 'not-enough-bookings', label: { sv: 'Får inte tillräckligt med bokningar', en: 'Not getting enough bookings' } },
  { id: 'same-questions', label: { sv: 'Folk ställer samma frågor hela tiden', en: 'People ask the same questions' } },
  { id: 'no-trust', label: { sv: 'Svårt att bygga förtroende', en: 'Hard to build trust' } },
  { id: 'hard-to-find', label: { sv: 'Svårt att hitta info om företaget', en: 'Hard to find info about the business' } },
];

const onlinePresenceOptions = [
  { id: 'instagram', label: { sv: 'Endast Instagram', en: 'Instagram only' } },
  { id: 'facebook', label: { sv: 'Endast Facebook', en: 'Facebook only' } },
  { id: 'google-business', label: { sv: 'Endast Google Business', en: 'Google Business only' } },
  { id: 'multiple-social', label: { sv: 'Flera sociala medier', en: 'Multiple social media' } },
  { id: 'none', label: { sv: 'Ingen online-närvaro', en: 'No online presence' } },
];

function ROIContextSectionComponent({ formData, setFormData }: ROIContextSectionProps) {
  const { t, lang } = useLanguage();

  const updateROI = (field: string, value: any) => {
    setFormData({
      ...formData,
      roiContext: {
        ...formData.roiContext,
        [field]: value
      }
    });
  };

  const roiContext = formData.roiContext || {};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-xl space-y-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h2 className="font-semibold text-lg">{t('Hjälp oss förstå ditt företag bättre', 'Help us understand your business better')}</h2>
        <InfoTooltip content={t('Dessa svar hjälper oss skapa en hemsida som ökar dina intäkter.', 'These answers help us build a website that increases your revenue.')} />
      </div>

      <div className="grid gap-4">
        {/* Current website */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Har du en hemsida idag?', 'Do you currently have a website?')}</Label>
            <InfoTooltip content={t('Hjälper oss förstå din nuvarande situation.', 'Helps us understand your current situation.')} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateROI('hasWebsite', true)}
              className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                roiContext.hasWebsite === true ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
              }`}
            >
              {t('Ja', 'Yes')}
            </button>
            <button
              type="button"
              onClick={() => updateROI('hasWebsite', false)}
              className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                roiContext.hasWebsite === false ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
              }`}
            >
              {t('Nej', 'No')}
            </button>
          </div>
          
          {roiContext.hasWebsite === true && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Input
                value={roiContext.currentWebsiteUrl || ''}
                onChange={(e) => updateROI('currentWebsiteUrl', e.target.value)}
                placeholder="www.example.com"
                className="h-10 mt-2"
              />
            </motion.div>
          )}
          
          {roiContext.hasWebsite === false && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Select value={roiContext.onlinePresence || ''} onValueChange={(v) => updateROI('onlinePresence', v)}>
                <SelectTrigger className="h-10 mt-2">
                  <SelectValue placeholder={t('Var finns du online idag?', 'Where are you online today?')} />
                </SelectTrigger>
                <SelectContent>
                  {onlinePresenceOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {lang === 'sv' ? opt.label.sv : opt.label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </div>

        {/* Monthly leads */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Ungefär hur många leads/förfrågningar får du idag?', 'Approximately how many leads/inquiries do you get today?')}</Label>
            <InfoTooltip content={t('Hjälper oss uppskatta potentiell tillväxt.', 'Helps us estimate potential growth.')} />
          </div>
          <Select value={roiContext.monthlyLeads || ''} onValueChange={(v) => updateROI('monthlyLeads', v)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('Välj antal', 'Select amount')} />
            </SelectTrigger>
            <SelectContent>
              {leadOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {lang === 'sv' ? opt.label.sv : opt.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact method */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Hur kontaktar kunder dig idag?', 'How do customers contact you today?')}</Label>
            <InfoTooltip content={t('Hjälper oss optimera kontaktvägar på hemsidan.', 'Helps us optimize contact paths on the website.')} />
          </div>
          <Select value={roiContext.contactMethod || ''} onValueChange={(v) => updateROI('contactMethod', v)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('Välj kontaktmetod', 'Select contact method')} />
            </SelectTrigger>
            <SelectContent>
              {contactMethodOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {lang === 'sv' ? opt.label.sv : opt.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Average order value */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Genomsnittligt ordervärde', 'Average order value')}</Label>
            <InfoTooltip content={t('Hjälper oss beräkna potentiell intäktsökning.', 'Helps us calculate potential revenue increase.')} />
          </div>
          <Select value={roiContext.avgOrderValue || ''} onValueChange={(v) => updateROI('avgOrderValue', v)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('Välj prisintervall', 'Select price range')} />
            </SelectTrigger>
            <SelectContent>
              {avgOrderOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {lang === 'sv' ? opt.label.sv : opt.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Top conversion problem */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Största problemet idag?', 'Biggest problem today?')}</Label>
            <InfoTooltip content={t('Vi fokuserar på att lösa just detta med din nya hemsida.', 'We focus on solving exactly this with your new website.')} />
          </div>
          <Select value={roiContext.topProblem || ''} onValueChange={(v) => updateROI('topProblem', v)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('Välj problem', 'Select problem')} />
            </SelectTrigger>
            <SelectContent>
              {problemOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {lang === 'sv' ? opt.label.sv : opt.label.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Website impact slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <Label>{t('Hur mycket skulle en bättre hemsida hjälpa?', 'How much would a better website help?')}</Label>
            <InfoTooltip content={t('1 = Lite, 5 = Väldigt mycket', '1 = A little, 5 = A lot')} />
          </div>
          <div className="px-2">
            <Slider
              value={[roiContext.websiteImpact || 3]}
              onValueChange={(v) => updateROI('websiteImpact', v[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{t('Lite', 'A little')}</span>
              <span>{t('Mycket', 'A lot')}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const ROIContextSection = memo(ROIContextSectionComponent);
