
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">
              <span className="bg-gradient-to-r from-kasadya-purple to-kasadya-gold bg-clip-text text-transparent">
                Kasadya Marketplace
              </span>
            </h3>
            <p className="mb-4 text-gray-300">
              Connecting you with the best event services in Davao del Norte. Let's celebrate life's moments together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-kasadya-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-kasadya-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-kasadya-purple transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-kasadya-purple transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-kasadya-purple transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-kasadya-purple transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-kasadya-purple transition-colors">Vendors</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-kasadya-purple transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-kasadya-purple" />
                <span>123 Main Street, Tagum City, Davao del Norte, Philippines</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-kasadya-purple" />
                <span>+63 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-kasadya-purple" />
                <span>info@kasadyamarketplace.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4 text-gray-300">Stay updated with our latest services and events.</p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-kasadya-purple"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-kasadya-purple hover:bg-kasadya-deep-purple rounded text-white transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Kasadya Marketplace. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link to="/terms" className="hover:text-kasadya-purple text-sm">Terms & Conditions</Link>
            <Link to="/privacy" className="hover:text-kasadya-purple text-sm">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-kasadya-purple text-sm">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
