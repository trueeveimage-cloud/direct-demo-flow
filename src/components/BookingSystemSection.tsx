import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2, Users, Settings2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';

interface BookingService {
  name: string;
  duration: string;
  price: string;
}

interface BookingSystemSectionProps {
  wantsBooking: boolean | null;
  setWantsBooking: (value: boolean) => void;
  openingHours: string;
  setOpeningHours: (value: string) => void;
  appointmentLengths: string[];
  toggleAppointmentLength: (duration: string) => void;
  customAppointmentLength: string;
  setCustomAppointmentLength: (value: string) => void;
  bookingServices: BookingService[];
  addBookingService: () => void;
  removeBookingService: (index: number) => void;
  updateBookingService: (index: number, field: keyof BookingService, value: string) => void;
  bufferTime: string;
  setBufferTime: (value: string) => void;
  maxBookingsPerDay: string;
  setMaxBookingsPerDay: (value: string) => void;
  advanceBookingDays: string;
  setAdvanceBookingDays: (value: string) => void;
}

const appointmentDurations = ['15', '30', '45', '60', '90'];

function BookingSystemSectionComponent({
  wantsBooking,
  setWantsBooking,
  openingHours,
  setOpeningHours,
  appointmentLengths,
  toggleAppointmentLength,
  customAppointmentLength,
  setCustomAppointmentLength,
  bookingServices,
  addBookingService,
  removeBookingService,
  updateBookingService,
  bufferTime,
  setBufferTime,
  maxBookingsPerDay,
  setMaxBookingsPerDay,
  advanceBookingDays,
  setAdvanceBookingDays,
}: BookingSystemSectionProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-lg">{t('Bokningssystem', 'Booking System')}</h2>
            <InfoTooltip content={t('Vi skapar ditt helt egna bokningssystem integrerat med din webbplats.', 'We create your very own booking system integrated with your website.')} />
          </div>

          {/* Yes/No Toggle Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWantsBooking(true)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                wantsBooking === true
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {wantsBooking === true && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="font-medium">{t('Ja, jag vill ha', 'Yes, I want')}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('Låt kunder boka direkt online', 'Let customers book directly online')}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setWantsBooking(false)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                wantsBooking === false
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/20'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {wantsBooking === false && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
              <span className="font-medium">{t('Nej tack', 'No thanks')}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {t('Jag behöver inte bokning', 'I don\'t need booking')}
              </p>
            </button>
          </div>
        </div>

        {/* Booking Requirements Panel */}
        <AnimatePresence>
          {wantsBooking === true && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border"
            >
              <div className="p-6 space-y-5 bg-secondary/30">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Settings2 className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('Bokningsinställningar', 'Booking Settings')}
                  </span>
                </div>

                {/* Opening Hours */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm">{t('Öppettider', 'Opening hours')}</Label>
                    <InfoTooltip content={t('När kan kunder boka? T.ex. "Mån-Fre 09-18, Lör 10-15"', 'When can customers book? E.g. "Mon-Fri 09-18, Sat 10-15"')} />
                  </div>
                  <Textarea
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    rows={2}
                    placeholder={t('Mån-Fre 09:00-18:00\nLör 10:00-15:00', 'Mon-Fri 09:00-18:00\nSat 10:00-15:00')}
                    className="bg-background/50"
                  />
                </div>

                {/* Appointment Durations */}
                <div className="space-y-2">
                  <Label className="text-sm">{t('Tidslängder', 'Durations')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {appointmentDurations.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => toggleAppointmentLength(duration)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          appointmentLengths.includes(duration)
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-background border border-border hover:border-accent/50'
                        }`}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                  <Input
                    value={customAppointmentLength}
                    onChange={(e) => setCustomAppointmentLength(e.target.value)}
                    placeholder={t('Annan längd (t.ex. 120 min)', 'Other duration (e.g. 120 min)')}
                    className="h-9 bg-background/50"
                  />
                </div>

                {/* Bookable Services */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-sm">{t('Bokningsbara tjänster', 'Bookable services')}</Label>
                  </div>
                  <div className="space-y-2">
                    {bookingServices.map((service, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={service.name}
                          onChange={(e) => updateBookingService(index, 'name', e.target.value)}
                          placeholder={t('Tjänst', 'Service')}
                          className="h-9 flex-1 bg-background/50"
                        />
                        <Input
                          value={service.duration}
                          onChange={(e) => updateBookingService(index, 'duration', e.target.value)}
                          placeholder={t('Min', 'Min')}
                          className="h-9 w-16 bg-background/50"
                        />
                        <Input
                          value={service.price}
                          onChange={(e) => updateBookingService(index, 'price', e.target.value)}
                          placeholder={t('Kr', 'Kr')}
                          className="h-9 w-20 bg-background/50"
                        />
                        {bookingServices.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBookingService(index)}
                            className="h-9 w-9 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addBookingService} className="w-full">
                      <Plus className="w-4 h-4 mr-1" /> {t('Lägg till tjänst', 'Add service')}
                    </Button>
                  </div>
                </div>

                {/* Advanced Settings Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Bufferttid', 'Buffer')}</Label>
                    <Input
                      value={bufferTime}
                      onChange={(e) => setBufferTime(e.target.value)}
                      placeholder="15 min"
                      className="h-9 mt-1 bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Max/dag', 'Max/day')}</Label>
                    <Input
                      value={maxBookingsPerDay}
                      onChange={(e) => setMaxBookingsPerDay(e.target.value)}
                      placeholder="10"
                      className="h-9 mt-1 bg-background/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Förbokning', 'Advance')}</Label>
                    <Input
                      value={advanceBookingDays}
                      onChange={(e) => setAdvanceBookingDays(e.target.value)}
                      placeholder="30 d"
                      className="h-9 mt-1 bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export const BookingSystemSection = memo(BookingSystemSectionComponent);
