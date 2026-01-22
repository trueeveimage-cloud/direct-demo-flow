import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedLanguageTextProps {
  text: string;
  className?: string;
}

// Letter-by-letter reveal animation for language transitions
export function AnimatedLanguageText({ text, className = '' }: AnimatedLanguageTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        {text.split('').map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 20,
                rotateX: -90,
                filter: 'blur(8px)'
              },
              visible: { 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.3,
                  delay: index * 0.02,
                  ease: [0.22, 1, 0.36, 1]
                }
              },
              exit: {
                opacity: 0,
                y: -20,
                rotateX: 90,
                filter: 'blur(4px)',
                transition: {
                  duration: 0.2,
                  delay: (text.length - index) * 0.01,
                  ease: [0.4, 0, 1, 1]
                }
              }
            }}
            style={{ 
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

// Simple word-by-word animation for longer text
export function AnimatedLanguageWords({ text, className = '' }: AnimatedLanguageTextProps) {
  const words = text.split(' ');
  
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 10,
                filter: 'blur(4px)'
              },
              visible: { 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)',
                transition: {
                  duration: 0.25,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }
              },
              exit: {
                opacity: 0,
                y: -10,
                filter: 'blur(4px)',
                transition: {
                  duration: 0.15,
                  delay: (words.length - index) * 0.02
                }
              }
            }}
            style={{ display: 'inline-block', marginRight: '0.25em' }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
