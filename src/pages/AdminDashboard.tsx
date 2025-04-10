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
  const [bookings, setBookings] = useState([]);
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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
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
    try {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }

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
  }, []);

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
        setBookings(updatedBookings);
        
        // Update selected booking if it's open
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
        
        toast({
          title: "Status Updated",
          description: `Booking status has been updated to ${newStatus}.`,
        });
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

  const handleUpdatePaymentStatus = (bookingId, newPaymentStatus) => {
    try {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const allBookings = JSON.parse(storedBookings);
        const updatedBookings = allBookings.map(booking => 
          booking.id === bookingId ? { ...booking, paymentStatus: newPaymentStatus } : booking
        );
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        
        // Update selected booking if it's open
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, paymentStatus: newPaymentStatus });
        }
        
        toast({
          title: "Payment Status Updated",
          description: `Payment status has been updated to ${newPaymentStatus}.`,
        });
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
  const filteredBookings = bookings.filter(booking => {
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
                    <TableHead>Method</TableHead>
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
                      <TableCell>{getPaymentMethodBadge(booking.paymentMethod)}</TableCell>
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
          <Card>
            <CardHeader>
              <CardTitle>User Verification</CardTitle>
              <CardDescription>Verify users and manage user accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead>ID Type</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.phone || 'No phone'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.isVendor ? "default" : "secondary"}>
                          {user.isVendor ? 'Vendor' : 'Client'}
                        </Badge>
                        {user.isVendor && user.businessType && (
                          <Badge variant="outline" className="ml-2 capitalize">
                            {user.businessType}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.idType ? getIdTypeBadge(user.idType) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getVerificationBadge(user.isVerified)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {selectedUser && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>User Verification</DialogTitle>
                                  <DialogDescription>
                                    Review user details and verify account
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">Name:</p>
                                    <p className="col-span-3">{selectedUser.name}</p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">Email:</p>
                                    <p className="col-span-3">{selectedUser.email}</p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">Phone:</p>
                                    <p className="col-span-3">{selectedUser.phone || 'No phone provided'}</p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">Account Type:</p>
                                    <p className="col-span-3">
                                      {selectedUser.isVendor ? 'Vendor' : 'Client'}
                                      {selectedUser.isVendor && selectedUser.businessType && (
                                        <Badge variant="outline" className="ml-2 capitalize">
                                          {selectedUser.businessType}
                                        </Badge>
                                      )}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">ID Type:</p>
                                    <p className="col-span-3">{selectedUser.idType || 'No ID type'}</p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">ID Number:</p>
                                    <p className="col-span-3">{selectedUser.idNumber || 'No ID number'}</p>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="font-medium">Status:</p>
                                    <div className="col-span-3">{getVerificationBadge(selectedUser.isVerified)}</div>
                                  </div>
                                </div>
                                <DialogFooter className="flex-col sm:flex-row gap-2">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleVerifyUser(selectedUser.id, false)}
                                  >
                                    <UserX className="h-4 w-4 mr-1" />
                                    Mark as Unverified
                                  </Button>
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleVerifyUser(selectedUser.id, true)}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Verify User
                                  </Button>
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

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Verification</CardTitle>
              <CardDescription>Review and approve vendor service submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  value={serviceSearchTerm}
                  onChange={(e) => setServiceSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No pending service submissions</h3>
                  <p className="text-muted-foreground">
                    All vendor service submissions have been reviewed
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {service.images && service.images.length > 0 ? (
                              <img 
                                src={service.images[0]} 
                                alt={service.name} 
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {service.description.substring(0, 50)}
                                {service.description.length > 50 ? '...' : ''}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{service.vendorName || 'Unknown Vendor'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {service.businessType || 'Not specified'}
                          </Badge>
                        </TableCell>
                        <TableCell>₱{service.price.toLocaleString()}</TableCell>
                        <TableCell>{safeFormatDate(service.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog open={isServiceDialogOpen && selectedService?.id === service.id} onOpenChange={(open) => {
                            setIsServiceDialogOpen(open);
                            if (!open) {
                              setSelectedService(null);
                              setAdminComment('');
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsServiceDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              {selectedService && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Review Service Submission</DialogTitle>
                                    <DialogDescription>
                                      Review the service details and approve or reject the submission
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                    <div>
                                      <h3 className="font-semibold mb-2">Service Details</h3>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Name</p>
                                          <p>{selectedService.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Category</p>
                                          <Badge variant="outline" className="capitalize">
                                            {selectedService.category}
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                                          <p className="text-sm">{selectedService.description}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Price</p>
                                          <p>₱{selectedService.price.toLocaleString()}</p>
                                        </div>
                                      </div>
                                      
                                      <h3 className="font-semibold mt-6 mb-2">Vendor Information</h3>
                                      <div className="space-y-3">
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Vendor Name</p>
                                          <p>{selectedService.vendorName || 'Unknown'}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                                          <Badge variant="outline" className="capitalize">
                                            {selectedService.businessType || 'Not specified'}
                                          </Badge>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                                          <p>{safeFormatDate(selectedService.createdAt)}</p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-semibold mb-2">Service Images</h3>
                                      <div className="grid grid-cols-2 gap-2">
                                        {selectedService.images && selectedService.images.length > 0 ? (
                                          selectedService.images.map((image, index) => (
                                            <img 
                                              key={index}
                                              src={image}
                                              alt={`Service image ${index + 1}`}
                                              className="rounded-md w-full h-32 object-cover"
                                            />
                                          ))
                                        ) : (
                                          <div className="rounded-md bg-gray-100 h-32 flex items-center justify-center">
                                            <p className="text-gray-500">No images provided</p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="mt-6">
                                        <h3 className="font-semibold mb-2">Admin Comment</h3>
                                        <Textarea
                                          placeholder="Add notes or feedback about this service (optional)"
                                          value={adminComment}
                                          onChange={(e) => setAdminComment(e.target.value)}
                                          className="w-full"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleRejectService(selectedService.id)}
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-1" />
                                      Reject Service
                                    </Button>
                                    <Button 
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => handleApproveService(selectedService.id)}
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      Approve Service
                                    </Button>
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteService}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
