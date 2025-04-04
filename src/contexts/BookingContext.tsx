
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  vendorId: string;
  vendorName: string;
  customerId: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  createdAt: string;
  paymentId?: string;
}

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  createBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingsByVendor: (vendorId: string) => Booking[];
  processPayment: (bookingId: string, paymentMethod: string) => Promise<boolean>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load bookings from local storage on startup
  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // Save bookings to local storage when they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Math.random().toString(36).substring(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setBookings(prev => [...prev, newBooking]);
      toast({
        title: "Booking created",
        description: "Your booking request has been sent to the vendor.",
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Booking creation error:', error);
      toast({
        title: "Booking failed",
        description: "An error occurred while creating your booking",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      );

      toast({
        title: "Booking updated",
        description: `Booking status changed to ${status}`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Booking update error:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the booking",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(booking => booking.customerId === userId);
  };

  const getBookingsByVendor = (vendorId: string) => {
    return bookings.filter(booking => booking.vendorId === vendorId);
  };

  const processPayment = async (bookingId: string, paymentMethod: string) => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentId = `payment-${Math.random().toString(36).substring(2, 9)}`;
      
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId 
            ? { 
                ...booking, 
                status: 'paid', 
                paymentId 
              } 
            : booking
        )
      );

      toast({
        title: "Payment successful",
        description: `Your payment for booking #${bookingId.substring(0, 8)} was processed successfully`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment failed",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      isLoading,
      createBooking,
      updateBookingStatus,
      getBookingsByUser,
      getBookingsByVendor,
      processPayment
    }}>
      {children}
    </BookingContext.Provider>
  );
};
