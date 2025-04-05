import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import { addDays, format, startOfDay, isBefore, isToday } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";
import { createAppointment } from '@/services/appointmentService';

type AppointmentModalProps = {
  trigger: React.ReactNode;
};

export function AppointmentModal({ trigger }: AppointmentModalProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeSlot || !name || !phone || !email) {
      toast.error("אנא מלא את כל השדות החובה");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = format(date, 'dd/MM/yyyy');
      
      const result = await createAppointment({
        name,
        email,
        phone,
        date: formattedDate,
        time: timeSlot,
        details: details || null
      });
      
      if (!result.success) throw new Error("Failed to create appointment");
      
      toast.success("פגישה נקבעה בהצלחה! נשלח אליך אישור למייל");
      
      setTimeSlot(null);
      setName("");
      setPhone("");
      setEmail("");
      setDetails("");
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('אירעה שגיאה בקביעת הפגישה, אנא נסה שנית');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSlotBooked = (slot: string) => {
    if (!date) return false;
    const dateKey = format(date, 'yyyy-MM-dd');
    return bookedSlots[dateKey]?.includes(slot) || false;
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isWeekend(date);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday or Saturday
  };

  const formatDateHebrew = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "EEEE, dd בMMMM yyyy", { locale: he });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl appointment-modal">
        <DialogHeader>
          <DialogTitle className="text-3xl mb-2">קביעת פגישת ייעוץ</DialogTitle>
          <DialogDescription className="text-lg">
            בחר תאריך ושעה שנוחים לך, ואנו ניצור איתך קשר לאישור הפגישה.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg">בחר תאריך</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDateDisabled}
                className="rounded-md border p-3 pointer-events-auto"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg">בחר שעה {date && <span className="text-law-gray text-base">({formatDateHebrew(date)})</span>}</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot ${timeSlot === slot ? 'selected' : ''} ${isSlotBooked(slot) ? 'disabled' : ''}`}
                    onClick={() => setTimeSlot(slot)}
                    disabled={isSlotBooked(slot)}
                  >
                    {slot}
                    {timeSlot === slot && <Check className="inline-block mr-1 h-4 w-4" />}
                  </button>
                ))}
              </div>
              <p className="text-sm text-law-gray">השעות המסומנות באפור כבר תפוסות</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">שם מלא *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="שם מלא"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg">טלפון *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-0000000"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">אימייל *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="details" className="text-lg">פרטים נוספים</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="ספר לנו בקצרה על מהות הפנייה"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full md:w-auto"
              type="button"
            >
              ביטול
            </Button>
            <Button 
              type="submit" 
              className="w-full md:w-auto bg-law-navy hover:bg-law-navy/90"
              disabled={isSubmitting || !date || !timeSlot || !name || !phone || !email}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <CalendarIcon className="animate-spin mr-2 h-4 w-4" />
                  מתזמן פגישה...
                </div>
              ) : (
                "אישור פגישה"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
