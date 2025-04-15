
import { useCallback, useEffect, useRef } from 'react';
import { animate as motionAnimate, AnimationOptionsWithValueOverrides, DOMKeyframesDefinition } from 'motion';

type AnimateOptions = AnimationOptionsWithValueOverrides;

// Helper functions that wrap the motion library functions
export const useMotion = () => {
  // Safe wrapper around motion.animate
  const animateElement = useCallback((
    target: string | Element | null,
    keyframes: DOMKeyframesDefinition,
    options?: AnimateOptions
  ) => {
    if (!target) return;
    
    try {
      if (typeof target === 'string') {
        const elements = document.querySelectorAll(target);
        elements.forEach(element => {
          motionAnimate(element, keyframes, options);
        });
      } else {
        motionAnimate(target, keyframes, options);
      }
    } catch (error) {
      console.error('Animation error:', error);
    }
  }, []);

  return { animate: animateElement };
};

// Utility functions for common animations
export const fadeIn = (element: Element | null, delay = 0) => {
  if (!element) return;
  motionAnimate(
    element,
    { opacity: [0, 1] },
    { duration: 0.5, delay }
  );
};

export const fadeInUp = (element: Element | null, delay = 0) => {
  if (!element) return;
  motionAnimate(
    element,
    { 
      opacity: [0, 1],
      y: [20, 0]
    },
    { duration: 0.5, delay }
  );
};

export const scaleIn = (element: Element | null, delay = 0) => {
  if (!element) return;
  motionAnimate(
    element,
    { 
      opacity: [0, 1],
      scale: [0.9, 1]
    },
    { duration: 0.5, delay }
  );
};

// Direct export of the motion animate function for simpler cases
export { motionAnimate as animate };
