
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <Card className="w-full max-w-4xl mx-auto shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-kasadya-purple p-8 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">Kasadya Events</h1>
            <p className="text-lg mb-6">Your one-stop marketplace for event services in Davao del Norte</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span> Find trusted local vendors
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Book event services securely
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Verified service providers
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span> Easy payment options
              </li>
            </ul>
          </div>
          <CardContent className="md:w-1/2 p-8 bg-white flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-kasadya-purple">Get Started Today</h2>
            <p className="text-gray-600 mb-6">
              Browse our marketplace for event services including catering, photography, venues, decorations, and more.
            </p>
            <div className="flex flex-col space-y-3">
              <Button asChild className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
                <Link to="/home">Explore Services</Link>
              </Button>
              <Button asChild variant="outline" className="border-kasadya-purple text-kasadya-purple hover:bg-kasadya-purple/10">
                <Link to="/vendors">Find Vendors</Link>
              </Button>
              <div className="flex justify-between mt-4">
                <Button asChild variant="ghost" size="sm" className="text-gray-500 hover:text-kasadya-purple">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-gray-500 hover:text-kasadya-purple">
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
