
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Shield, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useNotifications } from '@/contexts/NotificationContext';
import BookingOtpVerification from './BookingOtpVerification';
import { Checkbox } from '@/components/ui/checkbox';
import TermsAndConditionsModal from '@/components/modals/TermsAndConditionsModal';

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: 'Please select a time' }),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface VendorBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: {
    id: string;
    name: string;
    category: string;
    location: string;
    image: string;
  };
  service?: string;
}

const VendorBookingForm = ({ isOpen, onClose, vendor, service = vendor?.category }: VendorBookingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const { addNotification } = useNotifications();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      notes: '',
      agreeToTerms: false,
    },
  });

  const handleSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book this vendor",
        variant: "destructive",
      });
      onClose();
      navigate('/login');
      return;
    }

    // Store booking data and show OTP verification
    setBookingData(data);
    setShowOtpVerification(true);

    // Simulate sending OTP to user's email
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${user.email}`,
    });
  };

  const handleOtpVerified = async () => {
    if (!bookingData || !user) return;

    // In a real app, the amount would be calculated based on the service
    const amount = Math.floor(Math.random() * 500) + 100;

    // Create the booking with all required properties
    const success = await createBooking({
      vendorId: vendor.id,
      vendorName: vendor.name,
      userId: user.id,
      serviceId: vendor.id, // Using vendor.id as a fallback
      serviceName: service,
      serviceDescription: `${service} provided by ${vendor.name}`,
      date: bookingData.date.toISOString(),
      time: bookingData.time,
      amount: amount,
      notes: bookingData.notes || '',
      // Add the missing properties required by the Booking interface
      name: user.name,
      email: user.email,
      roomType: service, // Using service as roomType
      checkInDate: bookingData.date.toISOString().split('T')[0],
      checkOutDate: bookingData.date.toISOString().split('T')[0], // Same as checkInDate for non-hotel services
      totalPrice: amount,
    });

    if (success) {
      // Create a notification for both the customer and vendor
      addNotification({
        userId: user.id,
        title: 'Booking Request Sent',
        message: `Your booking request for ${vendor.name} has been sent. We'll notify you when it's confirmed.`,
        type: 'booking',
      });

      // In a real app, you would have the vendor's user ID
      // This is just a mock implementation
      const mockVendorUserId = vendor.id;
      addNotification({
        userId: mockVendorUserId,
        title: 'New Booking Request',
        message: `You have a new booking request from ${user.name} for ${service} on ${format(bookingData.date, 'PPP')}.`,
        type: 'booking',
      });

      onClose();
      navigate('/dashboard');
    }
  };

  const handleCancelOtp = () => {
    setShowOtpVerification(false);
  };

  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          {!showOtpVerification ? (
            <>
              <DialogHeader>
                <DialogTitle>Book {vendor?.name}</DialogTitle>
                <DialogDescription>
                  Fill out the form below to request a booking for {service}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-50" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Any special requirements or notes for the vendor" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium leading-none">
                            I agree to the{" "}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                openTermsModal();
                              }}
                            >
                              terms and conditions
                            </Button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    <Shield size={16} className="text-kasadya-purple" />
                    <span>Your booking will be secured with OTP verification</span>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
                      Continue
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          ) : (
            <BookingOtpVerification 
              onVerified={handleOtpVerified} 
              onCancel={handleCancelOtp}
              email={user?.email}
            />
          )}
        </DialogContent>
      </Dialog>

      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          form.setValue('agreeToTerms', true);
          setShowTermsModal(false);
        }}
      />
    </>
  );
};

export default VendorBookingForm;
