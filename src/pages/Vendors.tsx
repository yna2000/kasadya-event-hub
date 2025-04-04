
import { useState } from 'react';
import { Search, Star, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import VendorBookingForm from '@/components/booking/VendorBookingForm';
import { useAuth } from '@/contexts/AuthContext';

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { user } = useAuth();
  
  // Mock data for vendors - would come from an API in a real application
  const vendors = [
    {
      id: "vendor1",
      name: "Elegance Wedding Photography",
      description: "Award-winning photographers specializing in wedding and event photography",
      category: "Photography",
      location: "Tagum City",
      rating: 4.9,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: "vendor2",
      name: "Divine Catering Services",
      description: "Exceptional food and service for all types of events and occasions",
      category: "Catering",
      location: "Davao City",
      rating: 4.8,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: "vendor3",
      name: "Rhythms Entertainment",
      description: "Live music, DJs, and performers for weddings, corporate events, and parties",
      category: "Entertainment",
      location: "Tagum City",
      rating: 4.7,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: "vendor4",
      name: "Blooms & Blossoms",
      description: "Creative floral arrangements and decorations for events of all sizes",
      category: "Decoration",
      location: "Panabo City",
      rating: 4.6,
      reviewCount: 42,
      image: "https://images.unsplash.com/photo-1561128290-3a5859af700f?ixlib=rb-4.0.3",
      featured: false,
    },
    {
      id: "vendor5",
      name: "Celebration Venue",
      description: "Elegant venue spaces for weddings, corporate events, and special occasions",
      category: "Venue",
      location: "Davao City",
      rating: 4.8,
      reviewCount: 112,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3",
      featured: true,
    },
    {
      id: "vendor6",
      name: "Sweet Delights Bakery",
      description: "Custom cakes and desserts for birthdays, weddings, and special events",
      category: "Bakery",
      location: "Tagum City",
      rating: 4.9,
      reviewCount: 78,
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3",
      featured: false,
    },
  ];

  // Filter locations and categories for the dropdown
  const locations = [...new Set(vendors.map(vendor => vendor.location))];
  const categories = [...new Set(vendors.map(vendor => vendor.category))];

  // Apply filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === '' || vendor.location === locationFilter;
    const matchesCategory = categoryFilter === '' || vendor.category === categoryFilter;
    
    return matchesSearch && matchesLocation && matchesCategory;
  });

  const handleContactVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsBookingFormOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="kasadya-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Vendors</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover top-rated event service providers in Davao del Norte
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search vendors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="md:w-auto flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Featured Vendors</h2>
          <p className="section-subtitle">
            Our top-rated service providers in Davao del Norte
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors
              .filter(vendor => vendor.featured)
              .map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{vendor.name}</h3>
                      <Badge variant="outline" className="bg-kasadya-purple text-white">Featured</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{vendor.category}</p>
                    <p className="text-gray-600 mb-4">{vendor.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{vendor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-kasadya-purple hover:bg-kasadya-deep-purple"
                      onClick={() => handleContactVendor(vendor)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* All Vendors */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">All Vendors</h2>
          <p className="section-subtitle">
            Browse our complete directory of event service providers
          </p>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{vendor.category}</p>
                    <p className="text-gray-600 mb-4">{vendor.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{vendor.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-kasadya-purple hover:bg-kasadya-deep-purple"
                      onClick={() => handleContactVendor(vendor)}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No vendors found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                  setCategoryFilter('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Become a Vendor */}
      <section className="section-padding kasadya-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to Join Our Vendor Network?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Expand your business by becoming a vendor on Kasadya Marketplace. Reach more clients and grow your event service business.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-kasadya-purple hover:bg-gray-100"
            onClick={() => window.location.href = '/register'}
          >
            Become a Vendor
          </Button>
        </div>
      </section>

      {/* Booking Form Dialog */}
      {selectedVendor && (
        <VendorBookingForm 
          isOpen={isBookingFormOpen}
          onClose={() => setIsBookingFormOpen(false)}
          vendor={selectedVendor}
        />
      )}
    </Layout>
  );
};

export default Vendors;
