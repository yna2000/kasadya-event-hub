
import { Heart, Star, Users, Shield, Sparkles, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const About = () => {
  // Core values data
  const coreValues = [
    {
      icon: <Heart className="h-10 w-10 text-kasadya-purple" />,
      title: 'Passion for Celebrations',
      description: 'We believe in the power of meaningful celebrations that create lasting memories.'
    },
    {
      icon: <Star className="h-10 w-10 text-kasadya-purple" />,
      title: 'Excellence',
      description: 'We strive for excellence in every interaction, connection, and service we provide.'
    },
    {
      icon: <Shield className="h-10 w-10 text-kasadya-purple" />,
      title: 'Integrity',
      description: 'Honesty and transparency guide all our business practices and relationships.'
    },
    {
      icon: <Users className="h-10 w-10 text-kasadya-purple" />,
      title: 'Community',
      description: 'We support and uplift the local Davao del Norte business community.'
    },
    {
      icon: <Sparkles className="h-10 w-10 text-kasadya-purple" />,
      title: 'Innovation',
      description: 'We continuously seek new ways to improve the event planning experience.'
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-kasadya-purple" />,
      title: 'Responsiveness',
      description: 'We listen attentively to feedback and respond promptly to all inquiries.'
    },
  ];

  // Team members data
  const teamMembers = [
    {
      name: 'Maria Gonzales',
      role: 'Founder & CEO',
      bio: 'With over 15 years of experience in event planning, Maria founded Kasadya Marketplace to connect local businesses with clients seeking quality event services.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Antonio Reyes',
      role: 'Chief Operating Officer',
      bio: 'Antonio ensures smooth operations and exceptional vendor experiences across the platform.',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Elena Santos',
      role: 'Head of Vendor Relations',
      bio: 'Elena works closely with our vendors to ensure they provide exceptional service to all clients.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Marketing Director',
      bio: 'Carlos develops creative strategies to connect clients with the perfect services for their events.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="kasadya-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connecting the best event service providers in Davao del Norte with clients who want to celebrate life's special moments.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-kasadya-light-gray p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Our Vision</h2>
              <p className="text-lg text-center">
                To be the premier marketplace that transforms how people in Davao del Norte plan and celebrate their most important events.
              </p>
            </div>
            
            <div className="bg-kasadya-light-gray p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Our Mission</h2>
              <p className="text-lg text-center">
                To connect quality event service providers with clients, while supporting local businesses and contributing to the economic growth of our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Core Values</h2>
          <p className="section-subtitle">
            These principles guide everything we do at Kasadya Marketplace
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-kasadya-purple font-semibold mb-2 block">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Kasadya Story</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2023, Kasadya Marketplace began with a simple observation: planning events in Davao del Norte was unnecessarily complicated. People were struggling to find reliable vendors, compare services, and book with confidence.
                </p>
                
                <p>
                  Our founder, Maria Gonzales, an experienced event planner herself, saw an opportunity to create a platform that would connect clients with trusted local service providers, making event planning simpler and more enjoyable.
                </p>
                
                <p>
                  The name "Kasadya" comes from the Cebuano word meaning "joy" or "celebration" – perfectly capturing our mission to bring happiness through successful events.
                </p>
                
                <p>
                  Today, Kasadya Marketplace is the premier platform for event services in Davao del Norte, helping thousands of clients create memorable celebrations while supporting local businesses.
                </p>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3" 
                alt="Kasadya team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            The passionate people behind Kasadya Marketplace
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-kasadya-purple mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
