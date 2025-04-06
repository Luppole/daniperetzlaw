
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { EditableText } from '@/components/EditableText';

interface ContactInfoItem {
  icon: React.ReactNode;
  title: string;
  details: string;
  id: string;
}

export function ContactInfo() {
  const contactInfo: ContactInfoItem[] = [
    { 
      icon: <Phone className="h-6 w-6 text-law-blue" />, 
      title: 'טלפון', 
      details: '053-339-5255',
      id: 'contact-phone'
    },
    { 
      icon: <Mail className="h-6 w-6 text-law-blue" />, 
      title: 'אימייל', 
      details: 'dani@peretz-law.co.il',
      id: 'contact-email'
    },
    { 
      icon: <MapPin className="h-6 w-6 text-law-blue" />, 
      title: 'כתובת', 
      details: 'יפה ירקוני 18, עפולה',
      id: 'contact-address'
    },
    { 
      icon: <Clock className="h-6 w-6 text-law-blue" />, 
      title: 'שעות פעילות', 
      details: 'א-ה: 09:00-18:00',
      id: 'contact-hours'
    },
  ];

  return (
    <div className="glass-card p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-law-dark mb-6">
        <EditableText id="contact-info-title">פרטי התקשרות</EditableText>
      </h3>
      
      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-start group">
            <div className="ml-4 mt-1 transform transition-all duration-300 group-hover:scale-110">{item.icon}</div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h4 className="font-medium text-law-dark">
                <EditableText id={`contact-label-${item.id}`}>{item.title}</EditableText>
              </h4>
              <p className="text-law-gray">
                <EditableText id={item.id}>{item.details}</EditableText>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
