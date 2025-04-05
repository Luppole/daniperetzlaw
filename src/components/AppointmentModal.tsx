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
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast";
import { createAppointment, getBookedSlots } from '@/services/appointmentService';
import { Loader2 } from 'lucide-react';

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
        title: 'Error',
        description: 'Please select a date.',
        variant: 'destructive',
      });
      return;
    }

    if (!name || !email || !phone || !time) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
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
          title: 'Success',
          description: 'Appointment created successfully!',
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
          title: 'Error',
          description: 'Failed to create appointment. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Appointment creation error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>קביעת פגישה</DialogTitle>
          <DialogDescription>
            מלא את הפרטים שלך כדי לקבוע פגישה.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">שם</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">אימייל</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">טלפון</Label>
            <Input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="date" className="text-right">תאריך</Label>
            <Calendar
              id="date"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="col-span-3 rounded-md border"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">שעה</Label>
            <Select onValueChange={setTime}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="בחר שעה" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">פרטים נוספים</Label>
            <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  שולח...
                </>
              ) : 'קבע פגישה'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
