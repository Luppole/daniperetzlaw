
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Calendar as CalendarIcon, 
  Loader2, 
  Clock, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  Check, 
  X,
  AlertCircle 
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { createAppointment, getBookedSlots } from '@/services/appointmentService';
import { cn } from "@/lib/utils";

interface AppointmentModalProps {
  trigger: React.ReactNode;
}

export function AppointmentModal({ trigger }: AppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [details, setDetails] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
      setTime(''); // Reset time selection when date changes
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const bookedSlots = await getBookedSlots(formattedDate);
      
      // Generate all possible time slots (adjust as needed)
      const allTimeSlots = generateTimeSlots();

      // Filter out the booked slots
      const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
      setAvailableTimes(available);
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const generateTimeSlots = (): string[] => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return slots;
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: boolean} = {};
    
    if (!name.trim()) errors.name = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = true;
    if (!phone.trim()) errors.phone = true;
    if (!selectedDate) errors.date = true;
    if (!time) errors.time = true;
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות הנדרשים.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = format(selectedDate!, 'yyyy-MM-dd');
      const appointmentData = {
        name,
        email,
        phone,
        date: formattedDate,
        time,
        details,
      };

      const result = await createAppointment(appointmentData);

      if (result.success) {
        toast({
          title: 'הצלחה',
          description: 'הפגישה נקבעה בהצלחה!',
        });
        setOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setTime('');
        setDetails('');
        setSelectedDate(new Date());
        setFormErrors({});
      } else {
        toast({
          title: 'שגיאה',
          description: 'לא ניתן לקבוע פגישה. נא לנסות שוב.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Appointment creation error:', error);
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה לא צפויה. נא לנסות שוב מאוחר יותר.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row h-full min-h-[600px]">
          {/* Left side - Calendar */}
          <div className="bg-law-navy text-white p-6 flex flex-col md:w-[40%]">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm mb-6 w-full">
              <h3 className="text-xl font-bold mb-4 text-center">בחר תאריך</h3>
              <div className="bg-white/5 rounded-lg p-1 mb-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md bg-white text-black mx-auto pointer-events-auto"
                  disabled={(date) => date < new Date()}
                  locale={he}
                  fixedWeeks
                  showOutsideDays={false}
                />
              </div>
              <div className={cn("text-center text-sm mt-2", formErrors.date ? "text-red-300" : "text-white/80")}>
                {formErrors.date ? (
                  <span className="flex items-center justify-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    נא לבחור תאריך
                  </span>
                ) : (
                  <span>התאריך שנבחר: {selectedDate ? format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he }) : 'לא נבחר'}</span>
                )}
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm w-full flex-1">
              <h3 className="text-xl font-bold mb-4 text-center">בחר שעה</h3>
              
              {selectedDate ? (
                <>
                  <Select onValueChange={setTime} value={time}>
                    <SelectTrigger 
                      className={cn("w-full backdrop-blur-sm border-white/30",
                        formErrors.time 
                          ? "bg-red-500/40 text-white border-red-400/50" 
                          : "bg-white/20 text-white"
                      )}
                    >
                      <SelectValue placeholder="בחר שעה" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {availableTimes.length > 0 ? (
                        availableTimes.map((timeSlot) => (
                          <SelectItem key={timeSlot} value={timeSlot} className="cursor-pointer hover:bg-law-navy/10">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {timeSlot}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled className="text-center py-2">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <X className="h-4 w-4" />
                            אין שעות זמינות
                          </span>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {time && (
                    <div className="mt-4 text-center bg-white/20 p-3 rounded-lg animate-fade-in">
                      <h4 className="font-medium mb-1">השעה שנבחרה:</h4>
                      <div className="text-xl font-bold flex items-center justify-center gap-2">
                        <Clock className="h-5 w-5" />
                        {time}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center bg-white/10 p-4 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p>נא לבחור תאריך תחילה</p>
                </div>
              )}
              
              {formErrors.time && (
                <div className="text-red-300 text-sm mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  נא לבחור שעה
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/20">
                <h4 className="font-medium mb-2 text-center">אודות הפגישה</h4>
                <p className="text-sm text-white/80 text-center">
                  הפגישה תערך במשרדי משרד עורכי הדין שלנו.
                  אנו מבקשים להגיע 5 דקות לפני השעה שנקבעה.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="p-6 md:w-[60%]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-law-navy">קביעת פגישה</DialogTitle>
              <DialogDescription>
                מלא את הפרטים שלך כדי לקבוע פגישה עם עורך דין.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right flex items-center gap-2">
                  <User className="h-4 w-4" /> שם מלא
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="ישראל ישראלי"
                  className={cn("border-2", formErrors.name ? "border-red-500/50" : "border-gray-200")}
                />
                {formErrors.name && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    שדה חובה
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right flex items-center gap-2">
                  <Mail className="h-4 w-4" /> אימייל
                </Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your-email@example.com"
                  className={cn("border-2", formErrors.email ? "border-red-500/50" : "border-gray-200")}
                />
                {formErrors.email && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    אימייל לא תקין
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right flex items-center gap-2">
                  <Phone className="h-4 w-4" /> טלפון
                </Label>
                <Input 
                  type="tel" 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="052-1234567"
                  className={cn("border-2", formErrors.phone ? "border-red-500/50" : "border-gray-200")}
                  dir="ltr"
                />
                {formErrors.phone && (
                  <div className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    שדה חובה
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details" className="text-right flex items-center gap-2">
                  <FileText className="h-4 w-4" /> פרטים נוספים
                </Label>
                <Textarea 
                  id="details" 
                  value={details} 
                  onChange={(e) => setDetails(e.target.value)} 
                  placeholder="תאר בקצרה את נושא הפגישה"
                  className="border-gray-200 min-h-[120px]"
                />
              </div>
              
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-law-navy hover:bg-law-navy/90 text-lg py-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      קבע פגישה
                    </>
                  )}
                </Button>
                
                <p className="text-gray-500 text-sm text-center mt-4">
                  לאחר קביעת הפגישה, תישלח אליך הודעת אישור לאימייל.
                </p>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
