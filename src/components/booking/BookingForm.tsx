
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface BookingFormProps {
  vendorId: string;
  vendorName: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  amount: number;
  onSuccess?: () => void;
}

const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, { message: "Please select a time" }),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm: React.FC<BookingFormProps> = ({
  vendorId,
  vendorName,
  serviceId,
  serviceName,
  serviceDescription,
  amount,
  onSuccess,
}) => {
  const { createBooking } = useBooking();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      notes: '',
    }
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book this service',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        userId: user.id,
        vendorId,
        vendorName,
        serviceId,
        serviceName,
        serviceDescription,
        date: data.date.toISOString().split('T')[0],
        time: data.time,
        amount,
        notes: data.notes || '',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: 'There was a problem creating your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slot options
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    const hourFormat = hour > 12 ? (hour - 12) : hour;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hourFormat}:00 ${amPm}`);
    if (hour < 18) {
      timeSlots.push(`${hourFormat}:30 ${amPm}`);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">Book This Service</h2>
      <div className="mb-6">
        <p className="font-medium">{serviceName}</p>
        <p className="text-sm text-gray-600 mb-2">{serviceDescription}</p>
        <p className="text-lg font-semibold text-kasadya-purple">₱{amount.toLocaleString()}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
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
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
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
                <FormLabel>Preferred Time</FormLabel>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  defaultValue=""
                >
                  <option value="" disabled>Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests or Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any special requirements or questions here..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-kasadya-purple hover:bg-kasadya-deep-purple"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            By booking this service, you agree to our Terms and Conditions.
          </p>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
