
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, CreditCard, FileText, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBookings } from '@/contexts/BookingContext';
import { useNotifications } from '@/contexts/NotificationContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { bookings, processPayment } = useBookings();
  const { notifications, markAsRead, getUserNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState("bookings");

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const userBookings = bookings.filter(booking => 
    user.role === 'customer' 
      ? booking.customerId === user.id 
      : booking.vendorId === user.id
  );
  
  const userNotifications = getUserNotifications(user.id);

  const handlePayNow = async (bookingId: string) => {
    await processPayment(bookingId, 'credit_card');
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    // In a real app, you might navigate to the relevant section
    setActiveTab("bookings");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hello, {user.name}</h1>
            <p className="text-gray-600">
              {user.role === 'customer' 
                ? 'Manage your event bookings and payments' 
                : 'Manage your service bookings and business'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => logout()}
              variant="outline"
              className="mr-2"
            >
              Log Out
            </Button>
            {user.role === 'vendor' && (
              <Button className="bg-kasadya-purple hover:bg-kasadya-deep-purple">
                Add New Service
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="bookings" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
              {userNotifications.filter(n => !n.read).length > 0 && (
                <Badge className="h-5 w-5 flex items-center justify-center p-0 rounded-full bg-red-500">
                  {userNotifications.filter(n => !n.read).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {user.role === 'customer' ? 'Your Bookings' : 'Booking Requests'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600">No bookings yet</h3>
                      {user.role === 'customer' && (
                        <p className="mt-2 text-gray-500">
                          Start browsing our vendors and book your first event service.
                        </p>
                      )}
                      {user.role === 'vendor' && (
                        <p className="mt-2 text-gray-500">
                          No booking requests yet. Make sure your services are visible to customers.
                        </p>
                      )}
                      <Button 
                        className="mt-4 bg-kasadya-purple hover:bg-kasadya-deep-purple"
                        onClick={() => navigate('/vendors')}
                      >
                        {user.role === 'customer' ? 'Browse Vendors' : 'Manage Services'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBookings.map((booking) => (
                        <div 
                          key={booking.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="font-medium text-lg">
                                {user.role === 'customer' ? booking.vendorName : booking.customerName}
                              </h3>
                              <p className="text-gray-600">{booking.service}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
                                <span>Time: {booking.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col items-end">
                              <Badge className={`mb-2 ${
                                booking.status === 'pending' ? 'bg-yellow-500' :
                                booking.status === 'confirmed' ? 'bg-blue-500' :
                                booking.status === 'paid' ? 'bg-green-500' :
                                booking.status === 'completed' ? 'bg-kasadya-purple' :
                                'bg-red-500'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <p className="font-semibold">${booking.amount.toFixed(2)}</p>
                              
                              {user.role === 'customer' && booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  className="mt-2 bg-kasadya-gold text-black hover:bg-yellow-500"
                                  onClick={() => handlePayNow(booking.id)}
                                >
                                  <CreditCard className="h-4 w-4 mr-1" /> Pay Now
                                </Button>
                              )}
                              
                              {user.role === 'vendor' && booking.status === 'pending' && (
                                <div className="flex gap-2 mt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 border-red-500 hover:bg-red-50"
                                  >
                                    Decline
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-kasadya-purple hover:bg-kasadya-deep-purple"
                                  >
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {userNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
                    <p className="mt-2 text-gray-500">
                      You'll see updates about your bookings and payments here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-medium ${notification.read ? '' : 'font-semibold'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={
                            notification.type === 'booking' ? 'bg-blue-500' :
                            notification.type === 'payment' ? 'bg-green-500' : 'bg-gray-500'
                          }>
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                  <p className="mt-1 capitalize">{user.role}</p>
                </div>
                
                <div className="pt-4">
                  <Button className="mr-4 bg-kasadya-purple hover:bg-kasadya-deep-purple">
                    Update Profile
                  </Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
