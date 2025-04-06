
import React, { useState } from 'react';
import { CheckCircle, Loader, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { EditableText } from '@/components/EditableText';
import { saveContactMessage } from '@/services/contactMessageService';

export function ContactForm() {
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
  const recipientEmail = 'daniperetz05@gmail.com';

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

  const sendEmail = async (data: typeof formData) => {
    try {
      // Create a mailto URL with the form data
      const subject = encodeURIComponent(`פנייה מאתר האינטרנט: ${data.subject}`);
      const body = encodeURIComponent(
        `שם: ${data.name}\n` +
        `טלפון: ${data.phone}\n` +
        `אימייל: ${data.email}\n\n` +
        `הודעה:\n${data.message}`
      );
      
      // Open the user's email client with the mailto link
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
      
      // Record the email sending attempt
      console.log('Email prepared for:', recipientEmail, 'with subject:', data.subject);
      return true;
    } catch (error) {
      console.error('Failed to prepare email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // First try to save to database using our service - this now always succeeds 
        // or falls back to email only
        await saveContactMessage({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        
        // Then attempt to send email
        await sendEmail(formData);
        
        setIsSubmitting(false);
        setSubmitted(true);
        toast.success("הודעה נשלחה בהצלחה", {
          description: "תודה על פנייתך, ניצור איתך קשר בהקדם",
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
      } catch (error) {
        console.error("Error sending message:", error);
        setIsSubmitting(false);
        
        // Even if there's an error, try to open the email client as a fallback
        const emailSent = await sendEmail(formData);
        
        if (emailSent) {
          toast.success("המייל נפתח בתוכנת הדואר שלך", {
            description: "אנא שלח את ההודעה באופן ידני",
          });
        } else {
          toast.error("שגיאה בשליחת ההודעה", {
            description: "אנא נסה שוב או צור קשר באמצעי אחר",
          });
        }
      }
    }
  };

  return (
    <div className="glass-card p-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-on-scroll">
      <h3 className="text-2xl font-bold text-law-dark mb-6">
        <EditableText id="contact-form-title">השאירו פרטים</EditableText>
      </h3>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
          <h4 className="text-xl font-medium text-law-dark">
            <EditableText id="contact-form-success-title">ההודעה נשלחה בהצלחה!</EditableText>
          </h4>
          <p className="text-law-gray">
            <EditableText id="contact-form-success-message">תודה על פנייתך, ניצור איתך קשר בהקדם.</EditableText>
          </p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <EditableText id="contact-form-name-label">שם מלא</EditableText>
              </Label>
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
              <Label htmlFor="phone">
                <EditableText id="contact-form-phone-label">טלפון</EditableText>
              </Label>
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
            <Label htmlFor="email">
              <EditableText id="contact-form-email-label">אימייל</EditableText>
            </Label>
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
            <Label htmlFor="subject">
              <EditableText id="contact-form-subject-label">נושא</EditableText>
            </Label>
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
            <Label htmlFor="message">
              <EditableText id="contact-form-message-label">הודעה</EditableText>
            </Label>
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
            className="w-full bg-law-navy hover:bg-law-navy/90 text-white py-6 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md relative group"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                <EditableText id="contact-form-submitting">שולח הודעה...</EditableText>
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                <EditableText id="contact-form-submit">שלח הודעה</EditableText>
              </>
            )}
            <span 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" 
              aria-hidden="true"
            />
          </Button>
        </form>
      )}
    </div>
  );
}
