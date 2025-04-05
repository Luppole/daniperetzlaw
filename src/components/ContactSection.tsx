
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function ContactSection() {
  const contactInfo = [
    { icon: <Phone className="h-6 w-6 text-law-blue" />, title: 'טלפון', details: '054-1234567' },
    { icon: <Mail className="h-6 w-6 text-law-blue" />, title: 'אימייל', details: 'dani@peretz-law.co.il' },
    { icon: <MapPin className="h-6 w-6 text-law-blue" />, title: 'כתובת', details: 'רחוב הרצל 53, תל אביב' },
    { icon: <Clock className="h-6 w-6 text-law-blue" />, title: 'שעות פעילות', details: 'א-ה: 09:00-18:00' },
  ];

  return (
    <section id="contact" className="section-wrapper bg-law-light">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">צור קשר</h2>
          <p className="section-subtitle">נשמח לעמוד לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold text-law-dark mb-6">השאירו פרטים</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input id="name" placeholder="הקלד את שמך" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input id="phone" placeholder="הקלד את מספר הטלפון שלך" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input id="email" type="email" placeholder="הקלד את כתובת האימייל שלך" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">נושא</Label>
                <Input id="subject" placeholder="נושא הפנייה" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">הודעה</Label>
                <Textarea id="message" placeholder="כתוב את הודעתך כאן" rows={5} />
              </div>
              
              <Button className="w-full bg-law-blue hover:bg-law-blue/80 text-white py-6">
                שלח הודעה
              </Button>
            </form>
          </div>
          
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-law-dark mb-6">פרטי התקשרות</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="ml-4 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-medium text-law-dark">{item.title}</h4>
                      <p className="text-law-gray">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card p-8 h-64">
              <h3 className="text-2xl font-bold text-law-dark mb-4">מיקום המשרד</h3>
              <div className="bg-gray-200 w-full h-40 flex items-center justify-center text-law-gray">
                כאן תוצג מפה אינטראקטיבית
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
