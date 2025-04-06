
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';
import { ArticlesSection } from '@/components/ArticlesSection';
import { FaqSection } from '@/components/FaqSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Define images for different sections
const sectionImages = [
  '/lovable-uploads/ad835b61-e4f6-490c-8e35-d5865c9cb250.png', // Hero image
  '/lovable-uploads/d946344e-c289-4991-bd3a-121dffdabbbe.png', // About section - Updated to use the new image
  '/lovable-uploads/7d51b520-a305-4b68-9d5d-2d9f07241dae.png', // Expertise section
  '/lovable-uploads/d4c52f89-de61-4c7e-b12b-62040c71d1fb.png'  // Contact section
];

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Preload all uploaded images for better performance
    const preloadImages = () => {
      sectionImages.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
    
    // Intersection Observer for animate-on-scroll elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Once the animation has played, we can unobserve the element
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    // Scroll to top button handler
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add page loaded class for animations
    document.body.classList.add('page-loaded');

    // Handle hash navigation for smooth scrolling
    const handleHashNavigation = () => {
      const hash = location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    handleHashNavigation();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <ArticlesSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 bg-law-navy text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          showScrollTop ? 'opacity-80 transform translate-y-0 hover:opacity-100' : 'opacity-0 transform translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default Index;
