
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import practiceAreas from './PracticeAreaDescriptions';

export function ExpertiseSection() {
  React.useEffect(() => {
    // Check if there's a practice area to open from session storage
    const areaToOpen = sessionStorage.getItem('openPracticeArea');
    if (areaToOpen) {
      // Clear the storage item
      sessionStorage.removeItem('openPracticeArea');
      
      // Give some time for the component to fully render
      setTimeout(() => {
        const dialogTrigger = document.querySelector(`[data-practice-area="${areaToOpen}"]`) as HTMLButtonElement;
        if (dialogTrigger) {
          dialogTrigger.click();
        }
      }, 1000);
    }
  }, []);

  return (
    <section id="expertise" className="section-wrapper animated-gradient parallax">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title text-law-navy">תחומי התמחות</h2>
          <p className="section-subtitle">הניסיון והמקצועיות שלנו לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practiceAreas.map((area, index) => (
            <Card 
              key={area.id} 
              className="border border-gray-200 hover:border-law-navy/30 transition-all duration-500 hover:shadow-lg animate-on-scroll hover:-translate-y-2" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center transform transition-transform hover:scale-110 duration-300 text-4xl mb-2">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300 btn-pulse"
                      data-practice-area={area.id}
                    >
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
                    <DialogFooter className="flex justify-between mt-6 space-x-6 space-x-reverse">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="text-law-navy border-law-navy hover:bg-law-navy hover:text-white transition-all duration-300"
                          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          צור קשר בנושא {area.title}
                        </Button>
                      </DialogClose>
                      <Link to={`/articles?expertise=${area.id}`}>
                        <Button
                          className="bg-law-navy hover:bg-law-navy/80 text-white transition-all duration-300"
                        >
                          כל המאמרים בנושא {area.title}
                        </Button>
                      </Link>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
