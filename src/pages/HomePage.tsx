
import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ExpertiseSection } from '@/components/ExpertiseSection';
import { ArticlesSection } from '@/components/ArticlesSection';
import { FaqSection } from '@/components/FaqSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { ArrowUp, Edit, Save, RotateCcw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { useTextEdit } from '@/contexts/TextEditContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReviewSection } from '@/components/ReviewSection';

// Define images for different sections and prepare them for lazy loading
const sectionImages = [
  '/lovable-uploads/ad835b61-e4f6-490c-8e35-d5865c9cb250.png', // Hero image
  '/lovable-uploads/d946344e-c289-4991-bd3a-121dffdabbbe.png', // About section
  '/lovable-uploads/7d51b520-a305-4b68-9d5d-2d9f07241dae.png', // Expertise section
  '/lovable-uploads/d4c52f89-de61-4c7e-b12b-62040c71d1fb.png'  // Contact section
];

// Memoized button to prevent unnecessary re-renders
const ScrollTopButton = memo(({ show, onClick }: { show: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`fixed bottom-6 left-6 bg-law-navy text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30 ${
      show ? 'opacity-80 transform translate-y-0 hover:opacity-100' : 'opacity-0 transform translate-y-10 pointer-events-none'
    }`}
    aria-label="Scroll to top"
  >
    <ArrowUp size={20} />
  </button>
));
ScrollTopButton.displayName = 'ScrollTopButton';

// Admin action buttons for mobile
const AdminActionButtons = memo(({ isEditMode, toggleEditMode, handleResetTexts }: { 
  isEditMode: boolean;
  toggleEditMode: () => void;
  handleResetTexts: () => void;
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`fixed ${isMobile ? 'top-auto bottom-20 right-4' : 'top-24 left-6'} z-40 flex ${isMobile ? 'flex-row-reverse' : 'flex-col'} gap-2`}>
      <Button
        onClick={toggleEditMode}
        size={isMobile ? "icon" : "default"}
        className={`rounded-full shadow-lg transition-all duration-300 ${
          isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-law-navy hover:bg-law-navy/90'
        }`}
      >
        {isEditMode ? (
          isMobile ? <Save className="h-4 w-4" /> : (
            <>
              <Save className="h-4 w-4 ml-2" />
              סיים עריכה
            </>
          )
        ) : (
          isMobile ? <Edit className="h-4 w-4" /> : (
            <>
              <Edit className="h-4 w-4 ml-2" />
              עריכת תוכן
            </>
          )
        )}
      </Button>
      
      {isEditMode && (
        <Button 
          variant="destructive" 
          onClick={handleResetTexts}
          size={isMobile ? "icon" : "default"}
          className="rounded-full shadow-lg"
        >
          <RotateCcw className={`h-4 w-4 ${!isMobile && 'ml-2'}`} />
          {!isMobile && "אפס טקסטים"}
        </Button>
      )}
    </div>
  );
});
AdminActionButtons.displayName = 'AdminActionButtons';

// Optimized HomePage component
const HomePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { isEditMode, toggleEditMode, resetTexts, editedTexts } = useTextEdit();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useIsMobile();

  // Performance optimization: Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload images only when needed
  useEffect(() => {
    // Only preload the first two images (most important ones)
    const preloadCriticalImages = () => {
      const imagesToPreload = sectionImages.slice(0, 2);
      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadCriticalImages();
    
    // Lazy load the other images
    const lazyLoadImages = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target as HTMLImageElement;
              if (lazyImage.dataset.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.removeAttribute('data-src');
              }
              observer.unobserve(lazyImage);
            }
          });
        });
        
        document.querySelectorAll('img[data-src]').forEach((img) => {
          imageObserver.observe(img);
        });
      }
    };
    
    // Run after initial render is complete
    setTimeout(lazyLoadImages, 100);
  }, []);
  
  // Optimize intersection observer for animations
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    // Observe all animated elements with a small delay to avoid blocking main thread
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((element) => {
        observerRef.current?.observe(element);
      });
    }, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle hash navigation with debounce
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Use requestIdleCallback or setTimeout to defer non-critical work
      const scrollToElement = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(scrollToElement);
      } else {
        setTimeout(scrollToElement, 100);
      }
    }
    
    // Add page loaded class for animations
    document.body.classList.add('page-loaded');
  }, [location]);

  // Force save of edited texts before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // With the new Firebase implementation, we don't need to save on unload
      // as changes are saved automatically
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditMode, editedTexts]);

  // Memoized callbacks
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Function to confirm text reset
  const handleResetTexts = useCallback(() => {
    if (window.confirm('האם אתה בטוח שברצונך לאפס את כל הטקסטים המותאמים אישית?')) {
      resetTexts();
    }
  }, [resetTexts]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExpertiseSection />
      <ReviewSection />
      <ArticlesSection />
      <FaqSection />
      <ContactSection />
      <Footer />
      
      {/* Admin edit mode toggle button with enhanced visibility for both mobile and desktop */}
      {isAdmin && (
        <AdminActionButtons 
          isEditMode={isEditMode} 
          toggleEditMode={toggleEditMode} 
          handleResetTexts={handleResetTexts} 
        />
      )}
      
      {/* Optimized scroll to top button */}
      <ScrollTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
};

export default HomePage;
