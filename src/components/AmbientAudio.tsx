import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientAudioProps {
  /** Scroll progress from 0 to 1 */
  scrollProgress: number;
  /** Maximum volume (0-1) */
  maxVolume?: number;
  /** Whether audio is enabled globally */
  enabled?: boolean;
}

// Create a subtle ambient drone using Web Audio API
function createAmbientSound(audioContext: AudioContext): {
  gainNode: GainNode;
  start: () => void;
  stop: () => void;
} {
  // Create multiple oscillators for a rich, warm ambient pad
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  
  // Master gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(audioContext.destination);
  
  // Create a low-pass filter for warmth
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  filter.Q.value = 1;
  filter.connect(masterGain);
  
  // Base frequencies for a calm, meditative drone (A minor chord voicing)
  const frequencies = [
    55,    // A1 - deep bass
    110,   // A2 - bass
    165,   // E3 - fifth
    220,   // A3 - octave
    330,   // E4 - high fifth
  ];
  
  frequencies.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    // Slight detuning for richness
    osc.detune.value = Math.random() * 10 - 5;
    
    // Different volumes for each frequency layer
    const volumeMap = [0.3, 0.25, 0.15, 0.2, 0.1];
    gain.gain.value = volumeMap[i] || 0.1;
    
    osc.connect(gain);
    gain.connect(filter);
    
    oscillators.push(osc);
    gains.push(gain);
  });
  
  // Add very subtle noise for texture
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  
  const noiseGain = audioContext.createGain();
  noiseGain.gain.value = 0.02; // Very subtle
  
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 200;
  
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  
  return {
    gainNode: masterGain,
    start: () => {
      oscillators.forEach(osc => osc.start());
      noiseSource.start();
    },
    stop: () => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      try { noiseSource.stop(); } catch {}
    }
  };
}

export function AmbientAudio({ 
  scrollProgress, 
  maxVolume = 0.15,
  enabled = true 
}: AmbientAudioProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<ReturnType<typeof createAmbientSound> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userMuted, setUserMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nomia_ambient_muted') === 'true';
    }
    return false;
  });
  const [showControl, setShowControl] = useState(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    if (!enabled || userMuted) return;

    const initAudio = () => {
      if (audioContextRef.current) return;
      
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        ambientRef.current = createAmbientSound(audioContextRef.current);
        ambientRef.current.start();
        setIsPlaying(true);
        setShowControl(true);
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    };

    // Start on scroll (user interaction)
    const handleScroll = () => {
      if (window.scrollY > 100) {
        initAudio();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, userMuted]);

  // Update volume based on scroll progress
  useEffect(() => {
    if (!ambientRef.current || !isPlaying || userMuted) return;
    
    // Fade in during first 20% of scroll, stay at max, fade out in last 10%
    let volume = 0;
    if (scrollProgress < 0.05) {
      volume = 0;
    } else if (scrollProgress < 0.25) {
      // Fade in
      volume = ((scrollProgress - 0.05) / 0.2) * maxVolume;
    } else if (scrollProgress < 0.9) {
      // Full volume
      volume = maxVolume;
    } else {
      // Fade out
      volume = ((1 - scrollProgress) / 0.1) * maxVolume;
    }
    
    ambientRef.current.gainNode.gain.setTargetAtTime(
      volume, 
      audioContextRef.current?.currentTime || 0, 
      0.3
    );
  }, [scrollProgress, maxVolume, isPlaying, userMuted]);

  // Handle mute toggle
  const toggleMute = () => {
    const newMuted = !userMuted;
    setUserMuted(newMuted);
    localStorage.setItem('nomia_ambient_muted', String(newMuted));
    
    if (newMuted && ambientRef.current) {
      ambientRef.current.gainNode.gain.setTargetAtTime(0, audioContextRef.current?.currentTime || 0, 0.1);
    } else if (!newMuted && ambientRef.current) {
      ambientRef.current.gainNode.gain.setTargetAtTime(maxVolume * 0.5, audioContextRef.current?.currentTime || 0, 0.3);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        ambientRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {showControl && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all duration-300 shadow-lg"
          aria-label={userMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
        >
          {userMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
