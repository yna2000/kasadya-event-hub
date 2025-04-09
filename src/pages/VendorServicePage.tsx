import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VendorBookingForm from '@/components/booking/VendorBookingForm';
import TermsAndConditionsModal from '@/components/modals/TermsAndConditionsModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Star, User, Package } from 'lucide-react';

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

const VendorServicePage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [vendorServices, setVendorServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  
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
    // Check if terms were already accepted
    const termsAccepted = localStorage.getItem('termsAccepted') === 'true';
    if (termsAccepted) {
      // If terms were accepted, open booking form directly
      setShowBookingForm(true);
    } else {
      // Otherwise, show terms modal first
      setIsTermsModalOpen(true);
    }
  };

  const handleAcceptTerms = () => {
    setIsTermsModalOpen(false);
    setShowBookingForm(true);
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
                                    ₱{service.price.toLocaleString()}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
      />
      
      {/* Booking Form */}
      {showBookingForm && (
        <VendorBookingForm
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
          vendor={{
            id: vendor.id,
            name: vendor.name,
            category: vendor.category,
            location: vendor.location,
            image: vendor.portfolio[0]
          }}
          service={selectedService ? selectedService.name : vendor.category}
        />
      )}
    </>
  );
};

export default VendorServicePage;
