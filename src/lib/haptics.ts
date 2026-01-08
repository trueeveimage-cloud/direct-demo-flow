// Haptic feedback and sound effects for enhanced user experience

// Sound effect URLs (using Web Audio API for instant playback)
const sounds = {
  click: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  toggle: { frequency: 600, duration: 0.08, type: 'sine' as OscillatorType },
  success: { frequency: 880, duration: 0.15, type: 'sine' as OscillatorType },
  hover: { frequency: 400, duration: 0.03, type: 'sine' as OscillatorType },
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  return audioContext;
}

export function playSound(type: keyof typeof sounds) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Resume context if suspended (required for some browsers)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const sound = sounds[type];
  
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.frequency, ctx.currentTime);
    
    // Quick fade in and out for a cleaner sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.005);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + sound.duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  } catch (e) {
    // Silently fail if audio playback fails
  }
}

// Haptic vibration for mobile devices
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
  };
  
  try {
    navigator.vibrate(patterns[style]);
  } catch (e) {
    // Silently fail if vibration not supported
  }
}

// Combined haptic + sound feedback
export function hapticFeedback(type: 'click' | 'toggle' | 'success' | 'hover' = 'click') {
  playSound(type);
  
  if (type === 'click' || type === 'toggle') {
    triggerHaptic('light');
  } else if (type === 'success') {
    triggerHaptic('medium');
  }
}
