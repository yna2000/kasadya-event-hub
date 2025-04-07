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
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Search,
  Shield,
  User,
  UserCheck,
  UserX,
  Eye,
  ArrowUpDown,
  CheckCheck,
  XCircle,
  CreditCard
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookings, updateBookingStatus, updatePaymentStatus, verifyUser } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([user]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    let filtered = bookings;
    
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.paymentStatus === paymentFilter);
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, bookings, statusFilter, paymentFilter]);

  useEffect(() => {
    if (user) {
      setFilteredUsers([user].filter((u) =>
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      ));
    }
  }, [userSearchTerm, user]);

  const handleLogout = () => {
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirmed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelled
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCheck className="h-4 w-4 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'unpaid':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4 mr-1" />
            Unpaid
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            <CreditCard className="h-4 w-4 mr-1" />
            Partial
          </Badge>
        );
      case 'paid':
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <DollarSign className="h-4 w-4 mr-1" />
            Paid
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {paymentStatus}
          </Badge>
        );
    }
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    setIsDialogOpen(false);
    toast({
      title: "Booking Status Updated",
      description: `Booking status has been updated to ${newStatus}.`
    });
  };

  const handleUpdatePaymentStatus = (bookingId, newPaymentStatus) => {
    updatePaymentStatus(bookingId, newPaymentStatus);
    setIsDialogOpen(false);
    toast({
      title: "Payment Status Updated",
      description: `Payment status has been updated to ${newPaymentStatus}.`
    });
  };

  const BookingStatsCard = ({ title, count, icon, color }) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-2 rounded-full ${color} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold">{count}</h3>
        </div>
      </CardContent>
    </Card>
  );

    const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await verifyUser(userId, isVerified);
      toast({
        title: "User Verification",
        description: `User ${isVerified ? 'verified' : 'unverified'} successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify user.",
      });
    }
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 mr-1" />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-4 w-4 mr-1" />
          Unverified
        </Badge>
      );
    }
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <Button onClick={handleLogout} className="mb-4">Logout</Button>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" onClick={() => setSelectedTab('overview')}>Overview</TabsTrigger>
            <TabsTrigger value="bookings" onClick={() => setSelectedTab('bookings')}>Bookings</TabsTrigger>
            <TabsTrigger value="users" onClick={() => setSelectedTab('users')}>User Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Overview</CardTitle>
                <CardDescription>Quick summary of all bookings in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <BookingStatsCard 
                    title="Total Bookings" 
                    count={bookings.length} 
                    icon={<Clock className="h-6 w-6 text-white" />} 
                    color="bg-blue-500" 
                  />
                  <BookingStatsCard 
                    title="Pending Approval" 
                    count={bookings.filter(b => b.status === 'pending').length} 
                    icon={<AlertCircle className="h-6 w-6 text-white" />} 
                    color="bg-yellow-500" 
                  />
                  <BookingStatsCard 
                    title="Confirmed" 
                    count={bookings.filter(b => b.status === 'confirmed').length} 
                    icon={<CheckCircle className="h-6 w-6 text-white" />} 
                    color="bg-green-500" 
                  />
                  <BookingStatsCard 
                    title="Completed" 
                    count={bookings.filter(b => b.status === 'completed').length} 
                    icon={<CheckCheck className="h-6 w-6 text-white" />} 
                    color="bg-purple-500" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <BookingStatsCard 
                    title="Unpaid" 
                    count={bookings.filter(b => b.paymentStatus === 'unpaid').length} 
                    icon={<AlertCircle className="h-6 w-6 text-white" />} 
                    color="bg-red-500" 
                  />
                  <BookingStatsCard 
                    title="Partial Payment" 
                    count={bookings.filter(b => b.paymentStatus === 'partial').length} 
                    icon={<CreditCard className="h-6 w-6 text-white" />} 
                    color="bg-amber-500" 
                  />
                  <BookingStatsCard 
                    title="Fully Paid" 
                    count={bookings.filter(b => b.paymentStatus === 'paid').length} 
                    icon={<DollarSign className="h-6 w-6 text-white" />} 
                    color="bg-emerald-500" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>The most recent bookings in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.name || 'Client'}</span>
                            <span className="text-xs text-muted-foreground">{booking.email || ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>{booking.serviceName}</TableCell>
                        <TableCell>{booking.date} {booking.time}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog open={isDialogOpen && selectedBooking?.id === booking.id} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) setSelectedBooking(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {selectedBooking && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Manage Booking</DialogTitle>
                                    <DialogDescription>
                                      Update the status and payment information for this booking
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Service:</p>
                                      <p className="col-span-3">{selectedBooking.serviceName}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Client:</p>
                                      <p className="col-span-3">{selectedBooking.name || 'Client'}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Date/Time:</p>
                                      <p className="col-span-3">{selectedBooking.date} {selectedBooking.time}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Amount:</p>
                                      <p className="col-span-3">₱{selectedBooking.amount?.toLocaleString() || selectedBooking.totalPrice?.toLocaleString()}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Current Status:</p>
                                      <div className="col-span-3">{getStatusBadge(selectedBooking.status)}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Payment Status:</p>
                                      <div className="col-span-3">{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                                    </div>
                                  </div>
                                  <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <div className="flex flex-col w-full gap-2">
                                      <p className="text-sm font-medium mb-1">Update Booking Status:</p>
                                      <div className="flex flex-wrap gap-2">
                                        <Button 
                                          variant="outline" 
                                          className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                          onClick={() => handleUpdateStatus(selectedBooking.id, 'pending')}
                                        >
                                          <Clock className="h-4 w-4 mr-1" />
                                          Pending
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-green-500 text-green-700 hover:bg-green-50"
                                          onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Confirmed
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                          onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                                        >
                                          <CheckCheck className="h-4 w-4 mr-1" />
                                          Completed
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-red-500 text-red-700 hover:bg-red-50"
                                          onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Cancelled
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col w-full gap-2 mt-4">
                                      <p className="text-sm font-medium mb-1">Update Payment Status:</p>
                                      <div className="flex flex-wrap gap-2">
                                        <Button 
                                          variant="outline" 
                                          className="border-red-500 text-red-700 hover:bg-red-50"
                                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id, 'unpaid')}
                                        >
                                          <AlertCircle className="h-4 w-4 mr-1" />
                                          Unpaid
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-amber-500 text-amber-700 hover:bg-amber-50"
                                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id, 'partial')}
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          Partial
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                                          onClick={() => handleUpdatePaymentStatus(selectedBooking.id, 'paid')}
                                        >
                                          <DollarSign className="h-4 w-4 mr-1" />
                                          Paid
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>Manage and view all bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                  <div className="flex items-center w-full md:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    <Input
                      type="search"
                      placeholder="Search by name, email, or service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-auto"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select 
                      className="border rounded-md px-3 py-2 text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select 
                      className="border rounded-md px-3 py-2 text-sm"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <option value="all">All Payments</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Amount
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{booking.name || 'Client'}</span>
                            <span className="text-xs text-muted-foreground">{booking.email || ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{booking.serviceName}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {booking.serviceDescription?.substring(0, 50)}{booking.serviceDescription?.length > 50 ? '...' : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{booking.date}</span>
                            <span className="text-xs text-muted-foreground">{booking.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {booking.amount?.toLocaleString() || booking.totalPrice?.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {booking && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Manage Booking</DialogTitle>
                                    <DialogDescription>
                                      Update the status and payment information for this booking
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Service:</p>
                                      <p className="col-span-3">{booking.serviceName}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Client:</p>
                                      <p className="col-span-3">{booking.name || 'Client'}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Date/Time:</p>
                                      <p className="col-span-3">{booking.date} {booking.time}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Amount:</p>
                                      <p className="col-span-3">₱{booking.amount?.toLocaleString() || booking.totalPrice?.toLocaleString()}</p>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Current Status:</p>
                                      <div className="col-span-3">{getStatusBadge(booking.status)}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <p className="font-medium">Payment Status:</p>
                                      <div className="col-span-3">{getPaymentBadge(booking.paymentStatus)}</div>
                                    </div>
                                    {booking.notes && (
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <p className="font-medium">Notes:</p>
                                        <p className="col-span-3">{booking.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter className="flex-col sm:flex-row gap-2">
                                    <div className="flex flex-col w-full gap-2">
                                      <p className="text-sm font-medium mb-1">Update Booking Status:</p>
                                      <div className="flex flex-wrap gap-2">
                                        <Button 
                                          variant="outline" 
                                          className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                          onClick={() => handleUpdateStatus(booking.id, 'pending')}
                                        >
                                          <Clock className="h-4 w-4 mr-1" />
                                          Pending
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-green-500 text-green-700 hover:bg-green-50"
                                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Confirmed
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                        >
                                          <CheckCheck className="h-4 w-4 mr-1" />
                                          Completed
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-red-500 text-red-700 hover:bg-red-50"
                                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Cancelled
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col w-full gap-2 mt-4">
                                      <p className="text-sm font-medium mb-1">Update Payment Status:</p>
                                      <div className="flex flex-wrap gap-2">
                                        <Button 
                                          variant="outline" 
                                          className="border-red-500 text-red-700 hover:bg-red-50"
                                          onClick={() => handleUpdatePaymentStatus(booking.id, 'unpaid')}
                                        >
                                          <AlertCircle className="h-4 w-4 mr-1" />
                                          Unpaid
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-amber-500 text-amber-700 hover:bg-amber-50"
                                          onClick={() => handleUpdatePaymentStatus(booking.id, 'partial')}
                                        >
                                          <CreditCard className="h-4 w-4 mr-1" />
                                          Partial
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                                          onClick={() => handleUpdatePaymentStatus(booking.id, 'paid')}
                                        >
                                          <DollarSign className="h-4 w-4 mr-1" />
                                          Paid
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>User Verification</CardTitle>
                <CardDescription>Verify user identities to enhance booking security.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Verification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Shield className="h-4 w-4 mr-1" />
                            {user.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.createdAt), 'PP')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!user.isVerified ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => handleVerifyUser(user.id, true)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleVerifyUser(user.id, false)}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
