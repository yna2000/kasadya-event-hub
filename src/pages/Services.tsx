
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Music, Gift, Camera, Cake, Users, Award, Home, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Services = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Service categories with their icons
  const categories = [
    { id: "all", label: "All Services" },
    { id: "weddings", label: "Weddings", icon: <Calendar /> },
    { id: "birthdays", label: "Birthdays", icon: <Cake /> },
    { id: "corporate", label: "Corporate", icon: <Users /> },
    { id: "entertainment", label: "Entertainment", icon: <Music /> },
  ];

  // Service listings - would come from an API in a real application
  const services = [
    {
      id: 1,
      title: "Wedding Photography",
      description: "Professional photographers to capture your special day with artistic flair and attention to detail.",
      category: "weddings",
      icon: <Camera className="h-8 w-8 text-kasadya-purple" />,
      popular: true,
    },
    {
      id: 2,
      title: "Wedding Venues",
      description: "Beautiful venues for your ceremony and reception, from beaches to gardens to elegant ballrooms.",
      category: "weddings",
      icon: <Home className="h-8 w-8 text-kasadya-purple" />,
      popular: true,
    },
    {
      id: 3,
      title: "Wedding Catering",
      description: "Exquisite menus and professional service for your wedding dinner.",
      category: "weddings",
      icon: <Utensils className="h-8 w-8 text-kasadya-purple" />,
      popular: false,
    },
    {
      id: 4,
      title: "Birthday Party Planning",
      description: "End-to-end planning for memorable birthday celebrations for all ages.",
      category: "birthdays",
      icon: <Cake className="h-8 w-8 text-kasadya-purple" />,
      popular: true,
    },
    {
      id: 5,
      title: "Children's Entertainment",
      description: "Fun activities, games, and entertainment packages for kids' parties.",
      category: "birthdays",
      icon: <Gift className="h-8 w-8 text-kasadya-purple" />,
      popular: false,
    },
    {
      id: 6,
      title: "Corporate Event Management",
      description: "Full-service management for conferences, product launches, and company milestones.",
      category: "corporate",
      icon: <Award className="h-8 w-8 text-kasadya-purple" />,
      popular: true,
    },
    {
      id: 7,
      title: "Team Building Activities",
      description: "Engaging activities to boost team morale and improve collaboration.",
      category: "corporate",
      icon: <Users className="h-8 w-8 text-kasadya-purple" />,
      popular: false,
    },
    {
      id: 8,
      title: "Live Bands & Musicians",
      description: "Talented performers to provide the perfect soundtrack for your event.",
      category: "entertainment",
      icon: <Music className="h-8 w-8 text-kasadya-purple" />,
      popular: true,
    },
  ];

  // Filter services based on active tab
  const filteredServices = activeTab === "all" 
    ? services 
    : services.filter(service => service.category === activeTab);
  
  // Additional filter for popular services
  const popularServices = services.filter(service => service.popular);

  return (
    <>
      {/* Hero Section */}
      <section className="kasadya-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover a wide range of premium event services to make your celebrations truly special.
          </p>
        </div>
      </section>

      {/* Popular Services */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Popular Services</h2>
          <p className="section-subtitle">
            Our most requested event services in Davao del Norte
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => (
              <div 
                key={service.id} 
                className="border border-gray-200 rounded-lg p-6 flex flex-col h-full hover:shadow-lg hover:border-kasadya-purple transition-all"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                <Button asChild variant="outline" className="w-full border-kasadya-purple text-kasadya-purple hover:bg-kasadya-purple hover:text-white">
                  <Link to="/vendors">Find Providers</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Explore All Services</h2>
          <p className="section-subtitle">
            Browse our comprehensive list of event services
          </p>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:text-kasadya-purple data-[state=active]:border-b-2 data-[state=active]:border-kasadya-purple"
                  >
                    <div className="flex items-center">
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.label}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full hover:shadow-lg hover:border-kasadya-purple transition-all"
                  >
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                    <Button asChild variant="outline" className="w-full border-kasadya-purple text-kasadya-purple hover:bg-kasadya-purple hover:text-white">
                      <Link to="/vendors">Find Providers</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Don't see what you're looking for? Contact us and we'll help you find the perfect service provider.
            </p>
            <Button asChild size="lg" className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Booking your event services through Kasadya Marketplace is simple
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-kasadya-purple text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Browse Services</h3>
              <p className="text-gray-600">Explore our wide selection of event services and vendors.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-kasadya-purple text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Connect with Vendors</h3>
              <p className="text-gray-600">Contact vendors directly to discuss your specific needs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-kasadya-purple text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Confirm & Celebrate</h3>
              <p className="text-gray-600">Book your services and get ready for an amazing event!</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
              <Link to="/vendors">Find Vendors Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
