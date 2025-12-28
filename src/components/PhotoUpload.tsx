import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
  photos: File[];
  onChange: (photos: File[]) => void;
  maxPhotos?: number;
}

export function PhotoUpload({ photos, onChange, maxPhotos = 5 }: PhotoUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && photos.length + 1 <= maxPhotos
    );
    
    const remaining = maxPhotos - photos.length;
    onChange([...photos, ...newFiles.slice(0, remaining)]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
          transition-all duration-200
          ${dragActive 
            ? 'border-accent bg-accent/10 scale-[1.02]' 
            : 'border-border hover:border-accent/50 hover:bg-accent/5'
          }
          ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <Upload className={`w-8 h-8 mx-auto mb-2 ${dragActive ? 'text-accent' : 'text-muted-foreground'}`} />
        <p className="text-sm font-medium">
          {t('Dra och släpp bilder här', 'Drag and drop images here')}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('eller klicka för att välja', 'or click to select')} ({photos.length}/{maxPhotos})
        </p>
      </div>

      {/* Photo previews */}
      <AnimatePresence mode="popLayout">
        {photos.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-2"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={`${photo.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative group aspect-square rounded-lg overflow-hidden bg-secondary"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(index);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            
            {/* Add more button */}
            {photos.length < maxPhotos && (
              <motion.button
                type="button"
                onClick={() => inputRef.current?.click()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-accent/50 flex items-center justify-center transition-colors"
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground">
        {t(
          'Ladda upp logotyp, bilder från din verksamhet, eller inspiration för designen',
          'Upload logo, photos from your business, or design inspiration'
        )}
      </p>
    </div>
  );
}
