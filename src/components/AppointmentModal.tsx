
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Loader2, Clock, Mail, Phone, User, FileText } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      toast({
        title: 'שגיאה',
        description: 'נא לבחור תאריך.',
        variant: 'destructive',
      });
      return;
    }

    if (!name || !email || !phone || !time) {
      toast({
        title: 'שגיאה',
        description: 'נא למלא את כל השדות הנדרשים.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
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
        setSelectedDate(undefined);
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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Calendar */}
          <div className="bg-law-navy text-white p-6 flex flex-col justify-center items-center md:w-1/2">
            <h3 className="text-xl font-bold mb-4">בחר תאריך ושעה</h3>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm mb-4 w-full">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border bg-white text-black"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            {selectedDate && (
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm w-full">
                <h4 className="font-medium mb-2 text-center">שעות זמינות</h4>
                <Select onValueChange={setTime} value={time}>
                  <SelectTrigger className="w-full bg-white/20 text-white border-white/30">
                    <SelectValue placeholder="בחר שעה" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {availableTimes.length > 0 ? (
                      availableTimes.map((timeSlot) => (
                        <SelectItem key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>אין שעות זמינות</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Right side - Form */}
          <div className="p-6 md:w-1/2">
            <DialogHeader>
              <DialogTitle className="text-2xl">קביעת פגישה</DialogTitle>
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
                  className="border-gray-300"
                />
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
                  className="border-gray-300"
                />
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
                  className="border-gray-300"
                />
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
                  className="border-gray-300 min-h-[100px]"
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-law-navy hover:bg-law-navy/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      שולח...
                    </>
                  ) : 'קבע פגישה'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
