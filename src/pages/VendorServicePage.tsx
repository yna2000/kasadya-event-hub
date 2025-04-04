
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BookingForm from '@/components/booking/BookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Star, User } from 'lucide-react';

// Mock data - in a real app this would come from an API
const services = [
  {
    id: 'service-1',
    name: 'Basic Photography Package',
    description: 'Professional photography coverage for your event. Includes 100 edited photos, 1 photographer, and 4 hours of coverage.',
    price: 15000,
    category: 'photography',
  },
  {
    id: 'service-2',
    name: 'Premium Photography Package',
    description: 'Comprehensive photography coverage with 2 photographers, 8 hours of coverage, 300 edited photos, and a photo album.',
    price: 25000,
    category: 'photography',
  },
  {
    id: 'service-3',
    name: 'Basic Catering Package',
    description: 'Catering service for up to 50 guests. Includes appetizers, main course, and dessert.',
    price: 20000,
    category: 'catering',
  },
];

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
      'https://images.unsplash.com/photo-1564508211780-5ff8ea968915',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a',
    ],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
];

const VendorServicePage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [vendorServices, setVendorServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    // In a real app, fetch the vendor from an API
    const foundVendor = vendors.find(v => v.id === vendorId);
    setVendor(foundVendor);

    if (foundVendor) {
      // Filter services by vendor category
      const vendorServiceList = services.filter(s => s.category === foundVendor.category);
      setVendorServices(vendorServiceList);
      
      // Set the first service as selected by default
      if (vendorServiceList.length > 0) {
        setSelectedService(vendorServiceList[0]);
      }
    }
  }, [vendorId]);

  if (!vendor) {
    return (
      <Layout>
        <div className="container mx-auto py-10 px-4 text-center">
          <h1 className="text-2xl font-semibold mb-4">Vendor Not Found</h1>
          <p className="mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
          <Link to="/vendors">
            <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
              Browse All Vendors
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setShowBookingForm(false);
  };

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
  };

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-2">{vendor.name}</h1>
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {renderStars(vendor.rating)}
            </div>
            <span className="text-gray-600">
              {vendor.rating} ({vendor.reviewCount} reviews)
            </span>
          </div>
          <p className="text-gray-700 mb-4">{vendor.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{vendor.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <span>{vendor.contactNumber}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{vendor.yearsInBusiness} years in business</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="md:w-2/3">
            <Tabs defaultValue="services">
              <TabsList className="mb-6">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <h2 className="text-xl font-semibold mb-4">Available Services</h2>
                <div className="space-y-4">
                  {vendorServices.map((service) => (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer transition-all ${selectedService?.id === service.id ? 'ring-2 ring-kasadya-purple' : ''}`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="font-medium text-kasadya-purple text-lg">₱{service.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="portfolio">
                <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendor.portfolio.map((image: string, index: number) => (
                    <div key={index} className="rounded-lg overflow-hidden h-48">
                      <img 
                        src={`${image}?auto=format&w=500&h=300`} 
                        alt={`Portfolio item ${index + 1}`}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                {/* Mock reviews - in a real app, these would come from an API */}
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(5)}
                      </div>
                      <span className="font-medium">Maria Santos</span>
                    </div>
                    <p className="text-gray-700">
                      "We hired {vendor.name} for our wedding and the service was excellent! 
                      Very professional and the quality exceeded our expectations."
                    </p>
                    <p className="text-sm text-gray-500 mt-1">January 15, 2025</p>
                  </div>
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(4)}
                      </div>
                      <span className="font-medium">John Reyes</span>
                    </div>
                    <p className="text-gray-700">
                      "Great service for our corporate event. The team was punctual and professional. 
                      Would definitely recommend their services."
                    </p>
                    <p className="text-sm text-gray-500 mt-1">March 3, 2025</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(5)}
                      </div>
                      <span className="font-medium">Anna Garcia</span>
                    </div>
                    <p className="text-gray-700">
                      "Amazing experience working with {vendor.name}! They were very accommodating with 
                      our special requests and delivered outstanding results."
                    </p>
                    <p className="text-sm text-gray-500 mt-1">February 20, 2025</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="about">
                <h2 className="text-xl font-semibold mb-4">About {vendor.name}</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    {vendor.description} With {vendor.yearsInBusiness} years of experience in the industry, 
                    we've built a reputation for reliability, quality, and exceptional customer service.
                  </p>
                  
                  <div>
                    <h3 className="font-medium mb-2">Operating Hours</h3>
                    <p className="text-gray-700">
                      Available days: {vendor.availableDays.join(', ')}
                    </p>
                    <p className="text-gray-700">
                      Hours: 8:00 AM - 7:00 PM
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Service Areas</h3>
                    <p className="text-gray-700">
                      We provide services throughout Davao del Norte, including Davao City, 
                      Tagum City, and surrounding areas.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - Booking or Service Info */}
          <div className="md:w-1/3">
            {showBookingForm && selectedService ? (
              <BookingForm 
                vendorId={vendor.id}
                vendorName={vendor.name}
                serviceId={selectedService.id}
                serviceName={selectedService.name}
                serviceDescription={selectedService.description}
                amount={selectedService.price}
                onSuccess={handleBookingSuccess}
              />
            ) : selectedService ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Selected Service</h2>
                <div className="mb-4">
                  <h3 className="font-medium">{selectedService.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedService.description}</p>
                  <p className="text-lg font-semibold text-kasadya-purple">₱{selectedService.price.toLocaleString()}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span>Provided by {vendor.name}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Available on {vendor.availableDays.join(', ')}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-kasadya-purple hover:bg-kasadya-deep-purple"
                  onClick={handleBookNowClick}
                >
                  Book Now
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                  Secure your booking today. Easy cancellation up to 48 hours before the event.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Contact {vendor.name}</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{vendor.contactNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-700 break-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{vendor.email}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Please select a service from the list to proceed with booking. If you have any questions,
                  feel free to contact {vendor.name} directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorServicePage;
