
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-law-navy text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="animate-slide-up">
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-md">
                <span className="text-2xl font-rubik font-bold text-law-navy">DP</span>
              </div>
              <div className="mr-3">
                <h3 className="text-xl font-bold">עו"ד דני פרץ</h3>
              </div>
            </div>
            <p className="text-law-silver mb-4">
              משרד עורכי דין המתמחה בדיני משפחה, חדלות פרעון ומקרקעין, מספק שירותים משפטיים מקצועיים ואישיים.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="https://www.facebook.com/danipertz05/" target="_blank" rel="noopener noreferrer" className="text-law-silver hover:text-white transition-colors group">
                <Facebook size={20} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="text-law-silver hover:text-white transition-colors group">
                <Instagram size={20} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="text-law-silver hover:text-white transition-colors group">
                <Linkedin size={20} className="transition-transform group-hover:scale-110" />
              </a>
              <a href="#" className="text-law-silver hover:text-white transition-colors group">
                <Youtube size={20} className="transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold mb-4 relative pb-2">
              קישורים מהירים
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-law-silver"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  ראשי
                </a>
              </li>
              <li>
                <a href="#about" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  אודות
                </a>
              </li>
              <li>
                <a href="#expertise" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  תחומי התמחות
                </a>
              </li>
              <li>
                <a href="#articles" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  מאמרים
                </a>
              </li>
              <li>
                <a href="#faq" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  שאלות נפוצות
                </a>
              </li>
              <li>
                <a href="#contact" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  צור קשר
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-4 relative pb-2">
              צור קשר
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-law-silver"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-law-silver flex items-start">
                <Phone className="h-5 w-5 ml-2 text-law-silver" />
                <span>054-1234567</span>
              </li>
              <li className="text-law-silver flex items-start">
                <Mail className="h-5 w-5 ml-2 text-law-silver" />
                <span>dani@peretz-law.co.il</span>
              </li>
              <li className="text-law-silver flex items-start">
                <MapPin className="h-5 w-5 ml-2 text-law-silver" />
                <span>רחוב הרצל 53, תל אביב</span>
              </li>
              <li className="text-law-silver">
                <strong className="text-white">שעות פעילות:</strong> א-ה: 09:00-18:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-law-silver/20 mt-10 pt-6 text-center text-law-silver">
          <p>© {currentYear} עו"ד דני פרץ. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
