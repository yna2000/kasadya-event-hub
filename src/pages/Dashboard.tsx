
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Calendar, CreditCard, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserNotifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  const userNotifications = getUserNotifications(user.id);
  
  // This would fetch from a real API in a production app
  const userBookings = [
    {
      id: 'booking-1',
      vendorName: 'Sunshine Catering',
      service: 'Full Catering Package',
      date: '2025-05-15',
      status: 'confirmed',
      price: 25000,
    },
    {
      id: 'booking-2',
      vendorName: 'Dream Photography',
      service: 'Wedding Photography Package',
      date: '2025-06-20',
      status: 'pending',
      price: 15000,
    }
  ];

  // This would fetch from a real API in a production app
  const paymentHistory = [
    {
      id: 'payment-1',
      date: '2025-04-01',
      amount: 5000,
      description: 'Deposit for Sunshine Catering',
      status: 'completed',
    },
    {
      id: 'payment-2',
      date: '2025-03-15',
      amount: 7500,
      description: 'Deposit for Dream Photography',
      status: 'completed',
    }
  ];

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Welcome, {user.name}
                </CardTitle>
                <CardDescription>Manage your account and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('overview')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('bookings')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Bookings
                  </Button>
                  <Button 
                    variant={activeTab === 'payments' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('payments')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payments
                  </Button>
                  <Button 
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === 'settings' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>Your account summary at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userBookings.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userBookings.filter(b => new Date(b.date) > new Date()).length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unread Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userNotifications.filter(n => !n.read).length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {userNotifications.slice(0, 3).map(notification => (
                      <div key={notification.id} className="flex items-start p-3 rounded-lg bg-gray-50">
                        <Bell className="h-5 w-5 text-kasadya-purple mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {userNotifications.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'bookings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>Manage your event services bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                      {userBookings.map(booking => (
                        <Card key={booking.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="font-semibold">{booking.vendorName}</h3>
                                <p className="text-sm text-gray-600">{booking.service}</p>
                                <p className="text-sm">Date: {new Date(booking.date).toLocaleDateString()}</p>
                              </div>
                              <div className="mt-2 md:mt-0 space-y-2">
                                <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </div>
                                <p className="font-medium text-right">₱{booking.price.toLocaleString()}</p>
                                <Button variant="outline" size="sm" className="w-full md:w-auto">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
                      <p className="mt-1 text-gray-500">You haven't made any bookings with vendors yet.</p>
                      <Button className="mt-4 bg-kasadya-purple hover:bg-kasadya-deep-purple">
                        Browse Vendors
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track your payments to vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {paymentHistory.map(payment => (
                        <div key={payment.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₱{payment.amount.toLocaleString()}</p>
                            <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No payment history</h3>
                      <p className="mt-1 text-gray-500">You haven't made any payments yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated with important information</CardDescription>
                  </div>
                  {userNotifications.some(n => !n.read) && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {userNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {userNotifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-kasadya-purple'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">{notification.message}</p>
                          <div className="mt-2 flex justify-between">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                              notification.type === 'booking' 
                                ? 'bg-green-100 text-green-800' 
                                : notification.type === 'payment'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {notification.type}
                            </span>
                            {!notification.read && (
                              <span className="text-xs text-kasadya-purple">New</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Bell className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                      <p className="mt-1 text-gray-500">You're all caught up!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your profile and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input defaultValue={user.email} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Account Type</label>
                          <Input defaultValue={user.role.charAt(0).toUpperCase() + user.role.slice(1)} disabled />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Member Since</label>
                          <Input defaultValue={user.dateJoined ? new Date(user.dateJoined).toLocaleDateString() : 'N/A'} disabled />
                        </div>
                      </div>
                      <Button className="mt-4 bg-kasadya-purple hover:bg-kasadya-deep-purple">
                        Save Changes
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Current Password</label>
                          <Input type="password" />
                        </div>
                        <div></div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">New Password</label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Confirm New Password</label>
                          <Input type="password" />
                        </div>
                      </div>
                      <Button className="mt-4" variant="outline">
                        Change Password
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Email notifications</label>
                          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">SMS notifications</label>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Marketing emails</label>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                      </div>
                      <Button className="mt-4" variant="outline">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
