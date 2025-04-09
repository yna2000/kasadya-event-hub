import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { toast } from '@/hooks/use-toast';
import { format, parseISO, isValid } from 'date-fns';

export interface Booking {
  id: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: 'gcash' | 'maya' | 'bank' | 'cash';
  notes: string;
  createdAt: string;
  // Properties needed by AdminDashboard
  name: string;
  email: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

interface BookingContextType {
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>) => Promise<Booking>;
  getUserBookings: (userId: string) => Booking[];
  getVendorBookings: (vendorId: string) => Booking[];
  getBookedDates: () => Date[];
  getBookingsByDate: (dateStr: string) => Booking[];
  isDateAvailable: (dateStr: string, vendorId?: string) => boolean;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  updatePaymentStatus: (bookingId: string, paymentStatus: Booking['paymentStatus']) => void;
  cancelBooking: (bookingId: string) => void;
  processPayment: (bookingId: string, amount: number, paymentMethod: Booking['paymentMethod']) => Promise<boolean>;
  fetchBookings: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Load bookings from local storage on startup
  useEffect(() => {
    fetchBookings();
  }, []);

  // Save bookings to local storage when they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  const fetchBookings = () => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  };

  const getBookedDates = () => {
    // Convert booking dates to Date objects
    return bookings
      .filter(booking => booking.status !== 'cancelled') // Don't include cancelled bookings
      .map(booking => {
        try {
          if (!booking.date) return null;
          const dateObj = parseISO(booking.date);
          return isValid(dateObj) ? dateObj : null;
        } catch (error) {
          console.error('Invalid date format:', booking.date);
          return null;
        }
      })
      .filter(date => date !== null) as Date[];
  };

  const getBookingsByDate = (dateStr: string) => {
    return bookings.filter(booking => {
      // Handle both ISO strings and simple date formats
      try {
        return booking.date === dateStr || 
               (booking.date && format(parseISO(booking.date), 'yyyy-MM-dd') === dateStr);
      } catch (error) {
        console.error('Date comparison error:', error);
        return false;
      }
    });
  };

  const isDateAvailable = (dateStr: string, vendorId?: string) => {
    const bookingsOnDate = getBookingsByDate(dateStr);
    if (vendorId) {
      // Check if this vendor has any non-cancelled bookings on this date
      return !bookingsOnDate.some(
        booking => booking.vendorId === vendorId && booking.status !== 'cancelled'
      );
    }
    // If no vendor specified, check if there are any bookings on this date
    return bookingsOnDate.length === 0;
  };

  const processPayment = async (
    bookingId: string, 
    amount: number, 
    paymentMethod: Booking['paymentMethod'] = 'cash'
  ): Promise<boolean> => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return false;

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Determine the new payment status
      let newPaymentStatus: Booking['paymentStatus'] = 'unpaid';
      if (amount >= booking.amount) {
        newPaymentStatus = 'paid';
      } else if (amount > 0) {
        newPaymentStatus = 'partial';
      }

      // Update the booking
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, paymentStatus: newPaymentStatus, paymentMethod } : b
        )
      );

      // Create notification about the payment
      addNotification({
        userId: booking.userId,
        title: 'Payment Successful',
        message: `Your payment of ₱${amount.toLocaleString()} for ${booking.serviceName} with ${booking.vendorName} has been processed via ${paymentMethod}.`,
        type: 'payment'
      });

      toast({
        title: 'Payment Successful',
        description: `Your payment of ₱${amount.toLocaleString()} has been processed via ${paymentMethod}.`,
      });

      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was a problem processing your payment. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'paymentStatus' | 'createdAt'>): Promise<Booking> => {
    // Check if date is available first
    const isAvailable = isDateAvailable(bookingData.date, bookingData.vendorId);
    if (!isAvailable) {
      toast({
        title: 'Booking Failed',
        description: 'This date is already booked for this vendor. Please select another date.',
        variant: 'destructive',
      });
      throw new Error('Date unavailable');
    }

    // Create a new booking
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    // Add the booking to the list
    setBookings(prev => [...prev, newBooking]);

    // Create notification for the user
    addNotification({
      userId: newBooking.userId,
      title: 'Booking Received',
      message: `Your booking with ${newBooking.vendorName} for ${newBooking.serviceName} has been received and is pending confirmation.`,
      type: 'booking'
    });

    toast({
      title: 'Booking Created',
      description: 'Your booking has been successfully created and is pending confirmation.',
    });

    return newBooking;
  };

  const getUserBookings = (userId: string) => {
    return bookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getVendorBookings = (vendorId: string) => {
    return bookings
      .filter(booking => booking.vendorId === vendorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status } : b
      )
    );

    // Create notification about the status change
    addNotification({
      userId: booking.userId,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking for ${booking.serviceName} with ${booking.vendorName} has been ${status}.`,
      type: 'booking'
    });

    toast({
      title: 'Booking Updated',
      description: `Booking status has been updated to ${status}.`,
    });
  };

  const updatePaymentStatus = (bookingId: string, paymentStatus: Booking['paymentStatus']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, paymentStatus } : b
      )
    );

    // Create notification about the payment status
    addNotification({
      userId: booking.userId,
      title: 'Payment Status Updated',
      message: `Payment status for your booking with ${booking.vendorName} has been updated to ${paymentStatus}.`,
      type: 'payment'
    });

    toast({
      title: 'Payment Status Updated',
      description: `Payment status has been updated to ${paymentStatus}.`,
    });
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
    );

    // Create notification about cancellation
    addNotification({
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.serviceName} with ${booking.vendorName} has been cancelled.`,
      type: 'booking'
    });

    toast({
      title: 'Booking Cancelled',
      description: 'Your booking has been cancelled.',
      variant: 'destructive',
    });
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      createBooking,
      getUserBookings,
      getVendorBookings,
      getBookedDates,
      getBookingsByDate,
      isDateAvailable,
      updateBookingStatus,
      updatePaymentStatus,
      cancelBooking,
      processPayment,
      fetchBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};
