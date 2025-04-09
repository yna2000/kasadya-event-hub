
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Edit, 
  Plus, 
  Trash2, 
  Info, 
  Package, 
  Calendar, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ServiceUploadForm from '@/components/vendor/ServiceUploadForm';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user && !user.isVendor) {
      toast({
        title: "Access Denied",
        description: "You need a vendor account to access this page.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    // Load vendor services
    const loadVendorServices = () => {
      if (user?.id) {
        try {
          const storedServices = localStorage.getItem('vendorServices');
          if (storedServices) {
            const allServices = JSON.parse(storedServices);
            const vendorServices = allServices.filter(
              (service: any) => service.vendorId === user.id
            );
            setServices(vendorServices);
          }
        } catch (error) {
          console.error('Error loading services:', error);
        }
      }
    };

    // Load bookings for the vendor
    const loadVendorBookings = () => {
      if (user?.id) {
        try {
          const storedBookings = localStorage.getItem('bookings');
          if (storedBookings) {
            const allBookings = JSON.parse(storedBookings);
            const vendorBookings = allBookings.filter(
              (booking: any) => booking.vendorId === user.id
            );
            setBookings(vendorBookings);
          }
        } catch (error) {
          console.error('Error loading bookings:', error);
        }
      }
    };

    loadVendorServices();
    loadVendorBookings();
  }, [user]);

  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = () => {
    try {
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices && serviceToDelete) {
        const allServices = JSON.parse(storedServices);
        const updatedServices = allServices.filter(
          (service: any) => service.id !== serviceToDelete
        );
        localStorage.setItem('vendorServices', JSON.stringify(updatedServices));
        
        // Update local state
        setServices(services.filter(service => service.id !== serviceToDelete));
        
        toast({
          title: "Service Deleted",
          description: "Your service has been successfully deleted.",
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

  const handleAddServiceSuccess = () => {
    setIsAddServiceOpen(false);
    
    // Reload services
    try {
      const storedServices = localStorage.getItem('vendorServices');
      if (storedServices) {
        const allServices = JSON.parse(storedServices);
        const vendorServices = allServices.filter(
          (service: any) => service.vendorId === user?.id
        );
        setServices(vendorServices);
      }
    } catch (error) {
      console.error('Error reloading services:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your services and bookings</p>
        </div>
        <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new service offering for your clients.
              </DialogDescription>
            </DialogHeader>
            <ServiceUploadForm onSuccess={handleAddServiceSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="services">
            <Package className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="h-4 w-4 mr-2" />
            Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Your Services</CardTitle>
              <CardDescription>
                Manage the services you offer to your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No services yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first service to start attracting clients
                  </p>
                  <Button 
                    className="bg-kasadya-purple hover:bg-kasadya-deep-purple"
                    onClick={() => setIsAddServiceOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Service
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
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
                                  <Camera className="h-5 w-5 text-gray-500" />
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
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {service.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(service.price)}</TableCell>
                          <TableCell>{formatDate(service.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
              <CardDescription>
                View and manage client bookings for your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Bookings will appear here when clients book your services
                  </p>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Get more bookings</AlertTitle>
                    <AlertDescription>
                      Make sure to add attractive services with detailed descriptions and high-quality images to attract more clients.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{booking.name}</span>
                              <span className="text-xs text-muted-foreground">{booking.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{booking.date}</span>
                              <span className="text-xs text-muted-foreground">{booking.time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(booking.amount || booking.totalPrice)}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">
                              <Info className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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

export default VendorDashboard;
