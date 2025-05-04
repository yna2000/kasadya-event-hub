
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: 'Please select a time' }),
  notes: z.string().optional(),
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
  onSubmit?: (data: BookingFormData) => void;
}

const VendorBookingForm = ({ 
  isOpen, 
  onClose, 
  vendor, 
  service = vendor?.category,
  onSubmit 
}: VendorBookingFormProps) => {
  const { user } = useAuth();
  const { isDateAvailable } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      notes: '',
    },
  });

  // Function to check if a date is already booked for this vendor
  const isDateBooked = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return !isDateAvailable(dateStr, vendor.id);
  };

  const handleSubmit = (data: BookingFormData) => {
    setIsSubmitting(true);
    
    // Check if the date is available before proceeding
    const dateStr = format(data.date, 'yyyy-MM-dd');
    const dateAvailable = isDateAvailable(dateStr, vendor.id);
    
    if (!dateAvailable) {
      form.setError('date', { 
        type: 'manual',
        message: 'This date is already booked for this vendor. Please select another date.'
      });
      setIsSubmitting(false);
      return;
    }

    // If we have an onSubmit callback, call it with the form data
    if (onSubmit) {
      onSubmit(data);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium">{vendor.name}</h3>
            <p className="text-sm text-gray-500">{service}</p>
          </div>
        </div>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          Dates already booked for this vendor will appear disabled in the calendar.
        </AlertDescription>
      </Alert>
      
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
                      disabled={(date) => {
                        // Disable past dates
                        if (date < new Date()) return true;
                        // Disable dates that are already booked
                        return isDateBooked(date);
                      }}
                      className="pointer-events-auto"
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
                  <Textarea 
                    placeholder="Any special requirements or notes for the vendor" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <Shield size={16} className="text-kasadya-purple" />
            <span>Your booking information is secure and protected</span>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-kasadya-purple hover:bg-kasadya-deep-purple"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorBookingForm;
