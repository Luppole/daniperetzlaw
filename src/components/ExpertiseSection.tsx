
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import practiceAreas from './PracticeAreaDescriptions';
import { useLocation } from 'react-router-dom';

export function ExpertiseSection() {
  const [openPracticeArea, setOpenPracticeArea] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check for practice area in URL hash
    const hash = location.hash;
    if (hash && hash.includes('#')) {
      const areaId = hash.split('#')[1];
      const area = practiceAreas.find(a => a.id === areaId);
      if (area) {
        setTimeout(() => {
          setOpenPracticeArea(areaId);
        }, 500);
      }
    }

    // Check if there's a stored practice area from navigation
    const storedArea = sessionStorage.getItem('openPracticeArea');
    if (storedArea) {
      setTimeout(() => {
        setOpenPracticeArea(storedArea);
        sessionStorage.removeItem('openPracticeArea');
      }, 800);
    }
  }, [location.hash]);

  return (
    <section id="expertise" className="section-wrapper animated-gradient parallax">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title text-law-navy">תחומי התמחות</h2>
          <p className="section-subtitle">הניסיון והמקצועיות שלנו לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceAreas.map((area, index) => {
            // Find if this area should be open
            const isOpen = openPracticeArea === area.id;
            
            return (
              <Card 
                key={area.id} 
                id={area.id}
                className={`border border-gray-200 hover:border-law-navy/30 transition-all duration-500 hover:shadow-lg animate-on-scroll hover:-translate-y-2 cursor-pointer ${isOpen ? 'ring-2 ring-law-blue' : ''}`} 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setOpenPracticeArea(area.id)}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center transform transition-transform hover:scale-110 duration-300 text-4xl mb-2 text-law-blue">
                    {area.icon}
                  </div>
                  <CardTitle className="text-2xl font-rubik text-law-navy">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-law-gray text-center text-base">
                    {area.shortDescription}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Dialog open={isOpen} onOpenChange={(open) => {
                    if (open) {
                      setOpenPracticeArea(area.id);
                    } else {
                      setOpenPracticeArea(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 btn-pulse">
                        קרא עוד
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl mb-4">{area.title}</DialogTitle>
                        <DialogDescription className="text-lg text-law-gray">
                          {area.fullDescription}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex justify-between mt-6">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOpenPracticeArea(null);
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          צור קשר בנושא {area.title}
                        </Button>
                        <Link to={`/articles?expertise=${area.id}`} onClick={() => setOpenPracticeArea(null)}>
                          <Button>
                            כל המאמרים בנושא {area.title}
                          </Button>
                        </Link>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
