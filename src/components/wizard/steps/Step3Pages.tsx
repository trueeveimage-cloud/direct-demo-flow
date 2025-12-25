import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, Calendar, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';
import { toast } from '@/hooks/use-toast';
import { WizardFormData, packages, pageOptions, appointmentDurations } from '../wizardConfig';

interface Step3PagesProps {
  formData: WizardFormData;
  setFormData: (data: WizardFormData) => void;
  errors: Record<string, boolean>;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" as const }
  })
};

export function Step3Pages({ formData, setFormData, errors }: Step3PagesProps) {
  const { t, lang } = useLanguage();
  const pkg = packages.find(p => p.id === formData.selectedPackage);

  const updateField = <K extends keyof WizardFormData>(field: K, value: WizardFormData[K]) => {
    setFormData({ ...formData, [field]: value });
  };

  const getTotalPages = () => {
    return formData.selectedPages.length + formData.customPages.filter(p => p.trim()).length;
  };

  const getCurrentPackageLimit = () => pkg?.maxPages || 0;

  const togglePage = (pageId: string) => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();

    if (!formData.selectedPages.includes(pageId)) {
      if (total >= limit) {
        toast({
          title: t('Sidbegränsning', 'Page limit'),
          description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
          variant: 'destructive',
        });
        return;
      }
      updateField('selectedPages', [...formData.selectedPages, pageId]);
    } else {
      updateField('selectedPages', formData.selectedPages.filter(p => p !== pageId));
    }
  };

  const addCustomPage = () => {
    const total = getTotalPages();
    const limit = getCurrentPackageLimit();
    if (total >= limit) {
      toast({
        title: t('Sidbegränsning', 'Page limit'),
        description: t('Du behöver ett större paket för fler sidor.', 'You need a larger package for more pages.'),
        variant: 'destructive',
      });
      return;
    }
    updateField('customPages', [...formData.customPages, '']);
  };

  const removeCustomPage = (index: number) => {
    updateField('customPages', formData.customPages.filter((_, i) => i !== index));
  };

  const updateCustomPage = (index: number, value: string) => {
    const updated = [...formData.customPages];
    updated[index] = value;
    updateField('customPages', updated);
  };

  const toggleAppointmentLength = (duration: string) => {
    if (formData.appointmentLengths.includes(duration)) {
      updateField('appointmentLengths', formData.appointmentLengths.filter(d => d !== duration));
    } else {
      updateField('appointmentLengths', [...formData.appointmentLengths, duration]);
    }
  };

  const addBookingService = () => {
    updateField('bookingServices', [...formData.bookingServices, { name: '', duration: '', price: '' }]);
  };

  const removeBookingService = (index: number) => {
    if (formData.bookingServices.length > 1) {
      updateField('bookingServices', formData.bookingServices.filter((_, i) => i !== index));
    }
  };

  const updateBookingService = (index: number, field: keyof typeof formData.bookingServices[0], value: string) => {
    const updated = [...formData.bookingServices];
    updated[index] = { ...updated[index], [field]: value };
    updateField('bookingServices', updated);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Selection */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-lg">{t('Välj sidor', 'Choose pages')}</h2>
            <InfoTooltip content={t('Välj vilka sidor du vill ha på din webbplats.', 'Choose which pages you want on your website.')} />
          </div>
          <span className={`text-sm font-medium ${getTotalPages() >= getCurrentPackageLimit() ? 'text-destructive' : 'text-muted-foreground'}`}>
            {getTotalPages()} / {getCurrentPackageLimit()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {pageOptions.map((page, i) => (
            <motion.button
              key={page.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => togglePage(page.id)}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                formData.selectedPages.includes(page.id) 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {lang === 'sv' ? page.label.sv : page.label.en}
            </motion.button>
          ))}
        </div>

        {/* Custom Pages */}
        <div className="mt-4 space-y-2">
          <Label>{t('Egna sidor', 'Custom pages')}</Label>
          <AnimatePresence mode="popLayout">
            {formData.customPages.map((cp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2"
              >
                <Input
                  value={cp}
                  onChange={(e) => updateCustomPage(index, e.target.value)}
                  placeholder={t('Sidnamn...', 'Page name...')}
                  className="h-10"
                />
                {formData.customPages.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeCustomPage(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <Button variant="outline" size="sm" onClick={addCustomPage}>
            <Plus className="w-4 h-4 mr-1" /> {t('Lägg till sida', 'Add page')}
          </Button>
        </div>
      </motion.div>

      {/* Services */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-lg">{t('Tjänster & Priser', 'Services & Prices')} *</h2>
          <InfoTooltip content={t('Beskriv dina tjänster och priser så vi kan presentera dem på webbplatsen.', 'Describe your services and prices so we can present them on the website.')} />
        </div>
        <Textarea 
          value={formData.services} 
          onChange={(e) => updateField('services', e.target.value)} 
          placeholder={`${t('Exempel:', 'Example:')}
Herrklippning - 350 kr
Damklippning - 450 kr
Skäggformning - 200 kr`}
          rows={5} 
          className={`${errors.services ? 'border-destructive animate-shake' : ''}`}
        />
      </motion.div>

      {/* Images & Logo */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 bg-secondary/50 rounded-xl space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">{t('Bilder & Logotyp', 'Images & Logo')}</h3>
          <InfoTooltip content={t('Ladda upp dina bilder och logotyp direkt nedan, eller kryssa i om du saknar material.', 'Upload your images and logo directly below, or check if you don\'t have materials.')} />
        </div>
        
        <div className="space-y-3">
          <Label>{t('Ladda upp logotyp', 'Upload logo')}</Label>
          <Input type="file" accept="image/*" className="h-12" disabled={formData.noLogo} />
        </div>
        
        <div className="space-y-3">
          <Label>{t('Ladda upp bilder', 'Upload images')}</Label>
          <Input type="file" accept="image/*" multiple className="h-12" disabled={formData.useStock} />
          <p className="text-xs text-muted-foreground">
            {t('Du kan välja flera bilder samtidigt.', 'You can select multiple images at once.')}
          </p>
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={formData.noLogo} onCheckedChange={(c) => updateField('noLogo', c === true)} />
          <span className="text-sm">{t('Jag har ingen logotyp (ni kan skapa en enkel)', 'I don\'t have a logo (you can create a simple one)')}</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox checked={formData.useStock} onCheckedChange={(c) => updateField('useStock', c === true)} />
          <span className="text-sm">{t('Använd stockbilder (jag har inga egna bilder)', 'Use stock images (I don\'t have my own images)')}</span>
        </label>
      </motion.div>

      {/* Booking Requirements - Progressive disclosure */}
      <AnimatePresence>
        {formData.wantsBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-accent/5 border border-accent/20 rounded-xl space-y-6"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-lg">{t('Bokningskrav', 'Booking requirements')}</h3>
              <InfoTooltip content={t('Information som behövs för att konfigurera ditt bokningssystem.', 'Information needed to configure your booking system.')} />
            </div>

            <div>
              <Label>{t('Öppettider', 'Opening hours')} *</Label>
              <Textarea 
                value={formData.openingHours} 
                onChange={(e) => updateField('openingHours', e.target.value)} 
                placeholder={`${t('Exempel:', 'Example:')}
Mån-Fre: 09:00-18:00
Lör: 10:00-15:00
Sön: Stängt`}
                rows={4} 
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>{t('Tidsalternativ för bokningar', 'Appointment length options')}</Label>
                <InfoTooltip content={t('Välj vilka tidslängder kunder kan boka.', 'Choose which time lengths customers can book.')} />
              </div>
              <div className="flex flex-wrap gap-2">
                {appointmentDurations.filter(d => d !== 'custom').map((duration) => (
                  <motion.button
                    key={duration}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAppointmentLength(duration)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm transition-all ${
                      formData.appointmentLengths.includes(duration) ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {duration} min
                  </motion.button>
                ))}
              </div>
              <Input 
                value={formData.customAppointmentLength} 
                onChange={(e) => updateField('customAppointmentLength', e.target.value)} 
                placeholder={t('Annan längd (t.ex. 120 min)', 'Other length (e.g. 120 min)')} 
                className="h-10 mt-2"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>{t('Tjänster att boka', 'Services to book')}</Label>
                <InfoTooltip content={t('Lista tjänster som kan bokas med längd och pris.', 'List services that can be booked with duration and price.')} />
              </div>
              <div className="space-y-2">
                {formData.bookingServices.map((service, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input 
                      value={service.name} 
                      onChange={(e) => updateBookingService(index, 'name', e.target.value)} 
                      placeholder={t('Tjänstnamn', 'Service name')} 
                      className="h-10 flex-1"
                    />
                    <Input 
                      value={service.duration} 
                      onChange={(e) => updateBookingService(index, 'duration', e.target.value)} 
                      placeholder={t('Längd', 'Duration')} 
                      className="h-10 w-24"
                    />
                    <Input 
                      value={service.price} 
                      onChange={(e) => updateBookingService(index, 'price', e.target.value)} 
                      placeholder={t('Pris', 'Price')} 
                      className="h-10 w-24"
                    />
                    {formData.bookingServices.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeBookingService(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBookingService}>
                  <Plus className="w-4 h-4 mr-1" /> {t('Lägg till tjänst', 'Add service')}
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label className="text-sm">{t('Bufferttid', 'Buffer time')}</Label>
                  <InfoTooltip content={t('Tid mellan bokningar.', 'Time between appointments.')} />
                </div>
                <Input 
                  value={formData.bufferTime} 
                  onChange={(e) => updateField('bufferTime', e.target.value)} 
                  placeholder={t('t.ex. 15 min', 'e.g. 15 min')} 
                  className="h-10"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label className="text-sm">{t('Max/dag', 'Max/day')}</Label>
                  <InfoTooltip content={t('Max antal bokningar per dag.', 'Max bookings per day.')} />
                </div>
                <Input 
                  value={formData.maxBookingsPerDay} 
                  onChange={(e) => updateField('maxBookingsPerDay', e.target.value)} 
                  placeholder={t('t.ex. 10', 'e.g. 10')} 
                  className="h-10"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Label className="text-sm">{t('Förbokning', 'Advance booking')}</Label>
                  <InfoTooltip content={t('Hur långt i förväg kan man boka?', 'How far in advance can one book?')} />
                </div>
                <Input 
                  value={formData.advanceBookingDays} 
                  onChange={(e) => updateField('advanceBookingDays', e.target.value)} 
                  placeholder={t('t.ex. 30 dagar', 'e.g. 30 days')} 
                  className="h-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
