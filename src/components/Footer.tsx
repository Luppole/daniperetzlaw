
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { EditableText } from '@/components/EditableText';

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
                <h3 className="text-xl font-bold"><EditableText id="footer-lawyer-name">עו"ד דני פרץ</EditableText></h3>
              </div>
            </div>
            <p className="text-law-silver mb-4">
              <EditableText id="footer-description">
                עורך דין מקצועי המתמחה בדיני משפחה, חדלות פרעון ומקרקעין, מספק ייעוץ משפטי אישי ומקצועי.
              </EditableText>
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
            <h3 className="text-xl font-bold mb-4 relative pb-2 text-white">
              <EditableText id="footer-quick-links">קישורים מהירים</EditableText>
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-law-silver"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-home">ראשי</EditableText>
                </a>
              </li>
              <li>
                <a href="#about" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-about">אודות</EditableText>
                </a>
              </li>
              <li>
                <a href="#expertise" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-expertise">תחומי התמחות</EditableText>
                </a>
              </li>
              <li>
                <a href="#articles" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-articles">מאמרים</EditableText>
                </a>
              </li>
              <li>
                <a href="#faq" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-faq">שאלות נפוצות</EditableText>
                </a>
              </li>
              <li>
                <a href="#contact" className="text-law-silver hover:text-white transition-colors inline-block hover:translate-x-2 transform duration-300">
                  <EditableText id="footer-contact">צור קשר</EditableText>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-4 relative pb-2 text-white">
              <EditableText id="footer-contact-title">צור קשר</EditableText>
              <span className="absolute bottom-0 right-0 w-12 h-0.5 bg-law-silver"></span>
            </h3>
            <ul className="space-y-3">
              <li className="text-law-silver flex items-start">
                <Phone className="h-5 w-5 ml-2 text-law-silver" />
                <EditableText id="footer-phone">053-339-5255</EditableText>
              </li>
              <li className="text-law-silver flex items-start">
                <Mail className="h-5 w-5 ml-2 text-law-silver" />
                <EditableText id="footer-email">dani@peretz-law.co.il</EditableText>
              </li>
              <li className="text-law-silver flex items-start">
                <MapPin className="h-5 w-5 ml-2 text-law-silver" />
                <EditableText id="footer-address">יפה ירקוני 22, עפולה</EditableText>
              </li>
              <li className="text-law-silver">
                <strong className="text-white"><EditableText id="footer-hours-title">שעות פעילות:</EditableText></strong> <EditableText id="footer-hours">א-ה: 09:00-18:00</EditableText>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-law-silver/20 mt-10 pt-6 text-center text-law-silver">
          <p><EditableText id="footer-copyright">© {currentYear} עו"ד דני פרץ. כל הזכויות שמורות.</EditableText></p>
        </div>
      </div>
    </footer>
  );
}
