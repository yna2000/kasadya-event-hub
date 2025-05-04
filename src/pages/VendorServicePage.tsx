
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import VendorBookingForm from '@/components/booking/VendorBookingForm';
import BookingTerms from '@/components/booking/BookingTerms';
import { EnhancedPaymentMethodSelection } from '@/components/booking/EnhancedPaymentMethodSelection';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { BookingSteps } from '@/components/booking/BookingSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, MapPin, Phone, Star, 
  User, Package, Shield, AlertTriangle
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app this would come from an API
const vendors = [
  {
    id: 'vendor-1',
    name: 'Dream Photography',
    description: 'Professional photography services for all your special moments. We specialize in weddings, birthdays, and corporate events.',
    rating: 4.8,
    reviewCount: 45,
    location: 'Davao City, Davao del Norte',
    contactNumber: '+63 912 345 6789',
    email: 'info@dreamphotography.com',
    category: 'photography',
    yearsInBusiness: 5,
    portfolio: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b',
      'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
    ],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  {
    id: 'vendor-2',
    name: 'Sunshine Catering',
    description: 'Delicious food and exceptional service for your events. We offer a variety of cuisines and can accommodate special dietary requirements.',
    rating: 4.6,
    reviewCount: 32,
    location: 'Tagum City, Davao del Norte',
    contactNumber: '+63 923 456 7890',
    email: 'info@sunshinecatering.com',
    category: 'catering',
    yearsInBusiness: 8,
    portfolio: [
      'https://images.unsplash.com/photo-1555244162-803834f70033',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      'https://images.unsplash.com/photo-1574966739987-61326238289a',
    ],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  }
];

// Define types for our booking steps
type BookingStep = 'details' | 'terms' | 'verification' | 'payment' | 'confirmation';

