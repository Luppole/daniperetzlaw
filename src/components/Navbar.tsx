
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
        <a href="#hero" className="text-2xl font-serif font-bold text-law-dark">עו"ד דני פרץ</a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-law-gray hover:text-law-blue transition-colors"
            >
              {link.title}
            </a>
          ))}
          <Button className="mr-4 bg-law-blue hover:bg-law-blue/80">
            צור קשר
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-law-dark"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden absolute top-full right-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-3">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              className="py-2 text-law-gray hover:text-law-blue transition-colors"
              onClick={toggleMenu}
            >
              {link.title}
            </a>
          ))}
          <Button className="w-full bg-law-blue hover:bg-law-blue/80 mt-4">
            צור קשר
          </Button>
        </nav>
      )}
    </header>
  );
}
