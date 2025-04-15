
import React, { useEffect, useRef } from 'react';
import { motion, MotionKeyframesDefinition } from 'motion';
import { animations } from '@/utils/motionUtils';

// Hook to apply motion animations when an element enters the viewport
export function useMotionOnScroll(
  animation: keyof typeof animations,
  options: { threshold?: number; delay?: number } = {}
) {
  const { threshold = 0.1, delay = 0 } = options;
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const animationFn = animations[animation];
    if (!animationFn) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          motion(element, animationFn(delay));
          observer.unobserve(element);
        }
      });
    }, { threshold, rootMargin: '0px 0px -10% 0px' });
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [animation, threshold, delay]);
  
  return ref;
}

// Component wrapper for motion animations
interface MotionWrapperProps {
  children: React.ReactNode;
  animation: keyof typeof animations;
  delay?: number;
  className?: string;
  threshold?: number;
  style?: React.CSSProperties;
  id?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  animation,
  delay = 0,
  className = '',
  threshold = 0.1,
  style = {},
  id
}) => {
  const ref = useMotionOnScroll(animation, { threshold, delay });
  
  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }} id={id}>
      {children}
    </div>
  );
};

// Custom hook to create a motion timeline for sequenced animations
export function useMotionTimeline(initialDelay = 0.2, staggerDelay = 0.1) {
  const items = useRef<Array<{ element: HTMLElement; animation: MotionKeyframesDefinition }>>([]);
  
  const addToTimeline = (element: HTMLElement, animationName: keyof typeof animations) => {
    const animationFn = animations[animationName];
    if (!animationFn) return;
    
    items.current.push({
      element,
      animation: animationFn(0) // We'll handle the delay in the play function
    });
  };
  
  const play = () => {
    items.current.forEach((item, index) => {
      const delay = initialDelay + (index * staggerDelay);
      motion(item.element, {
        ...item.animation,
        delay
      });
    });
  };
  
  const clear = () => {
    items.current = [];
  };
  
  return { addToTimeline, play, clear };
}
