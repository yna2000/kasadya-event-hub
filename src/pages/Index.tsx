
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-kasadya-teal/5">
      <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden animate-fade-in">
        <div className="md:flex">
          <div className="md:w-1/2 bg-kasadya-brown p-8 text-white flex flex-col justify-center">
            <div className="mb-6 flex items-center">
              <img 
                src="/lovable-uploads/5cbbe934-29df-4dba-823a-f08a2c799ad6.png" 
                alt="Kasadya Logo" 
                className="h-16 w-16 mr-3 animate-bounce-subtle" 
              />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-kasadya-teal to-kasadya-gold bg-clip-text text-transparent">
                Kasadya Events
              </h1>
            </div>
            <p className="text-lg mb-6">Your one-stop marketplace for event services in Davao del Norte</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center transform transition-all hover:translate-x-1 hover-lift">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-kasadya-teal mr-2 text-xs">✓</span> 
                Find trusted local vendors
              </li>
              <li className="flex items-center transform transition-all hover:translate-x-1 hover-lift">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-kasadya-teal mr-2 text-xs">✓</span> 
                Book event services securely
              </li>
              <li className="flex items-center transform transition-all hover:translate-x-1 hover-lift">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-kasadya-teal mr-2 text-xs">✓</span> 
                Verified service providers
              </li>
              <li className="flex items-center transform transition-all hover:translate-x-1 hover-lift">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-kasadya-teal mr-2 text-xs">✓</span> 
                Easy payment options
              </li>
            </ul>
          </div>
          <CardContent className="md:w-1/2 p-8 bg-white flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-kasadya-brown">Get Started Today</h2>
            <p className="text-gray-600 mb-6">
              Browse our marketplace for event services including catering, photography, venues, decorations, and more.
            </p>
            <div className="flex flex-col space-y-3">
              <Button asChild className="bg-kasadya-teal hover:bg-kasadya-deep-teal group text-white font-medium">
                <Link to="/services" className="flex items-center">
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-kasadya-teal text-kasadya-teal hover:bg-kasadya-teal/10 group">
                <Link to="/vendors" className="flex items-center">
                  Find Vendors
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <div className="flex justify-between mt-4">
                <Button asChild variant="ghost" size="sm" className="text-kasadya-brown hover:text-kasadya-teal hover:bg-kasadya-teal/5">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-kasadya-brown hover:text-kasadya-teal hover:bg-kasadya-teal/5">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Index;
