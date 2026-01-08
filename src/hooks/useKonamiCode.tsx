import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export function useKonamiCode() {
  const triggerConfetti = useCallback(() => {
    // First burst - center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7', '#d97706']
    });

    // Second burst - left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d']
      });
    }, 200);

    // Third burst - right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d']
      });
    }, 400);

    // Grand finale
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff', '#d97706']
      });
    }, 600);
  }, []);

  useEffect(() => {
    let inputSequence: string[] = [];
    
    const handleKeyDown = (event: KeyboardEvent) => {
      inputSequence.push(event.code);
      
      // Keep only the last 10 keys
      if (inputSequence.length > KONAMI_CODE.length) {
        inputSequence = inputSequence.slice(-KONAMI_CODE.length);
      }
      
      // Check if the sequence matches
      if (inputSequence.join(',') === KONAMI_CODE.join(',')) {
        triggerConfetti();
        inputSequence = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerConfetti]);
}
