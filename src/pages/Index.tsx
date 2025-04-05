
import React, { useEffect, useState, useRef } from 'react';
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

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for animate-on-scroll elements with better threshold
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
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    // Section observer for tracking active section
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

    // Scroll to top button handler with smoother threshold
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Preload images and critical resources
    const preloadImages = () => {
      const criticalImages = document.querySelectorAll('img[data-preload="true"]');
      criticalImages.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          const newImg = new Image();
          newImg.src = img.src;
        }
      });
    };
    
    // Add page loaded class for animations with a slight delay for better effect
    setTimeout(() => {
      document.body.classList.add('page-loaded');
      if (pageRef.current) {
        pageRef.current.classList.add('fade-in');
      }
    }, 100);
    
    // Initialize preloading
    preloadImages();

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

    // Add parallax effect to background elements on scroll
    const handleParallax = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      
      parallaxElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const speed = element.dataset.speed || '0.1';
          const yPos = scrollY * parseFloat(speed);
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleParallax);

    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
    };
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden opacity-0 transition-opacity duration-700">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-law-navy/5 rounded-bl-full opacity-30 parallax" data-speed="-0.05"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-law-light/50 rounded-tr-full opacity-30 parallax" data-speed="0.08"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-law-navy/10 rounded-full blur-xl parallax" data-speed="0.12"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-law-navy/10 rounded-full blur-xl parallax" data-speed="-0.1"></div>
      </div>
      
      <Navbar activeSection={activeSection} />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <ArticlesSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      
      {/* Scroll to top button with enhanced styling */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 bg-law-navy text-white p-3 rounded-full shadow-lg transition-all duration-500 z-50 ${
          showScrollTop ? 'opacity-90 transform translate-y-0 hover:opacity-100 hover:bg-law-navy/90 hover:scale-110' : 'opacity-0 transform translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
};

export default Index;
