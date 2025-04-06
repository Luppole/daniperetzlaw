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
import { useAdmin } from '@/contexts/AdminContext';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
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

  // Updated order of navLinks to place תחומי עיסוק correctly
  const navLinks = [
    { title: 'ראשי', href: '/#hero' },
    { title: 'אודות', href: '/#about' },
    { title: 'תחומי עיסוק', href: '/#expertise', isDropdown: true },
    { title: 'מאמרים', href: '/articles' },
    { title: 'צור קשר', href: '/#contact' },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('/#')) {
      if (isHomePage) {
        document.querySelector(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
    } else {
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
    if (isHomePage) {
      document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        const dialogTrigger = document.querySelector(`[data-practice-area="${areaId}"]`) as HTMLButtonElement;
        if (dialogTrigger) {
          dialogTrigger.click();
        }
      }, 800);
    } else {
      navigate(`/#expertise`);
      
      sessionStorage.setItem('openPracticeArea', areaId);
    }
    
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
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
        
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          <button 
            onClick={() => handleLinkClick('/#hero')}
            className={cn(
              "px-4 py-2 text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'hero' ? 'font-medium' : 'text-law-gray hover:text-law-navy',
              "animate-fade-in"
            )}
          >
            ראשי
            <span 
              className={cn(
                "absolute bottom-0 left-1/2 w-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'hero' 
                  ? "w-1/2 h-0.5 transform -translate-x-1/2" 
                  : "w-0 h-0.5 group-hover:w-1/2 transform -translate-x-1/2 group-hover:h-0.5"
              )} 
            />
          </button>
          
          <button 
            onClick={() => handleLinkClick('/#about')}
            className={cn(
              "px-4 py-2 text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'about' ? 'font-medium' : 'text-law-gray hover:text-law-navy',
              "animate-fade-in"
            )}
            style={{ animationDelay: '0.1s' }}
          >
            אודות
            <span 
              className={cn(
                "absolute bottom-0 left-1/2 w-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'about' 
                  ? "w-1/2 h-0.5 transform -translate-x-1/2" 
                  : "w-0 h-0.5 group-hover:w-1/2 transform -translate-x-1/2 group-hover:h-0.5"
              )} 
            />
          </button>
          
          <NavigationMenu>
            <NavigationMenuList className="space-x-reverse">
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className={cn(
                    "px-4 py-2 text-law-navy transition-all duration-300 relative group bg-transparent hover:bg-transparent",
                    isHomePage && activeLink === 'expertise' ? 'font-medium' : 'text-law-gray hover:text-law-navy'
                  )}
                  onClick={scrollToExpertise}
                  style={{ animationDelay: '0.2s' }}
                >
                  תחומי עיסוק
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white rounded-md shadow-lg p-4 min-w-[400px] z-50 mt-1 text-right">
                  <div className="grid grid-cols-2 gap-3">
                    {practiceAreas.map((area) => (
                      <NavigationMenuLink
                        key={area.id}
                        className="block hover:bg-law-light rounded px-3 py-2 text-sm transition-colors flex items-center"
                        onClick={() => handlePracticeAreaClick(area.id)}
                      >
                        <span className="inline-flex mr-2 w-5 h-5">{area.icon}</span> 
                        <span>{area.title}</span>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <button 
            onClick={() => handleLinkClick('/articles')}
            className={cn(
              "px-4 py-2 text-law-navy transition-all duration-300 relative group",
              location.pathname === '/articles' ? 'font-medium' : 'text-law-gray hover:text-law-navy',
              "animate-fade-in"
            )}
            style={{ animationDelay: '0.3s' }}
          >
            מאמרים
            <span 
              className={cn(
                "absolute bottom-0 left-1/2 w-0 h-0.5 bg-law-navy transition-all duration-300",
                location.pathname === '/articles' 
                  ? "w-1/2 h-0.5 transform -translate-x-1/2" 
                  : "w-0 h-0.5 group-hover:w-1/2 transform -translate-x-1/2 group-hover:h-0.5"
              )} 
            />
          </button>
          
          <button 
            onClick={() => handleLinkClick('/#contact')}
            className={cn(
              "px-4 py-2 text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'contact' ? 'font-medium' : 'text-law-gray hover:text-law-navy',
              "animate-fade-in"
            )}
            style={{ animationDelay: '0.4s' }}
          >
            צור קשר
            <span 
              className={cn(
                "absolute bottom-0 left-1/2 w-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'contact' 
                  ? "w-1/2 h-0.5 transform -translate-x-1/2" 
                  : "w-0 h-0.5 group-hover:w-1/2 transform -translate-x-1/2 group-hover:h-0.5"
              )} 
            />
          </button>
          
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
      
      {/* Mobile menu - also needs to be updated for correct order */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full right-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-3 animate-slide-up max-h-[80vh] overflow-y-auto">
          <button 
            key="hero"
            onClick={() => handleLinkClick('/#hero')}
            className={cn(
              "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'hero' ? 'text-law-navy font-medium' : '',
              "transform transition-all hover:translate-x-2"
            )}
          >
            ראשי
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'hero' ? "w-8" : "w-0 group-hover:w-8"
              )} 
            />
          </button>
          
          <button 
            key="about"
            onClick={() => handleLinkClick('/#about')}
            className={cn(
              "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'about' ? 'text-law-navy font-medium' : '',
              "transform transition-all hover:translate-x-2"
            )}
          >
            אודות
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'about' ? "w-8" : "w-0 group-hover:w-8"
              )} 
            />
          </button>
          
          <div className="py-2">
            <button 
              onClick={scrollToExpertise}
              className={cn(
                "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
                isHomePage && activeLink === 'expertise' ? 'text-law-navy font-medium' : '',
                "transform transition-all hover:translate-x-2"
              )}
            >
              תחומי עיסוק
              <span 
                className={cn(
                  "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                  isHomePage && activeLink === 'expertise' ? "w-8" : "w-0 group-hover:w-8"
                )} 
              />
            </button>
            <div className="pr-4 mt-2 grid grid-cols-1 gap-2 border-r-2 border-law-navy/20">
              {practiceAreas.map((area) => (
                <button
                  key={area.id}
                  className="text-right text-sm text-law-gray hover:text-law-navy transition-all duration-300 py-1 flex items-center"
                  onClick={() => handlePracticeAreaClick(area.id)}
                >
                  <span className="inline-flex mr-1 w-4 h-4">{area.icon}</span> 
                  <span>{area.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button 
            key="articles"
            onClick={() => handleLinkClick('/articles')}
            className={cn(
              "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
              location.pathname === '/articles' ? 'text-law-navy font-medium' : '',
              "transform transition-all hover:translate-x-2"
            )}
          >
            מאמרים
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                location.pathname === '/articles' ? "w-8" : "w-0 group-hover:w-8"
              )} 
            />
          </button>
          
          <button 
            key="contact"
            onClick={() => handleLinkClick('/#contact')}
            className={cn(
              "py-2 text-right w-full text-law-gray hover:text-law-navy transition-all duration-300 relative group",
              isHomePage && activeLink === 'contact' ? 'text-law-navy font-medium' : '',
              "transform transition-all hover:translate-x-2"
            )}
          >
            צור קשר
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-0.5 bg-law-navy transition-all duration-300",
                isHomePage && activeLink === 'contact' ? "w-8" : "w-0 group-hover:w-8"
              )} 
            />
          </button>
          
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
  );
}
