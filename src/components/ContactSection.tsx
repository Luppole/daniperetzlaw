
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Map } from '@/components/Map';
import { toast } from '@/components/ui/use-toast';

export function ContactSection() {
  const contactInfo = [
    { icon: <Phone className="h-6 w-6 text-law-blue" />, title: 'טלפון', details: '054-1234567' },
    { icon: <Mail className="h-6 w-6 text-law-blue" />, title: 'אימייל', details: 'dani@peretz-law.co.il' },
    { icon: <MapPin className="h-6 w-6 text-law-blue" />, title: 'כתובת', details: 'יפה ירקוני 22, עפולה' },
    { icon: <Clock className="h-6 w-6 text-law-blue" />, title: 'שעות פעילות', details: 'א-ה: 09:00-18:00' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'נא להזין שם מלא';
    if (!formData.phone.trim()) newErrors.phone = 'נא להזין מספר טלפון';
    if (!formData.email.trim()) newErrors.email = 'נא להזין כתובת אימייל';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'נא להזין כתובת אימייל תקינה';
    }
    if (!formData.subject.trim()) newErrors.subject = 'נא להזין נושא';
    if (!formData.message.trim()) newErrors.message = 'נא להזין הודעה';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        toast({
          title: "הודעה נשלחה בהצלחה",
          description: "תודה על פנייתך, ניצור איתך קשר בהקדם",
          variant: "default",
        });
        
        // Reset form after delay
        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            email: '',
            subject: '',
            message: ''
          });
          setSubmitted(false);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <section id="contact" className="section-wrapper bg-law-light">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="section-title">צור קשר</h2>
          <p className="section-subtitle">נשמח לעמוד לשירותכם</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="glass-card p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll">
            <h3 className="text-2xl font-bold text-law-dark mb-6">השאירו פרטים</h3>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
                <h4 className="text-xl font-medium text-law-dark">ההודעה נשלחה בהצלחה!</h4>
                <p className="text-law-gray">תודה על פנייתך, ניצור איתך קשר בהקדם.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="הקלד את שמך" 
                      className={`transition-all duration-200 focus:ring-2 focus:ring-law-blue/50 ${errors.name ? 'border-red-500 focus:ring-red-500/50' : ''}`} 
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="הקלד את מספר הטלפון שלך" 
                      className={`transition-all duration-200 focus:ring-2 focus:ring-law-blue/50 ${errors.phone ? 'border-red-500 focus:ring-red-500/50' : ''}`} 
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="הקלד את כתובת האימייל שלך" 
                    className={`transition-all duration-200 focus:ring-2 focus:ring-law-blue/50 ${errors.email ? 'border-red-500 focus:ring-red-500/50' : ''}`} 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">נושא</Label>
                  <Input 
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="נושא הפנייה" 
                    className={`transition-all duration-200 focus:ring-2 focus:ring-law-blue/50 ${errors.subject ? 'border-red-500 focus:ring-red-500/50' : ''}`} 
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">הודעה</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="כתוב את הודעתך כאן" 
                    rows={5} 
                    className={`transition-all duration-200 focus:ring-2 focus:ring-law-blue/50 ${errors.message ? 'border-red-500 focus:ring-red-500/50' : ''}`} 
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-law-blue hover:bg-law-blue/90 text-white py-6 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md relative overflow-hidden"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      שולח הודעה...
                    </>
                  ) : (
                    'שלח הודעה'
                  )}
                  <span className="absolute inset-0 overflow-hidden rounded-md" style={{ zIndex: -1 }}>
                    <span className="absolute -inset-1 opacity-0 group-active:opacity-20 bg-white transition-opacity duration-300" />
                  </span>
                </Button>
              </form>
            )}
          </div>
          
          <div className="space-y-8 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
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
            
            <div className="glass-card p-8 h-64 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-bold text-law-dark mb-4">מיקום המשרד</h3>
              <Map address="יפה ירקוני 22, עפולה" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
