
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Loader2, 
  Calendar as CalendarIcon, 
  Clock,
  Send
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
      
      try {
        const bookedSlots = await getBookedSlots(formattedDate);
        console.log('Booked slots:', bookedSlots);
        
        // Generate all possible time slots (adjust as needed)
        const allTimeSlots = generateTimeSlots();

        // Filter out the booked slots
        const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
        setAvailableTimes(available);
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
        // Fallback to all slots if API fails
        setAvailableTimes(generateTimeSlots());
        toast({
          title: "שגיאה בטעינת שעות זמינות",
          description: "אנא נסה שנית מאוחר יותר",
          variant: "destructive",
        });
      }
    };

    fetchBookedSlots();
  }, [selectedDate, toast]);

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

      console.log('Submitting appointment data:', appointmentData);
      const result = await createAppointment(appointmentData);
      console.log('Result from createAppointment:', result);

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
      <DialogContent className="sm:max-w-[550px] p-6 overflow-hidden rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-law-navy text-center mb-4">קביעת פגישה</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Personal Information */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">שם מלא</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="ישראל ישראלי"
                className={cn(formErrors.name ? "border-red-500" : "")}
              />
              {formErrors.name && <p className="text-red-500 text-xs">שדה חובה</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block">טלפון</Label>
              <Input 
                type="tel" 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="052-1234567"
                dir="ltr"
                className={cn(formErrors.phone ? "border-red-500" : "")}
              />
              {formErrors.phone && <p className="text-red-500 text-xs">שדה חובה</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">אימייל</Label>
              <Input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your-email@example.com"
                dir="ltr"
                className={cn(formErrors.email ? "border-red-500" : "")}
              />
              {formErrors.email && <p className="text-red-500 text-xs">אימייל לא תקין</p>}
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-4 pt-4">
            <div className="flex items-center justify-center mb-4">
              <CalendarIcon className="h-5 w-5 ml-2 text-law-navy" />
              <h3 className="text-lg font-medium">בחירת מועד</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 items-start">
              <div>
                <div className="mb-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md mx-auto"
                    disabled={(date) => date < new Date()}
                    locale={he}
                    fixedWeeks
                  />
                </div>
                {formErrors.date && <p className="text-red-500 text-xs text-center">נא לבחור תאריך</p>}
              </div>
              
              <div className="flex flex-col justify-center">
                <Label htmlFor="time" className="text-right block mb-2 flex items-center">
                  <Clock className="h-4 w-4 ml-1" />
                  בחירת שעה
                </Label>
                <Select onValueChange={setTime} value={time}>
                  <SelectTrigger className={cn(formErrors.time ? "border-red-500" : "")}>
                    <SelectValue placeholder="בחר שעה" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((timeSlot) => (
                        <SelectItem key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled className="text-center py-2">
                        אין שעות זמינות
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formErrors.time && <p className="text-red-500 text-xs mt-1">נא לבחור שעה</p>}
                
                {selectedDate && time && (
                  <div className="mt-4 p-3 bg-law-light rounded-lg text-center text-law-navy">
                    <p className="font-medium">נבחר:</p>
                    <p>{format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}</p>
                    <p className="font-bold">{time}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details" className="text-right block">פרטים נוספים</Label>
            <Textarea 
              id="details" 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              placeholder="תאר בקצרה את נושא הפגישה"
              className="min-h-[80px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-law-navy hover:bg-law-navy/90 text-white py-6 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                <Send className="ml-2 h-5 w-5" />
                קבע פגישה
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
