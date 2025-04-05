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
  Send,
  UserRound,
  Phone,
  Mail,
  FileText,
  CheckCircle
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      if (formSubmitted) {
        setName('');
        setEmail('');
        setPhone('');
        setTime('');
        setDetails('');
        setSelectedDate(new Date());
        setFormErrors({});
        setFormSubmitted(false);
      }
    }
  }, [open, formSubmitted]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
      setTime(''); // Reset time selection when date changes
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      try {
        console.log('Fetching booked slots for date:', formattedDate);
        const bookedSlots = await getBookedSlots(formattedDate);
        console.log('Booked slots:', bookedSlots);
        
        // Generate all possible time slots
        const allTimeSlots = generateTimeSlots();
        console.log('All time slots:', allTimeSlots);

        // Filter out the booked slots
        const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
        console.log('Available time slots:', available);
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

    if (open && selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate, toast, open]);

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
        setFormSubmitted(true);
        toast({
          title: 'הצלחה',
          description: 'הפגישה נקבעה בהצלחה!',
        });
        // Keep the modal open but show success state
        setIsSubmitting(false);
      } else {
        toast({
          title: 'שגיאה',
          description: 'לא ניתן לקבוע פגישה. נא לנסות שוב.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Appointment creation error:', error);
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה לא צפויה. נא לנסות שוב מאוחר יותר.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[90%] md:max-w-[850px] p-6 overflow-y-auto max-h-[90vh] rounded-xl shadow-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-law-navy text-center mb-4">קביעת פגישה</DialogTitle>
        </DialogHeader>
        
        {formSubmitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="bg-green-50 p-6 rounded-full">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">הפגישה נקבעה בהצלחה!</h3>
            <p className="text-gray-600 max-w-md">
              פרטי הפגישה נשלחו לכתובת האימייל שלך. נציג יצור איתך קשר בהקדם לאישור הפגישה.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 my-4 border border-gray-100">
              <p className="font-medium">פרטי הפגישה:</p>
              <p className="text-gray-600">{name}</p>
              <p className="text-gray-600">{format(selectedDate!, 'EEEE, d בMMMM yyyy', { locale: he })} - {time}</p>
            </div>
            <Button 
              onClick={() => setOpen(false)} 
              className="mt-4 bg-law-navy hover:bg-law-navy/90 text-white"
            >
              סגור
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Personal Information */}
              <div className="space-y-4 order-2 md:order-1">
                <div className="bg-law-light rounded-lg p-5 shadow-sm">
                  <h3 className="font-medium text-law-navy mb-4 flex items-center text-lg">
                    <UserRound className="h-5 w-5 ml-2" />
                    פרטים אישיים
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-right block mb-2">שם מלא</Label>
                      <div className="relative">
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          placeholder="ישראל ישראלי"
                          className={cn(
                            "bg-white",
                            formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                          )}
                        />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">שדה חובה</p>}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-right block mb-2">טלפון</Label>
                      <div className="relative">
                        <Input 
                          type="tel" 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="052-1234567"
                          dir="ltr"
                          className={cn(
                            "bg-white",
                            formErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                          )}
                        />
                        {formErrors.phone && <p className="text-red-500 text-xs mt-1">שדה חובה</p>}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-right block mb-2">אימייל</Label>
                      <div className="relative">
                        <Input 
                          type="email" 
                          id="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="your-email@example.com"
                          dir="ltr"
                          className={cn(
                            "bg-white",
                            formErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                          )}
                        />
                        {formErrors.email && <p className="text-red-500 text-xs mt-1">אימייל לא תקין</p>}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-law-light rounded-lg p-5 shadow-sm">
                  <h3 className="font-medium text-law-navy mb-4 flex items-center text-lg">
                    <FileText className="h-5 w-5 ml-2" />
                    פרטי הפגישה
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="details" className="text-right block mb-2">נושא הפגישה</Label>
                      <Textarea 
                        id="details" 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)} 
                        placeholder="תאר בקצרה את נושא הפגישה"
                        className="min-h-[100px] bg-white"
                      />
                    </div>
                    
                    {selectedDate && time && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center text-law-navy">
                        <p className="font-medium mb-1">מועד נבחר:</p>
                        <p className="text-gray-600">{format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}</p>
                        <p className="font-bold text-lg text-law-navy">{time}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-law-navy hover:bg-law-navy/90 text-white py-6 mt-6 text-base"
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
              </div>
              
              {/* Right column - Calendar */}
              <div className="order-1 md:order-2 bg-law-light rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <CalendarIcon className="h-5 w-5 ml-2 text-law-navy" />
                  <h3 className="text-lg font-medium text-law-navy">בחירת מועד</h3>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="mb-6 bg-white p-3 rounded-lg shadow-sm w-full">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md w-full pointer-events-auto"
                      disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      locale={he}
                      fixedWeeks
                    />
                  </div>
                  {formErrors.date && <p className="text-red-500 text-xs text-center mt-1 mb-3">נא לבחור תאריך</p>}
                  
                  <div className="w-full mt-4">
                    <Label htmlFor="time" className="text-right block mb-2 flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      בחירת שעה
                    </Label>
                    <Select onValueChange={setTime} value={time}>
                      <SelectTrigger className={cn(
                        "bg-white", 
                        formErrors.time ? "border-red-500 focus-visible:ring-red-500" : "", 
                        "w-full"
                      )}>
                        <SelectValue placeholder="בחר שעה" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-white max-h-[200px] overflow-y-auto z-50">
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
                  </div>
                  
                  <div className="bg-blue-50 w-full mt-6 p-4 rounded-lg border border-blue-100">
                    <h4 className="font-medium mb-2 text-law-navy">הסבר:</h4>
                    <ul className="space-y-2 text-sm text-gray-600 list-disc pr-5">
                      <li>בחר תאריך מהלוח</li>
                      <li>בחר שעה פנויה מהרשימה</li>
                      <li>מלא את הפרטים האישיים</li>
                      <li>אנו ניצור איתך קשר לאישור סופי</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
