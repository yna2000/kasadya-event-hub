
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-kasadya-purple to-kasadya-deep-purple bg-clip-text text-transparent">
              Kasadya
              <span className="text-black"> Marketplace</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-kasadya-purple transition-colors">
              Home
            </Link>
            <Link to="/about" className="font-medium hover:text-kasadya-purple transition-colors">
              About Us
            </Link>
            <Link to="/services" className="font-medium hover:text-kasadya-purple transition-colors">
              Services
            </Link>
            <Link to="/vendors" className="font-medium hover:text-kasadya-purple transition-colors">
              Vendors
            </Link>
            <Link to="/contact" className="font-medium hover:text-kasadya-purple transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side - Search and CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-kasadya-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple text-white">
              Find Services
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="block py-2 hover:text-kasadya-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block py-2 hover:text-kasadya-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/services" 
                className="block py-2 hover:text-kasadya-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/vendors" 
                className="block py-2 hover:text-kasadya-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendors
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 hover:text-kasadya-purple"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-kasadya-purple"
                />
                <Search className="absolute ml-3 h-4 w-4 text-gray-400" />
              </div>

              <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple text-white w-full">
                Find Services
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
