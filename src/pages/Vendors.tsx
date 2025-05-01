
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch vendors from localStorage (in a real app, this would be an API call)
    const fetchVendors = () => {
      try {
        setIsLoading(true);
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const allUsers = JSON.parse(storedUsers);
          const vendorUsers = allUsers.filter(user => user.isVendor);
          setVendors(vendorUsers);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
        toast({
          title: "Error",
          description: "Failed to load vendors.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [toast]);

  const handlePostServiceClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to log in as a vendor to post services.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!user.isVendor) {
      toast({
        title: "Vendor Account Required",
        description: "You need a vendor account to post services.",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }

    navigate('/post-service');
  };

  const filteredVendors = vendors.filter(vendor => {
    return (
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.businessType && vendor.businessType.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Our Vendors</h1>
          <p className="text-muted-foreground mt-2">
            Discover trusted vendors for your events and celebrations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="search"
              placeholder="Search vendors..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handlePostServiceClick}
            className="bg-kasadya-purple hover:bg-kasadya-deep-purple w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post New Service
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kasadya-purple"></div>
        </div>
      ) : filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div 
              key={vendor.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/vendor/${vendor.id}`)}
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                {vendor.profileImage ? (
                  <img 
                    src={vendor.profileImage} 
                    alt={vendor.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{vendor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {vendor.businessType || "Service Provider"}
                </p>
                <div className="flex items-center mt-2">
                  {vendor.isVerified ? (
                    <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                      Verified Vendor
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded-full">
                      Pending Verification
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium mb-2">No vendors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or check back later</p>
        </div>
      )}
    </div>
  );
};

export default Vendors;
