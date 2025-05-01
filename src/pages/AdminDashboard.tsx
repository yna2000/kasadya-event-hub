import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
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
import { useToast } from '@/hooks/use-toast';
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
  CreditCard,
  Wallet,
  Building,
  Package,
  ShieldCheck,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, fetchBookings } = useBooking();  // Added fetchBookings
  const [localBookings, setLocalBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteBookingDialogOpen, setIsDeleteBookingDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [adminComment, setAdminComment] = useState('');

  // Helper function to safely format dates
  const safeFormatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    // Load bookings
    fetchBookings();
    
    // Set local bookings state from context
    setLocalBookings(bookings);

    // Load users
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }

    // Load services
    try {
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  }, [fetchBookings]);

  // Update local bookings when context bookings change
  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleLogout = () => {
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Unpaid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Partial</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    try {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const allBookings = JSON.parse(storedBookings);
        const updatedBookings = allBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        );
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setLocalBookings(updatedBookings);
        
        // Update selected booking if it's open
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
        
        toast({
          title: "Status Updated",
          description: `Booking status has been updated to ${newStatus}.`,
        });
        
        // Refresh bookings from context
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = (bookingId) => {
    setBookingToDelete(bookingId);
    setIsDeleteBookingDialogOpen(true);
  };

  // Confirm delete a booking
  const confirmDeleteBooking = () => {
    try {
      if (!bookingToDelete) return;
      
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const allBookings = JSON.parse(storedBookings);
        const updatedBookings = allBookings.filter(
          (booking) => booking.id !== bookingToDelete
        );
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setLocalBookings(updatedBookings);
        
        toast({
          title: "Booking Deleted",
          description: "The booking has been successfully deleted.",
        });
        
        // Refresh bookings from context
        fetchBookings();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete the booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteBookingDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const handleUpdatePaymentStatus = (bookingId, newPaymentStatus) => {
    try {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const allBookings = JSON.parse(storedBookings);
        const updatedBookings = allBookings.map(booking => 
          booking.id === bookingId ? { ...booking, paymentStatus: newPaymentStatus } : booking
        );
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setLocalBookings(updatedBookings);
        
        // Update selected booking if it's open
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, paymentStatus: newPaymentStatus });
        }
        
        toast({
          title: "Payment Status Updated",
          description: `Payment status has been updated to ${newPaymentStatus}.`,
        });
        
        // Refresh bookings from context
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status.",
        variant: "destructive",
      });
    }
  };

  // Function to approve a service post
  const handleApproveService = (serviceId) => {
    try {
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices) {
        const allServices = JSON.parse(storedServices);
        const updatedServices = allServices.map(service => 
          service.id === serviceId 
            ? { 
                ...service, 
                isApproved: true,
                adminComments: adminComment || 'Approved by admin'
              } 
            : service
        );
        
        localStorage.setItem('vendorServices', JSON.stringify(updatedServices));
        setServices(updatedServices);
        
        toast({
          title: "Service Approved",
          description: "The service has been approved and is now visible to clients.",
        });
        
        setIsServiceDialogOpen(false);
        setSelectedService(null);
        setAdminComment('');
      }
    } catch (error) {
      console.error('Error approving service:', error);
      toast({
        title: "Error",
        description: "Failed to approve the service.",
        variant: "destructive",
      });
    }
  };

  // Function to reject a service post
  const handleRejectService = (serviceId) => {
    try {
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices) {
        const allServices = JSON.parse(storedServices);
        const updatedServices = allServices.map(service => 
          service.id === serviceId 
            ? { 
                ...service, 
                isApproved: false,
                adminComments: adminComment || 'Rejected by admin'
              } 
            : service
        );
        
        localStorage.setItem('vendorServices', JSON.stringify(updatedServices));
        setServices(updatedServices);
        
        toast({
          title: "Service Rejected",
          description: "The service has been rejected and will not be visible to clients.",
        });
        
        setIsServiceDialogOpen(false);
        setSelectedService(null);
        setAdminComment('');
      }
    } catch (error) {
      console.error('Error rejecting service:', error);
      toast({
        title: "Error",
        description: "Failed to reject the service.",
        variant: "destructive",
      });
    }
  };

  const BookingStatsCard = ({ title, count, icon, color }) => (
    <div className={`${color} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium mb-1">{title}</p>
          <h3 className="text-white text-2xl font-bold">{count}</h3>
        </div>
        <div className="rounded-full bg-white/20 p-2">
          {icon}
        </div>
      </div>
    </div>
  );

  const handleVerifyUser = async (userId, isVerified) => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const allUsers = JSON.parse(storedUsers);
        const updatedUsers = allUsers.map(user => 
          user.id === userId ? { ...user, isVerified } : user
        );
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        
        toast({
          title: isVerified ? "User Verified" : "User Unverified",
          description: isVerified 
            ? "The user has been verified successfully." 
            : "The user has been marked as unverified.",
        });
        
        setIsUserDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating user verification:', error);
      toast({
        title: "Error",
        description: "Failed to update user verification status.",
        variant: "destructive",
      });
    }
  };

  const getVerificationBadge = (isVerified) => {
    return isVerified 
      ? <Badge className="bg-green-100 text-green-800 border-green-300">Verified</Badge>
      : <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Unverified</Badge>;
  };

  const getIdTypeBadge = (idType) => {
    switch (idType) {
      case 'passport':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Passport</Badge>;
      case 'drivers_license':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Driver's License</Badge>;
      case 'national_id':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">National ID</Badge>;
      case 'business_permit':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Business Permit</Badge>;
      default:
        return <Badge variant="outline">{idType}</Badge>;
    }
  };

  const getPaymentMethodBadge = (paymentMethod) => {
    if (!paymentMethod) return null;
    
    switch (paymentMethod.toLowerCase()) {
      case 'credit_card':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <CreditCard className="h-3 w-3 mr-1" />
            Credit Card
          </Badge>
        );
      case 'cash':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Wallet className="h-3 w-3 mr-1" />
            Cash
          </Badge>
        );
      case 'bank_transfer':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            <Building className="h-3 w-3 mr-1" />
            Bank Transfer
          </Badge>
        );
      default:
        return <Badge variant="outline">{paymentMethod}</Badge>;
    }
  };

  // Filter bookings based on search term and filters
  const filteredBookings = localBookings.filter(booking => {
    const matchesSearch = 
      (booking.name && booking.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.email && booking.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.serviceName && booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    return (
      (user.name && user.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.phone && user.phone.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );
  });

  // Filter services based on search term
  const filteredServices = services.filter(service => {
    return (
      (service.name && service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())) ||
      (service.description && service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase())) ||
      (service.vendorName && service.vendorName.toLowerCase().includes(serviceSearchTerm.toLowerCase()))
    );
  });

  // Implement the confirmDeleteService function
  const confirmDeleteService = () => {
    try {
      if (!serviceToDelete) return;
      
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices) {
        const allServices = JSON.parse(storedServices);
        const updatedServices = allServices.filter(
          (service: any) => service.id !== serviceToDelete
        );
        
        localStorage.setItem('vendorServices', JSON.stringify(updatedServices));
        
        // Update UI state
        setServices(services.filter(service => service.id !== serviceToDelete));
        
        toast({
          title: "Service Deleted",
          description: "The service has been successfully deleted.",
        });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete the service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // Function to open the delete dialog
  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Button onClick={handleLogout} className="mb-4">Logout</Button>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" onClick={() => setSelectedTab('overview')}>Overview</TabsTrigger>
          <TabsTrigger value="bookings" onClick={() => setSelectedTab('bookings')}>Bookings</TabsTrigger>
          <TabsTrigger value="users" onClick={() => setSelectedTab('users')}>User Verification</TabsTrigger>
          <TabsTrigger value="services" onClick={() => setSelectedTab('services')}>Service Verification</TabsTrigger>
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
                  count={localBookings.length} 
                  icon={<Clock className="h-6 w-6 text-white" />} 
                  color="bg-blue-500" 
                />
                <BookingStatsCard 
                  title="Pending Approval" 
                  count={localBookings.filter(b => b.status === 'pending').length} 
                  icon={<AlertCircle className="h-6 w-6 text-white" />} 
                  color="bg-yellow-500" 
                />
                <BookingStatsCard 
                  title="Confirmed" 
                  count={localBookings.filter(b => b.status === 'confirmed').length} 
                  icon={<CheckCircle className="h-6 w-6 text-white" />} 
                  color="bg-green-500" 
                />
                <BookingStatsCard 
                  title="Completed" 
                  count={localBookings.filter(b => b.status === 'completed').length} 
                  icon={<CheckCheck className="h-6 w-6 text-white" />} 
                  color="bg-purple-500" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BookingStatsCard 
                  title="Unpaid" 
                  count={localBookings.filter(b => b.paymentStatus === 'unpaid').length} 
                  icon={<AlertCircle className="h-6 w-6 text-white" />} 
                  color="bg-red-500" 
                />
                <BookingStatsCard 
                  title="Partial Payment" 
                  count={localBookings.filter(b => b.paymentStatus === 'partial').length} 
                  icon={<CreditCard className="h-6 w-6 text-white" />} 
                  color="bg-amber-500" 
                />
                <BookingStatsCard 
                  title="Fully Paid" 
                  count={localBookings.filter(b => b.paymentStatus === 'paid').length} 
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
                  {localBookings.slice(0, 5).map((booking) => (
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
                                  
                                  <div className="flex flex-col w-full gap-2 mt-4">
                                    <p className="text-sm font-medium mb-1">Other Actions:</p>
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => {
                                        setIsDialogOpen(false);
                                        handleDeleteBooking(selectedBooking.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Delete Booking
                                    </Button>
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
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
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
                          <div className="flex flex-
