import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pb-20">
      <div className="absolute inset-0 bg-law-navy/5 pattern-grid-lg opacity-30"></div>
      
      <div className="container mx-auto px-4 pt-24 grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="order-2 md:order-1">
          <div className="flex items-center mb-4 animate-slide-in-left">
            <div className="bg-law-navy p-3 rounded-lg">
              <span className="text-3xl font-rubik font-bold text-white">DP</span>
            </div>
            <div className="mr-3 border-r-2 border-law-navy pr-3 cursor-pointer" onClick={scrollToTop}>
              <h2 className="text-2xl font-rubik font-bold text-law-navy">דני פרץ</h2>
              <p className="text-law-gray">עורך דין</p>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-law-navy mb-6 animate-slide-up">
            פתרונות משפטיים <br />
            <span className="relative">
              מקצועיים ואישיים
              <span className="absolute -bottom-2 right-0 w-1/3 h-1 bg-law-navy"></span>
            </span>
          </h1>
          
          <p className="text-lg text-law-gray mb-10 max-w-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            מתמחה במשפחה, חדלות פרעון ומקרקעין - מספק ליווי משפטי מקיף ומקצועי לאנשים פרטיים ולעסקים.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              className="bg-law-navy hover:bg-law-navy/80 text-white py-6 px-8 rounded-md font-medium transition-all hover:-translate-y-1 hover:shadow-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              קבע פגישת ייעוץ
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-law-navy text-law-navy py-6 px-8 rounded-md font-medium transition-all hover:bg-law-navy hover:text-white hover:shadow-md"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              צור קשר
            </Button>
          </div>
        </div>
        
        <div className="order-1 md:order-2 flex justify-center animate-slide-in-right">
          <div className="relative">
            <div className="absolute -inset-4 bg-law-navy rounded-xl opacity-10 animate-pulse-light"></div>
            <img 
              src="/lovable-uploads/41432968-0b99-4cba-9e29-f6fdea6a4272.png" 
              alt="עו״ד דני פרץ" 
              className="rounded-lg shadow-xl max-w-full h-auto max-h-[450px] object-cover relative z-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-law-navy rounded-full flex items-center justify-center text-white font-bold text-sm z-20 animate-float">
              <span className="text-center">6 שנות<br />ניסיון</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={scrollToAbout} className="text-law-navy hover:text-law-navy/70 transition-colors">
          <div className="flex flex-col items-center">
            <span className="mb-2">קרא עוד</span>
            <div className="w-6 h-10 border-2 border-law-navy rounded-full flex justify-center pt-1">
              <div className="w-1 h-3 bg-law-navy rounded-full"></div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
