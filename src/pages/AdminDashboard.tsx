
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Clock, DollarSign, Filter, Search } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, updateBookingStatus, updatePaymentStatus } = useBooking();
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  
  useEffect(() => {
    // Check if user is admin, if not redirect
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!user.isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    let result = [...bookings];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.vendorName.toLowerCase().includes(term) ||
        booking.serviceName.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term)
      );
    }
    
    // Apply booking status filter
    if (filterStatus !== 'all') {
      result = result.filter(booking => booking.status === filterStatus);
    }
    
    // Apply payment status filter
    if (filterPaymentStatus !== 'all') {
      result = result.filter(booking => booking.paymentStatus === filterPaymentStatus);
    }
    
    setFilteredBookings(result);
  }, [bookings, searchTerm, filterStatus, filterPaymentStatus]);

  const handleBookingStatusChange = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    updateBookingStatus(bookingId, newStatus);
  };

  const handlePaymentStatusChange = (bookingId: string, newStatus: 'unpaid' | 'partial' | 'paid') => {
    updatePaymentStatus(bookingId, newStatus);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="border-red-500 text-red-500">Unpaid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Partial</Badge>;
      case 'paid':
        return <Badge variant="outline" className="border-green-500 text-green-500">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <section className="bg-gray-100 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-gray-600">
                Manage bookings, payments, and user accounts
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-3xl mx-auto mb-8">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-kasadya-purple data-[state=active]:text-white">
              All Bookings
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-kasadya-purple data-[state=active]:text-white">
              Payment Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="max-w-full mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Booking Management</CardTitle>
                <CardDescription>
                  View and manage all bookings across the platform
                </CardDescription>
                
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 rounded-md border border-input bg-background"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                    
                    <select
                      className="px-3 py-2 rounded-md border border-input bg-background"
                      value={filterPaymentStatus}
                      onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    >
                      <option value="all">All Payments</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id.substring(0, 8)}...</TableCell>
                            <TableCell>{booking.userId.substring(0, 8)}...</TableCell>
                            <TableCell>
                              <div className="font-medium">{booking.serviceName}</div>
                              <div className="text-sm text-muted-foreground">{booking.vendorName}</div>
                            </TableCell>
                            <TableCell>
                              <div>{format(new Date(booking.date), 'PP')}</div>
                              <div className="text-sm text-muted-foreground">{booking.time}</div>
                            </TableCell>
                            <TableCell>₱{booking.amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <select
                                  className="px-2 py-1 text-xs rounded border"
                                  value={booking.status}
                                  onChange={(e) => handleBookingStatusChange(
                                    booking.id, 
                                    e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed'
                                  )}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirm</option>
                                  <option value="cancelled">Cancel</option>
                                  <option value="completed">Complete</option>
                                </select>
                                
                                <select
                                  className="px-2 py-1 text-xs rounded border"
                                  value={booking.paymentStatus}
                                  onChange={(e) => handlePaymentStatusChange(
                                    booking.id,
                                    e.target.value as 'unpaid' | 'partial' | 'paid'
                                  )}
                                >
                                  <option value="unpaid">Unpaid</option>
                                  <option value="partial">Partial</option>
                                  <option value="paid">Paid</option>
                                </select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="max-w-full mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Payment Overview</CardTitle>
                <CardDescription>
                  Track payment status across all bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Bookings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{bookings.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Unpaid
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-baseline">
                      <div className="text-2xl font-bold text-red-500">
                        {bookings.filter(b => b.paymentStatus === 'unpaid').length}
                      </div>
                      <div className="ml-2 text-sm text-muted-foreground">
                        ({((bookings.filter(b => b.paymentStatus === 'unpaid').length / bookings.length) * 100).toFixed(0)}%)
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Partially Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-baseline">
                      <div className="text-2xl font-bold text-yellow-500">
                        {bookings.filter(b => b.paymentStatus === 'partial').length}
                      </div>
                      <div className="ml-2 text-sm text-muted-foreground">
                        ({((bookings.filter(b => b.paymentStatus === 'partial').length / bookings.length) * 100).toFixed(0)}%)
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Fully Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-baseline">
                      <div className="text-2xl font-bold text-green-500">
                        {bookings.filter(b => b.paymentStatus === 'paid').length}
                      </div>
                      <div className="ml-2 text-sm text-muted-foreground">
                        ({((bookings.filter(b => b.paymentStatus === 'paid').length / bookings.length) * 100).toFixed(0)}%)
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableCaption>Recent Payment Activity</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Booking Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No payment data found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.slice(0, 10).map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id.substring(0, 8)}...</TableCell>
                            <TableCell>{booking.userId.substring(0, 8)}...</TableCell>
                            <TableCell>
                              {booking.serviceName} ({booking.vendorName})
                            </TableCell>
                            <TableCell>₱{booking.amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              <select
                                className="px-2 py-1 text-xs rounded border"
                                value={booking.paymentStatus}
                                onChange={(e) => handlePaymentStatusChange(
                                  booking.id,
                                  e.target.value as 'unpaid' | 'partial' | 'paid'
                                )}
                              >
                                <option value="unpaid">Unpaid</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                              </select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
