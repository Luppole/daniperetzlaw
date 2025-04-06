
import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { AppointmentModal } from '@/components/AppointmentModal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import practiceAreas from './PracticeAreaDescriptions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string | null>(null);
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background based on scroll position
      setIsScrolled(window.scrollY > 50);
      
      // Only update active section based on scroll position if on homepage
      if (isHomePage) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          const sectionId = section.getAttribute('id') || '';
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveLink(sectionId);
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { title: 'ראשי', href: '/#hero' },
    { title: 'אודות', href: '/#about' },
    { title: 'מאמרים', href: '/articles' },
    { title: 'צור קשר', href: '/#contact' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/#')) {
      if (isHomePage) {
        // If we're on the home page, scroll to the section
        document.querySelector(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If we're on another page, navigate to the home page and then to the section
        navigate(href);
      }
    } else {
      // For other pages like /articles
      navigate(href);
    }
    
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const scrollToHero = () => {
    if (isHomePage) {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#hero');
    }
  };

  const scrollToExpertise = () => {
    if (isHomePage) {
      document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#expertise');
    }
  };

  const handlePracticeAreaClick = (areaId: string) => {
    scrollToExpertise();
    setIsMenuOpen(false);
    
    // Set a small delay to ensure the section is scrolled to first
    setTimeout(() => {
      setSelectedPracticeArea(areaId);
      const element = document.getElementById(areaId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  // Find the selected practice area
  const selectedArea = practiceAreas.find(area => area.id === selectedPracticeArea);

  return (
    <>
      <header className={cn(
        'fixed w-full z-50 transition-all duration-300 backdrop-blur-sm',
        isScrolled ? 'bg-white/95 shadow-md py-2' : 'bg-transparent py-4'
      )}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div 
            onClick={scrollToHero}
            className="flex items-center cursor-pointer hover:opacity-90 transition-all duration-300"
          >
            <div className="bg-law-navy p-2 rounded-md transform transition-transform hover:scale-105">
              <span className="text-2xl font-rubik font-bold text-law-silver">DP</span>
            </div>
            <div className="mr-3">
              <div className="text-lg md:text-xl font-rubik font-bold text-law-navy transition-colors duration-300">עו"ד דני פרץ</div>
              <div className="text-xs text-law-gray">משפחה • ירושה • ייפוי כוח מתמשך</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {navLinks.map((link, index) => {
              // Check if this is the articles link and we're on that page
              const isActive = link.href === '/articles' 
                ? location.pathname === '/articles'
                : isHomePage && activeLink === link.href.replace('/#', '');
                
              return (
                <button 
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    "px-4 py-2 text-law-navy transition-all duration-300 relative group",
                    isActive ? 'font-medium' : 'text-law-gray hover:text-law-navy',
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.title}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-1/2 w-0 h-0.5 bg-law-navy transition-all duration-300",
                      isActive 
                        ? "w-1/2 h-0.5 transform -translate-x-1/2" 
                        : "w-0 h-0.5 group-hover:w-1/2 transform -translate-x-1/2 group-hover:h-0.5"
                    )} 
                  />
                </button>
              );
            })}
            
            {/* Practice Areas Dropdown */}
            <NavigationMenu>
              <NavigationMenuList className="space-x-reverse">
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      "px-4 py-2 text-law-navy transition-all duration-300 relative group bg-transparent hover:bg-transparent",
                      isHomePage && activeLink === 'expertise' ? 'font-medium' : 'text-law-gray hover:text-law-navy'
                    )}
                    onClick={scrollToExpertise}
                  >
                    תחומי עיסוק
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white rounded-md shadow-lg p-4 min-w-[400px] z-50 mt-1 text-right">
                    <div className="grid grid-cols-2 gap-3">
                      {practiceAreas.map((area) => (
                        <NavigationMenuLink
                          key={area.id}
                          className="block hover:bg-law-light rounded px-3 py-2 text-sm transition-colors"
                          onClick={() => handlePracticeAreaClick(area.id)}
                        >
                          <span className="mr-2">{area.icon}</span> {area.title}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-4 space-x-reverse mr-4">
              <UserMenu />
              <AppointmentModal
                trigger={
                  <Button 
                    className="bg-law-navy hover:bg-law-navy/90 text-white transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg btn-pulse flex items-center"
                  >
                    <Calendar className="h-4 w-4 ml-2" />
                    קבע פגישה
                  </Button>
                }
              />
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4 space-x-reverse">
            <UserMenu />
            <button 
              className="text-law-navy p-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
            >
              {isMenuOpen ? <X size={24} className="animate-fade-in" /> : <Menu size={24} className="animate-fade-in" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden absolute top-full right-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-3 animate-slide-up max-h-[80vh] overflow-y-auto">
            {navLinks.map((link, index) => {
              // Check if this is the articles link and we're on that page
              const isActive = link.href === '/articles' 
                ? location.pathname === '/articles'
                : isHomePage && activeLink === link.href.replace('/#', '');
                
              return (
                <button 
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
                    isActive ? 'text-law-navy font-medium' : '',
                    "transform transition-all hover:translate-x-2"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {link.title}
                  <span 
                    className={cn(
                      "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                      isActive ? "w-8" : "w-0 group-hover:w-8"
                    )} 
                  />
                </button>
              );
            })}
            
            {/* Practice Areas in Mobile Menu */}
            <div className="py-2">
              <button 
                onClick={scrollToExpertise}
                className={cn(
                  "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group font-medium",
                  "transform transition-all hover:translate-x-2"
                )}
              >
                תחומי עיסוק
                <span className="absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300 w-0 group-hover:w-8" />
              </button>
              <div className="pr-4 mt-2 grid grid-cols-1 gap-2 border-r-2 border-law-navy/20">
                {practiceAreas.map((area) => (
                  <button
                    key={area.id}
                    className="text-right text-sm text-law-gray hover:text-law-navy transition-all duration-300 py-1"
                    onClick={() => handlePracticeAreaClick(area.id)}
                  >
                    <span className="mr-1">{area.icon}</span> {area.title}
                  </button>
                ))}
              </div>
            </div>
            
            <AppointmentModal
              trigger={
                <Button 
                  className="w-full bg-law-navy hover:bg-law-navy/90 text-white mt-4 btn-pulse flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 ml-2" />
                  קבע פגישה
                </Button>
              }
            />
          </nav>
        )}
      </header>

      {/* Practice Area Modal */}
      {selectedArea && (
        <Dialog open={!!selectedArea} onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPracticeArea(null);
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl mb-4">{selectedArea.title}</DialogTitle>
              <DialogDescription className="text-lg text-law-gray">
                {selectedArea.fullDescription}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setSelectedPracticeArea(null);
                }}
              >
                צור קשר בנושא {selectedArea.title}
              </Button>
              <Link to={`/articles?expertise=${selectedArea.id}`} onClick={() => setSelectedPracticeArea(null)}>
                <Button>
                  כל המאמרים בנושא {selectedArea.title}
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
