import { memo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, X, Plus, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { InfoTooltip } from '@/components/InfoTooltip';

interface PhotoUploadSectionProps {
  logoPreview: string | null;
  setLogoPreview: (url: string | null) => void;
  photosPreviews: string[];
  setPhotosPreviews: (urls: string[]) => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
};

function PhotoUploadSectionComponent({
  logoPreview,
  setLogoPreview,
  photosPreviews,
  setPhotosPreviews
}: PhotoUploadSectionProps) {
  const { t } = useLanguage();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        // Store in localStorage for persistence
        localStorage.setItem('concept_logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).slice(0, 6 - photosPreviews.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === Math.min(files.length, 6 - photosPreviews.length)) {
            const updated = [...photosPreviews, ...newPreviews].slice(0, 6);
            setPhotosPreviews(updated);
            localStorage.setItem('concept_photos', JSON.stringify(updated));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    localStorage.removeItem('concept_logo');
  };

  const removePhoto = (index: number) => {
    const updated = photosPreviews.filter((_, i) => i !== index);
    setPhotosPreviews(updated);
    localStorage.setItem('concept_photos', JSON.stringify(updated));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="p-6 bg-secondary/50 rounded-xl space-y-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-5 h-5 text-accent" />
        <h2 className="font-semibold text-lg">{t('Ladda upp bilder', 'Upload photos')}</h2>
        <InfoTooltip content={t('Ladda upp din logga och foton så använder vi dem i konceptet!', 'Upload your logo and photos and we\'ll use them in the concept!')} />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>{t('Logotyp', 'Logo')}</Label>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        
        {logoPreview ? (
          <div className="relative inline-block">
            <img 
              src={logoPreview} 
              alt="Logo" 
              className="h-20 w-auto object-contain rounded-lg border border-border bg-white p-2"
            />
            <button
              type="button"
              onClick={removeLogo}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="w-full h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-all"
          >
            <Upload className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('Klicka för att ladda upp', 'Click to upload')}</span>
          </button>
        )}
      </div>

      {/* Photos Upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{t('Foton från ditt företag', 'Photos from your business')}</Label>
          <span className="text-xs text-muted-foreground">({photosPreviews.length}/6)</span>
        </div>
        <input
          ref={photosInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosUpload}
          className="hidden"
        />
        
        <div className="grid grid-cols-3 gap-2">
          {photosPreviews.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          
          {photosPreviews.length < 6 && (
            <button
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{t('Lägg till', 'Add')}</span>
            </button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          {t(
            'Ladda upp dina bästa bilder ELLER så använder vi din hemsida/Instagram som referens.',
            'Upload your best photos OR we can use your website/Instagram as reference.'
          )}
        </p>
      </div>
    </motion.div>
  );
}

export const PhotoUploadSection = memo(PhotoUploadSectionComponent);
