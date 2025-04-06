
import React from 'react';
import { ContactForm } from '@/components/ContactForm';
import { ContactInfo } from '@/components/ContactInfo';
import { LocationMap } from '@/components/LocationMap';

export function ContactSection() {
  return (
    <section id="contact" className="section-wrapper bg-law-light">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title">צור קשר</h2>
          <p className="section-subtitle">אשמח לעמוד לשירותך</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <ContactForm />
          
          <div className="space-y-8 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            <ContactInfo />
            <LocationMap address="יפה ירקוני 18, עפולה" />
          </div>
        </div>
      </div>
    </section>
  );
}
