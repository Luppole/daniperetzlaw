import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Calendar, Loader2, MailOpen, Phone, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { toast } from 'sonner';
import { Appointment } from '@/types/appointments';
import { getAllAppointments, updateAppointmentStatus, deleteAppointment } from '@/services/appointmentService';

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const appointmentsData = await getAllAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('שגיאה בטעינת הפגישות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Set up a polling mechanism to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchAppointments();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const success = await updateAppointmentStatus(id, status);
      
      if (success) {
        setAppointments(prevAppointments => 
          prevAppointments.map(appointment => 
            appointment.id === id ? { ...appointment, status } : appointment
          )
        );
        
        toast.success(`סטטוס הפגישה עודכן ל${
          status === 'confirmed' ? 'מאושר' : 
          status === 'cancelled' ? 'מבוטל' : 'ממתין'
        }`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('שגיאה בעדכון סטטוס הפגישה');
    }
  };

  const handleDelete = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteAppointment(appointmentToDelete.id);
      
      if (success) {
        setAppointments(appointments.filter(appointment => appointment.id !== appointmentToDelete.id));
        toast.success('הפגישה נמחקה בהצלחה');
        setDeleteDialogOpen(false);
      } else {
        throw new Error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('שגיאה במחיקת הפגישה');
    } finally {
      setIsDeleting(false);
      setAppointmentToDelete(null);
    }
  };

  const confirmDelete = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteDialogOpen(true);
  };

  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: he });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}T${timeString}:00`);
    return format(date, 'EEEE, dd בMMMM yyyy בשעה HH:mm', { locale: he });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">מאושר</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">מבוטל</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">ממתין</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-law-navy">ניהול פגישות</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">אין פגישות להצגה</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>תאריך</TableHead>
                <TableHead>שעה</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead className="text-left">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="cursor-pointer hover:bg-gray-50" onClick={() => viewDetails(appointment)}>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell className="font-medium">{appointment.name}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        disabled={appointment.status === 'confirmed'}
                      >
                        אשר
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        disabled={appointment.status === 'cancelled'}
                      >
                        בטל
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDelete(appointment)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="מחק פגישה"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>האם אתה בטוח שברצונך למחוק את הפגישה?</DialogTitle>
            <DialogDescription>
              פעולה זו לא ניתנת לביטול. הפגישה תימחק לצמיתות מהמערכת.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              ביטול
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  מוחק...
                </>
              ) : 'מחק'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>פרטי פגישה</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-law-navy mb-2">
                  <Calendar className="ml-2 h-5 w-5" />
                  <span className="font-medium">זמן הפגישה:</span>
                </div>
                <p>{formatDateTime(selectedAppointment.date, selectedAppointment.time)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-law-navy mb-2">
                    <User className="ml-2 h-5 w-5" />
                    <span className="font-medium">פרטי לקוח:</span>
                  </div>
                  <p className="mb-1">{selectedAppointment.name}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-law-navy mb-2">
                    <Phone className="ml-2 h-5 w-5" />
                    <span className="font-medium">טלפון:</span>
                  </div>
                  <p className="mb-1">{selectedAppointment.phone}</p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center text-law-navy mb-2">
                    <MailOpen className="ml-2 h-5 w-5" />
                    <span className="font-medium">דוא"ל:</span>
                  </div>
                  <p className="mb-1">{selectedAppointment.email}</p>
                </div>
              </div>
              
              {selectedAppointment.details && (
                <div>
                  <div className="text-law-navy font-medium mb-2">פרטים נוספים:</div>
                  <div className="p-3 bg-gray-50 rounded-md">{selectedAppointment.details}</div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  סטטוס: {getStatusBadge(selectedAppointment.status)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, 'confirmed');
                      setDetailsDialogOpen(false);
                    }}
                    disabled={selectedAppointment.status === 'confirmed'}
                  >
                    אשר
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, 'cancelled');
                      setDetailsDialogOpen(false);
                    }}
                    disabled={selectedAppointment.status === 'cancelled'}
                  >
                    בטל
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
