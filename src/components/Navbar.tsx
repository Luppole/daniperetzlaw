
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('hero');
  
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar background based on scroll position
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
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
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { title: 'ראשי', href: '#hero' },
    { title: 'אודות', href: '#about' },
    { title: 'תחומי התמחות', href: '#expertise' },
    { title: 'מאמרים', href: '#articles' },
    { title: 'שאלות נפוצות', href: '#faq' },
    { title: 'צור קשר', href: '#contact' },
  ];

  return (
    <header className={cn(
      'fixed w-full z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm py-2' : 'bg-transparent py-4'
    )}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#hero" className="text-2xl font-rubik font-bold text-law-dark hover:text-law-blue transition-colors duration-300">
          עו"ד דני פרץ
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 text-law-gray transition-colors duration-300 nav-link",
                activeLink === link.href.replace('#', '') ? 'text-law-blue font-medium' : 'hover:text-law-blue'
              )}
            >
              {link.title}
            </a>
          ))}
          <Button className="mr-4 bg-law-blue hover:bg-law-blue/80 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg btn-pulse">
            צור קשר
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-law-dark p-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
        >
          {isMenuOpen ? <X size={24} className="animate-fade-in" /> : <Menu size={24} className="animate-fade-in" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full right-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-3 animate-slide-up">
          {navLinks.map((link, index) => (
            <a 
              key={link.href}
              href={link.href}
              className={cn(
                "py-2 text-law-gray hover:text-law-blue transition-colors duration-300",
                activeLink === link.href.replace('#', '') ? 'text-law-blue font-medium' : '',
                "transform transition-all hover:translate-x-2"
              )}
              onClick={toggleMenu}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {link.title}
            </a>
          ))}
          <Button className="w-full bg-law-blue hover:bg-law-blue/80 mt-4 btn-pulse">
            צור קשר
          </Button>
        </nav>
      )}
    </header>
  );
}
