
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      <div className="hero-pattern absolute inset-0 opacity-40"></div>
      
      <div className="container mx-auto px-4 pt-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="order-2 md:order-1 animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-law-dark mb-4">
            פתרונות משפטיים <br />
            <span className="text-law-blue">מקצועיים ואישיים</span>
          </h1>
          <p className="text-lg text-law-gray mb-8 max-w-xl">
            עו"ד דני פרץ מתמחה בליווי משפטי מקיף ומקצועי לאנשים פרטיים ולעסקים, במגוון תחומי המשפט האזרחי והמסחרי.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
            <Button className="bg-law-blue hover:bg-law-blue/80 text-white py-6 px-8 rounded-md font-medium">
              קבע פגישת ייעוץ
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-law-gray text-law-dark py-6 px-8 rounded-md font-medium">
              צור קשר
            </Button>
          </div>
        </div>
        
        <div className="order-1 md:order-2 flex justify-center">
          <img 
            src="/lovable-uploads/59947d09-e61a-4e37-b161-5080e008c18f.png" 
            alt="עו״ד דני פרץ" 
            className="rounded-lg shadow-xl max-w-full h-auto max-h-[500px] object-cover animate-fade-in"
          />
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <a href="#about" className="text-law-gray hover:text-law-blue transition-colors">
          <div className="flex flex-col items-center">
            <span className="mb-2">קרא עוד</span>
            <div className="w-6 h-10 border-2 border-law-gray rounded-full flex justify-center pt-1">
              <div className="w-1 h-3 bg-law-gray rounded-full animate-bounce"></div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
