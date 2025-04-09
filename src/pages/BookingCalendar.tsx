
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, CalendarMinus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BookingCalendar = () => {
  const { bookings, getBookedDates, getBookingsByDate } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [dateBookings, setDateBookings] = useState<any[]>([]);

  // Load booked dates when component mounts
  useEffect(() => {
    if (bookings.length > 0) {
      const dates = getBookedDates();
      setBookedDates(dates);
    }
  }, [bookings, getBookedDates]);

  // Update bookings for selected date when date changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const bookingsForDate = getBookingsByDate(dateStr);
      setDateBookings(bookingsForDate);
    }
  }, [selectedDate, getBookingsByDate]);

  // Function to determine if a date is booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      bookedDate => format(bookedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Render functions for calendar UI
  const renderDay = (day: Date) => {
    const isBooked = isDateBooked(day);
    
    return (
      <div className={`relative ${isBooked ? 'text-white' : ''}`}>
        {day.getDate()}
        {isBooked && (
          <div className="absolute inset-0 bg-red-500 opacity-50 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select a Date</CardTitle>
            <CardDescription>Red dates are already booked</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md"
              components={{
                DayContent: ({ date }) => renderDay(date),
              }}
              modifiers={{
                booked: bookedDates,
              }}
              modifiersStyles={{
                booked: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
              }}
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 opacity-50 rounded-full"></div>
              <span className="text-sm">Booked Date</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Bookings for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
            </CardTitle>
            <CardDescription>
              {dateBookings.length === 0 
                ? 'No bookings for this date' 
                : `${dateBookings.length} booking(s) scheduled`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dateBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6">
                <CalendarCheck className="h-12 w-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">This date is available for booking!</p>
                {user && (
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/vendors')}
                  >
                    Book for this date
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {dateBookings.map((booking, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.vendorName}
                        </p>
                        <p className="text-sm">
                          Time: {booking.time || 'Not specified'}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'secondary' : 
                          booking.status === 'pending' ? 'outline' : 
                          booking.status === 'cancelled' ? 'destructive' : 
                          'default'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">This date has bookings</h3>
                      <p className="text-sm text-amber-700">
                        The date already has scheduled bookings. You may still be able to book 
                        depending on availability and time slots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;
