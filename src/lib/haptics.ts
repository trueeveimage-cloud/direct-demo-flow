// Haptic feedback and sound effects for enhanced user experience

// Extended sound effect library with varied tones
const sounds = {
  // Click sounds
  click: { frequency: 800, duration: 0.05, type: 'sine' as OscillatorType },
  clickSoft: { frequency: 600, duration: 0.04, type: 'sine' as OscillatorType },
  clickDeep: { frequency: 300, duration: 0.06, type: 'triangle' as OscillatorType },
  
  // Toggle/switch sounds
  toggle: { frequency: 600, duration: 0.08, type: 'sine' as OscillatorType },
  toggleOn: { frequency: 880, duration: 0.07, type: 'sine' as OscillatorType },
  toggleOff: { frequency: 440, duration: 0.06, type: 'sine' as OscillatorType },
  
  // Hover sounds - subtle variations
  hover: { frequency: 1200, duration: 0.025, type: 'sine' as OscillatorType },
  hoverSoft: { frequency: 900, duration: 0.02, type: 'sine' as OscillatorType },
  hoverWarm: { frequency: 500, duration: 0.03, type: 'triangle' as OscillatorType },
  
  // Success/feedback sounds
  success: { frequency: 880, duration: 0.15, type: 'sine' as OscillatorType },
  successChime: { frequency: 1047, duration: 0.12, type: 'sine' as OscillatorType },
  confirm: { frequency: 660, duration: 0.1, type: 'sine' as OscillatorType },
  
  // Navigation sounds
  navigate: { frequency: 523, duration: 0.05, type: 'sine' as OscillatorType },
  pageEnter: { frequency: 392, duration: 0.08, type: 'triangle' as OscillatorType },
  
  // UI interaction sounds
  pop: { frequency: 1400, duration: 0.03, type: 'sine' as OscillatorType },
  tap: { frequency: 700, duration: 0.035, type: 'sine' as OscillatorType },
  swoosh: { frequency: 200, duration: 0.12, type: 'sawtooth' as OscillatorType },
  
  // Error/warning sounds
  error: { frequency: 200, duration: 0.15, type: 'square' as OscillatorType },
  warning: { frequency: 350, duration: 0.1, type: 'triangle' as OscillatorType },
  
  // Subtle ambient sounds
  ambient: { frequency: 300, duration: 0.2, type: 'sine' as OscillatorType },
  blip: { frequency: 1000, duration: 0.02, type: 'sine' as OscillatorType },
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
    
    // Different gain curves for different sound types
    const baseGain = type.includes('hover') ? 0.04 : 
                     type.includes('Soft') ? 0.06 :
                     type === 'swoosh' ? 0.03 :
                     type === 'error' || type === 'warning' ? 0.05 : 0.08;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseGain, ctx.currentTime + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + sound.duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + sound.duration);
  } catch (e) {
    // Silently fail if audio playback fails
  }
}

// Play a chord (multiple notes) for richer sounds
export function playChord(notes: (keyof typeof sounds)[], stagger = 0.02) {
  notes.forEach((note, i) => {
    setTimeout(() => playSound(note), i * stagger * 1000);
  });
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

// Combined haptic + sound feedback with varied options
export function hapticFeedback(
  type: 'click' | 'toggle' | 'success' | 'hover' | 'navigate' | 'pop' | 'tap' | 'confirm' | 'error' | 'blip' = 'click'
) {
  const soundMap: Record<string, keyof typeof sounds> = {
    click: 'click',
    toggle: 'toggle',
    success: 'success',
    hover: 'hover',
    navigate: 'navigate',
    pop: 'pop',
    tap: 'tap',
    confirm: 'confirm',
    error: 'error',
    blip: 'blip',
  };
  
  playSound(soundMap[type] || 'click');
  
  if (type === 'click' || type === 'toggle' || type === 'tap') {
    triggerHaptic('light');
  } else if (type === 'success' || type === 'confirm') {
    triggerHaptic('medium');
  } else if (type === 'error') {
    triggerHaptic('heavy');
  }
}

// Random hover sound for variety
let lastHoverSound = 0;
export function randomHoverSound() {
  const hoverSounds: (keyof typeof sounds)[] = ['hover', 'hoverSoft', 'hoverWarm', 'blip'];
  // Avoid playing the same sound twice in a row
  let index = Math.floor(Math.random() * hoverSounds.length);
  if (index === lastHoverSound) {
    index = (index + 1) % hoverSounds.length;
  }
  lastHoverSound = index;
  playSound(hoverSounds[index]);
}

// Export the sounds object for custom usage
export { sounds };
