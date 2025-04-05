
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-law-dark text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4">עו"ד דני פרץ</h3>
            <p className="text-gray-300 mb-4">
              משרד עורכי דין המתמחה במשפט אזרחי ומסחרי, מספק שירותים משפטיים לאנשים פרטיים ועסקים.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-law-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-law-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-law-blue transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-law-blue transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-gray-300 hover:text-law-blue transition-colors">ראשי</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-law-blue transition-colors">אודות</a></li>
              <li><a href="#expertise" className="text-gray-300 hover:text-law-blue transition-colors">תחומי התמחות</a></li>
              <li><a href="#articles" className="text-gray-300 hover:text-law-blue transition-colors">מאמרים</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-law-blue transition-colors">שאלות נפוצות</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-law-blue transition-colors">צור קשר</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">צור קשר</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">טלפון: 054-1234567</li>
              <li className="text-gray-300">אימייל: dani@peretz-law.co.il</li>
              <li className="text-gray-300">כתובת: רחוב הרצל 53, תל אביב</li>
              <li className="text-gray-300">שעות פעילות: א-ה: 09:00-18:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© {currentYear} עו"ד דני פרץ. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
