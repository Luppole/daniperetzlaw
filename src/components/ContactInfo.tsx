
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  details: string;
}

export function ContactInfo() {
  const contactInfo: ContactInfoItem[] = [
    { icon: <Phone className="h-6 w-6 text-law-blue" />, title: 'טלפון', details: '053-339-5255' },
    { icon: <Mail className="h-6 w-6 text-law-blue" />, title: 'אימייל', details: 'dani@peretz-law.co.il' },
    { icon: <MapPin className="h-6 w-6 text-law-blue" />, title: 'כתובת', details: 'יפה ירקוני 18, עפולה' },
    { icon: <Clock className="h-6 w-6 text-law-blue" />, title: 'שעות פעילות', details: 'א-ה: 09:00-18:00' },
  ];

  return (
    <div className="glass-card p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-law-dark mb-6">פרטי התקשרות</h3>
      
      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-start group">
            <div className="ml-4 mt-1 transform transition-all duration-300 group-hover:scale-110">{item.icon}</div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h4 className="font-medium text-law-dark">{item.title}</h4>
              <p className="text-law-gray">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