const VendorServicePage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [vendorServices, setVendorServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('details');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const { user } = useAuth();
  const { createBooking } = useBooking();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // In real app, fetch vendor from API
    const foundVendor = vendors.find(v => v.id === vendorId);
    if (foundVendor) {
      setVendor(foundVendor);
      
      // Load services from localStorage (in a real app this would be from an API)
      try {
        const storedServices = localStorage.getItem('vendorServices');
        if (storedServices) {
          const allServices = JSON.parse(storedServices);
          // Filter services by vendor ID
          const services = allServices.filter((service: any) => service.vendorId === vendorId);
          setVendorServices(services);
          
          if (services.length > 0) {
            setSelectedService(services[0]);
          }
        }
      } catch (error) {
        console.error('Error loading services:', error);
      }
    }
  }, [vendorId]);

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Vendor not found</h2>
        <p className="mb-6">The vendor you are looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/vendors">Browse Vendors</Link>
        </Button>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to book this vendor",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setBookingStep('details');
    setShowBookingSheet(true);
  };

  const handleBookingDetailsSubmit = (data: any) => {
    setBookingDetails(data);
    setBookingStep('terms');
  };
  
  const handleAcceptTerms = () => {
    setBookingStep('verification');
  };
  
  const handleVerificationComplete = () => {
    setBookingStep('payment');
  };
  
  const handlePaymentMethodSelected = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  
  const handlePaymentContinue = () => {
    // Process the payment
    if (bookingDetails && selectedService) {
      try {
        // In a real app, the amount would be calculated based on the service
        const amount = selectedService.price || Math.floor(Math.random() * 500) + 100;
        
        const newBookingData = {
          vendorId: vendor.id,
          vendorName: vendor.name,
          userId: user?.id || '',
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          serviceDescription: selectedService.description,
          date: bookingDetails.date,
          time: bookingDetails.time,
          amount: amount,
          notes: bookingDetails.notes || '',
          // Add the missing properties required by the Booking interface
          name: user?.name || '',
          email: user?.email || '',
          roomType: selectedService.name,
          checkInDate: bookingDetails.date,
          checkOutDate: bookingDetails.date,
          totalPrice: amount,
        };
        
        createBooking(newBookingData).then((booking) => {
          // Update bookingDetails with the new booking ID and other details
          setBookingDetails({
            ...bookingDetails,
            bookingId: booking.id,
            vendorName: vendor.name,
            serviceName: selectedService.name,
            amount: amount,
            paymentMethod: selectedPaymentMethod,
            userName: user?.name,
            location: vendor.location,
          });
          
          // Move to confirmation step
          setBookingStep('confirmation');
        });
      } catch (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Booking Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDone = () => {
    setShowBookingSheet(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div className="bg-gray-100 pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Vendor Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-1/3 h-64 md:h-auto">
                <img 
                  src={vendor.portfolio[0]} 
                  alt={vendor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold mr-1">{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {vendor.location}
                </div>
                
                <p className="text-gray-700 mb-4">{vendor.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-kasadya-purple mr-2" />
                    <span>{vendor.yearsInBusiness} years in business</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-kasadya-purple mr-2" />
                    <span>{vendor.contactNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-kasadya-purple mr-2" />
                    <span>Available {vendor.availableDays.length} days/week</span>
                  </div>
                </div>
                
                <Button 
                  className="bg-kasadya-purple hover:bg-kasadya-deep-purple w-full md:w-auto"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services and Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="services">
                <TabsList className="bg-white w-full">
                  <TabsTrigger value="services" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="mt-4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Available Services</h2>
                    
                    {vendorServices.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">This vendor hasn't added any services yet.</p>
                        <p className="text-gray-500 text-sm mt-2">Check back later or contact them directly for information.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {vendorServices.map((service) => (
                          <Card 
                            key={service.id} 
                            className={`cursor-pointer hover:border-kasadya-purple transition-colors ${
                              selectedService?.id === service.id ? 'border-kasadya-purple' : ''
                            }`}
                            onClick={() => setSelectedService(service)}
                          >
                            <CardContent className="p-5">
                              <div className="md:flex justify-between items-start">
                                <div className="md:flex gap-4 mb-4 md:mb-0">
                                  {service.images && service.images.length > 0 && (
                                    <div className="h-24 w-24 rounded-md overflow-hidden mb-3 md:mb-0 flex-shrink-0">
                                      <img 
                                        src={service.images[0]} 
                                        alt={service.name} 
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-xl font-bold">{service.name}</h3>
                                    <p className="text-gray-600 line-clamp-2 md:max-w-md mt-1">{service.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-xl font-bold text-kasadya-purple mb-2">
                                    ₱{service.price?.toLocaleString() || 'Contact for price'}
                                  </div>
                                  <Button 
                                    className="w-full md:w-auto bg-kasadya-purple hover:bg-kasadya-deep-purple"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedService(service);
                                      handleBookNow();
                                    }}
                                  >
                                    Book This Package
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="portfolio" className="mt-4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {vendor.portfolio.map((photo: string, index: number) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img src={photo} alt={`Portfolio item ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                    <div className="text-center py-8">
                      <p className="text-gray-600">Review feature coming soon!</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Info */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Booking Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Available Days</h3>
                    <p>{vendor.availableDays.join(', ')}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Typical Response Time</h3>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-kasadya-purple mr-2" />
                      <span>Within 24 hours</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Service Area</h3>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-kasadya-purple mr-2" />
                      <span>Davao del Norte and surrounding areas</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <Button 
                    className="w-full bg-kasadya-purple hover:bg-kasadya-deep-purple"
                    onClick={handleBookNow}
                  >
                    Book This Vendor
                  </Button>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={15} />
                  <span>Secure booking process</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Sheet */}
      <Sheet open={showBookingSheet} onOpenChange={setShowBookingSheet}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Book {vendor?.name}</SheetTitle>
            <SheetDescription>
              {selectedService ? selectedService.name : vendor?.category}
            </SheetDescription>
          </SheetHeader>
          
          <BookingSteps currentStep={bookingStep} className="mb-6" />
          
          {bookingStep === 'details' && (
            <VendorBookingForm
              isOpen={true}
              onClose={() => setShowBookingSheet(false)}
              vendor={{
                id: vendor.id,
                name: vendor.name,
                category: vendor.category,
                location: vendor.location,
                image: vendor.portfolio[0]
              }}
              service={selectedService ? selectedService.name : vendor.category}
              onSubmit={handleBookingDetailsSubmit}
            />
          )}
          
          {bookingStep === 'terms' && (
            <BookingTerms
              onAccept={handleAcceptTerms}
              onCancel={() => setShowBookingSheet(false)}
              onBack={() => setBookingStep('details')}
            />
          )}
          
          {bookingStep === 'verification' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start space-x-3">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800">Verification Required</p>
                  <p className="text-amber-700 text-sm">
                    We've sent a verification code to your email address. Please enter it below to confirm your booking.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-6 py-4">
                {/* This would be replaced with an actual OTP component in a real implementation */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((_, i) => (
                    <div key={i} className="w-10 h-12 border-2 rounded flex items-center justify-center font-bold text-xl">
                      {i === 0 ? '1' : i === 1 ? '2' : i === 2 ? '3' : i === 3 ? '4' : i === 4 ? '5' : '6'}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="bg-kasadya-purple hover:bg-kasadya-deep-purple"
                  onClick={handleVerificationComplete}
                >
                  Verify and Continue
                </Button>
                
                <p className="text-sm text-gray-500 mt-4">
                  Didn't receive a code? <Button variant="link" className="p-0 h-auto">Resend</Button>
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setBookingStep('terms')}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowBookingSheet(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {bookingStep === 'payment' && (
            <EnhancedPaymentMethodSelection
              onSelectMethod={handlePaymentMethodSelected}
              selectedMethod={selectedPaymentMethod}
              onBack={() => setBookingStep('verification')}
              onCancel={() => setShowBookingSheet(false)}
              onContinue={handlePaymentContinue}
            />
          )}
          
          {bookingStep === 'confirmation' && bookingDetails && (
            <BookingConfirmation
              bookingDetails={bookingDetails}
              onDone={handleDone}
            />
          )}
          
          <SheetFooter className="mt-6">
            {/* Footer content will be handled by individual components */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VendorServicePage;
