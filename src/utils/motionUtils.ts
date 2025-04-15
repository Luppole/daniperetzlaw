
import { useRef, useEffect } from 'react';
import { animate, AnimationOptionsWithValueOverrides } from 'motion';

type AnimateOptions = AnimationOptionsWithValueOverrides;

// Animation utility functions
export const animateFadeIn = (element: Element | string, delay = 0, duration = 0.5) => {
  if (!element) return;
  
  const options: AnimateOptions = {
    duration,
    delay
  };
  
  animate(element, { opacity: [0, 1] }, options);
};

export const animateFadeInUp = (element: Element | string, delay = 0, duration = 0.5) => {
  if (!element) return;
  
  const options: AnimateOptions = {
    duration,
    delay
  };
  
  animate(element, { 
    opacity: [0, 1], 
    y: [20, 0] 
  }, options);
};

export const animateFadeInDown = (element: Element | string, delay = 0, duration = 0.5) => {
  if (!element) return;
  
  const options: AnimateOptions = {
    duration,
    delay
  };
  
  animate(element, { 
    opacity: [0, 1], 
    y: [-20, 0] 
  }, options);
};

export const animateScaleIn = (element: Element | string, delay = 0, duration = 0.5) => {
  if (!element) return;
  
  const options: AnimateOptions = {
    duration,
    delay
  };
  
  animate(element, { 
    opacity: [0, 1], 
    scale: [0.9, 1] 
  }, options);
};

// Hook to use with ref elements
export const useAnimateOnMount = (
  ref: React.RefObject<HTMLElement>,
  animation: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'scaleIn' = 'fadeIn',
  delay = 0
) => {
  useEffect(() => {
    if (ref.current) {
      switch (animation) {
        case 'fadeIn':
          animateFadeIn(ref.current, delay);
          break;
        case 'fadeInUp':
          animateFadeInUp(ref.current, delay);
          break;
        case 'fadeInDown':
          animateFadeInDown(ref.current, delay);
          break;
        case 'scaleIn':
          animateScaleIn(ref.current, delay);
          break;
      }
    }
  }, [ref, animation, delay]);
};
