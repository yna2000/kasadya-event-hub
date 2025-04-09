
import { Link } from 'react-router-dom';
import { Calendar, Music, Gift, Camera, Cake, Users, CheckCircle, Award, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Home = () => {
  // Featured service categories
  const services = [
    { 
      icon: <Calendar className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Weddings', 
      description: 'Find the perfect venue, catering, photography and more for your special day.',
      url: '/services#weddings'
    },
    { 
      icon: <Cake className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Birthday Parties', 
      description: 'Celebrate another year with amazing decorations, cakes, and entertainment.',
      url: '/services#birthdays'
    },
    { 
      icon: <Users className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Corporate Events', 
      description: 'Impress clients and colleagues with professional event planning services.',
      url: '/services#corporate'
    },
    { 
      icon: <Music className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Entertainment', 
      description: 'Book talented musicians, DJs, and performers for any occasion.',
      url: '/services#entertainment'
    },
    { 
      icon: <Camera className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Photo & Video', 
      description: 'Capture every moment with professional photographers and videographers.',
      url: '/services#photo'
    },
    { 
      icon: <Gift className="h-12 w-12 text-kasadya-purple" />, 
      title: 'Gifts & Favors', 
      description: 'Find unique gifts and memorable party favors for your guests.',
      url: '/services#gifts'
    },
  ];

  // Core values
  const coreValues = [
    {
      icon: <Award className="h-6 w-6 text-kasadya-teal" />,
      title: 'Excellence',
      description: 'We deliver the highest quality service experiences'
    },
    {
      icon: <Heart className="h-6 w-6 text-kasadya-teal" />,
      title: 'Customer Focus',
      description: 'Your special moments are our priority'
    },
    {
      icon: <MapPin className="h-6 w-6 text-kasadya-teal" />,
      title: 'Local First',
      description: 'Supporting and showcasing Davao del Norte\'s best'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Maria Santos',
      role: 'Bride',
      content: 'Kasadya Marketplace made planning my wedding so much easier. I found my dream venue and the best photographer in Davao, all in one place!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Juan Dela Cruz',
      role: 'Corporate Event Planner',
      content: 'As someone who organizes business events regularly, Kasadya has been a lifesaver. The quality of vendors and ease of booking is unmatched.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Sofia Reyes',
      role: 'Vendor - Cake Designer',
      content: 'Since joining Kasadya Marketplace, my bakery business has grown tremendously. The platform connects me with clients I would never have reached otherwise!',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
  ];

  // Blog posts (featured)
  const blogPosts = [
    {
      title: "Top 10 Wedding Venues in Davao del Norte",
      excerpt: "Discover the most beautiful and sought-after wedding venues in the region...",
      image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3",
      date: "April 2, 2023"
    },
    {
      title: "Planning the Perfect Birthday Party on a Budget",
      excerpt: "Learn how to create memorable celebrations without breaking the bank...",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3",
      date: "March 15, 2023"
    },
    {
      title: "Corporate Event Trends for 2023",
      excerpt: "Stay ahead of the curve with these innovative corporate event ideas...",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3",
      date: "February 28, 2023"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-70"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-playfair">
              Connecting You with the Best Event Services in Davao del Norte
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Find the perfect services and vendors to make your special occasions truly memorable.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-kasadya-teal hover:bg-kasadya-deep-teal">
                <Link to="/services">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link to="/vendors">Browse Vendors</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-20">
              <h2 className="text-2xl font-bold mb-4 text-center">Find the Perfect Service for Your Event</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    placeholder="What service are you looking for?" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kasadya-teal"
                  />
                </div>
                <Button className="bg-kasadya-teal hover:bg-kasadya-deep-teal">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Featured Services</h2>
          <p className="section-subtitle">
            Discover a wide range of event services to make your celebrations perfect
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link to={service.url} key={index} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-kasadya-teal overflow-hidden hover-lift">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <span className="mt-auto text-kasadya-teal font-medium hover:text-kasadya-deep-teal transition-colors">
                      Learn More →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Kasadya */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-kasadya-teal font-semibold mb-2 block">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Perfect Partner for Your Perfect Events</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-kasadya-teal mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Curated Vendor Selection</h3>
                    <p className="text-gray-600">We personally vet all vendors to ensure quality and reliability.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-kasadya-teal mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Local Expertise</h3>
                    <p className="text-gray-600">Deep knowledge of Davao del Norte's best event service providers.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-kasadya-teal mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">Simplified Planning</h3>
                    <p className="text-gray-600">All your event needs in one convenient marketplace.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-kasadya-teal hover:bg-kasadya-deep-teal">
                <Link to="/about">Learn About Our Mission</Link>
              </Button>
            </div>
            
            <div className="hidden md:block rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3" 
                alt="Celebration event" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            What drives us to provide exceptional service for your special events
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center p-6 hover-lift">
                <div className="bg-gray-50 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Event Planning Tips</h2>
          <p className="section-subtitle">
            Insights and advice to help you plan the perfect event
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover-lift h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link 
                    to="#" 
                    className="text-kasadya-teal font-medium hover:text-kasadya-deep-teal transition-colors"
                  >
                    Read More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-kasadya-teal text-kasadya-teal hover:bg-kasadya-teal hover:text-white">
              <Link to="#">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">What People Are Saying</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Hear from our satisfied clients and vendors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover-lift">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-kasadya-teal hover:bg-kasadya-deep-teal">
              <Link to="/services">Start Your Event Journey Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding kasadya-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Unforgettable Events?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Kasadya Marketplace today and connect with the best event service providers in Davao del Norte.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-kasadya-teal hover:bg-gray-100">
              <Link to="/services">Browse Services</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/register">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
