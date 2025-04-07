
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Kasadya Events</h1>
        <p className="text-xl text-gray-600 mb-6">Your one-stop marketplace for event services in Davao del Norte</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
            <Link to="/home">Explore Services</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/vendors">Find Vendors</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
