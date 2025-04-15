
import { animate, AnimationOptionsWithOverrides } from 'motion';

// Common animation presets for use throughout the application
export const animations = {
  fadeIn: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    duration: 0.6,
    delay
  }),
  
  fadeOut: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [1, 0],
    duration: 0.3,
    delay
  }),
  
  slideUp: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    y: [30, 0],
    duration: 0.6,
    delay
  }),
  
  slideDown: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    y: [-30, 0],
    duration: 0.6,
    delay
  }),
  
  slideRight: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    x: [-30, 0],
    duration: 0.6,
    delay
  }),
  
  slideLeft: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    x: [30, 0],
    duration: 0.6,
    delay
  }),
  
  scaleIn: (delay = 0): AnimationOptionsWithOverrides => ({
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 0.5,
    delay
  }),
  
  bounce: (delay = 0): AnimationOptionsWithOverrides => ({
    y: [0, -15, 0],
    duration: 1,
    delay,
    repeat: Infinity,
    easing: 'ease-in-out'
  }),
  
  pulse: (delay = 0): AnimationOptionsWithOverrides => ({
    scale: [1, 1.05, 1],
    duration: 1.5,
    delay,
    repeat: Infinity,
    easing: 'ease-in-out'
  }),
  
  // Staggered animation for list items
  stagger: (elements: HTMLElement[], animation: AnimationOptionsWithOverrides, staggerDelay = 0.1) => {
    elements.forEach((element, index) => {
      const delay = animation.delay || 0;
      animation.delay = delay + (index * staggerDelay);
      animate(element, animation);
    });
  }
};

// Helper function to animate elements when they enter the viewport
export const animateOnScroll = (element: HTMLElement, animation: AnimationOptionsWithOverrides) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(element, animation);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  
  observer.observe(element);
  
  return observer;
};
