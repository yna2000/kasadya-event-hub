
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  
  // Safely handle notifications
  let unreadCount = 0;
  try {
    const { unreadCount: count } = useNotifications();
    unreadCount = count;
  } catch (error) {
    console.log('Notifications context not available in Navbar');
  }
  
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

          {/* Right Side - Search, User, and Notifications */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-kasadya-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-2">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to="/dashboard" className="w-full">
                      <DropdownMenuItem>
                        View All Notifications
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-kasadya-purple text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to="/dashboard">
                      <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" className="border-kasadya-purple text-kasadya-purple hover:bg-kasadya-purple hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
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

              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block py-2 hover:text-kasadya-purple"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-left hover:text-kasadya-purple"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full border-kasadya-purple text-kasadya-purple hover:bg-kasadya-purple hover:text-white">
                      Login
                    </Button>
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-kasadya-purple hover:bg-kasadya-deep-purple text-white">
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              <div className="pt-4 flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-kasadya-purple"
                />
                <Search className="absolute ml-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
