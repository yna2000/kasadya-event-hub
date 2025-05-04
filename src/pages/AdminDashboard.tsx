
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, CheckCircle2, XCircle, User, UserCheck, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, getAllUsers, getPendingVerificationUsers, verifyUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect if not admin
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }

    // Get users that need verification
    const pendingVerificationUsers = getPendingVerificationUsers();
    setPendingUsers(pendingVerificationUsers);

    // Get all users
    const users = getAllUsers();
    setAllUsers(users);

    // Load admin notifications
    const storedNotifications = localStorage.getItem('adminNotifications') || '[]';
    const notifications = JSON.parse(storedNotifications);
    setAdminNotifications(notifications);
  }, [user, navigate, getPendingVerificationUsers, getAllUsers]);

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    const success = await verifyUser(userId, isVerified);
    
    if (success) {
      // Update the pending users list
      const updatedPendingUsers = pendingUsers.filter(user => user.id !== userId);
      setPendingUsers(updatedPendingUsers);
      
      // Update the all users list
      const updatedAllUsers = allUsers.map(user => {
        if (user.id === userId) {
          return { ...user, isVerified };
        }
        return user;
      });
      setAllUsers(updatedAllUsers);
      
      toast({
        title: `User ${isVerified ? 'verified' : 'verification rejected'}`,
        description: `The user has been ${isVerified ? 'verified' : 'rejected'} successfully.`,
      });
      
      // Mark related notifications as read
      const updatedNotifications = adminNotifications.map(notification => {
        if (notification.userId === userId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      setAdminNotifications(updatedNotifications);
      localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = adminNotifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setAdminNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
  };

  // Count users by role
  const vendorCount = allUsers.filter(user => user.isVendor).length;
  const customerCount = allUsers.filter(user => !user.isVendor && !user.isAdmin).length;
  const pendingVerificationCount = pendingUsers.length;
  const unreadNotificationsCount = adminNotifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {unreadNotificationsCount > 0 && (
          <Badge className="bg-red-500">
            {unreadNotificationsCount} new {unreadNotificationsCount === 1 ? 'notification' : 'notifications'}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users" className="relative">
            Users
            {pendingVerificationCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {pendingVerificationCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotificationsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {vendorCount} vendors, {customerCount} customers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Verification
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingVerificationCount}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingUsers.filter(user => user.isVendor).length} vendors,{' '}
                  {pendingUsers.filter(user => !user.isVendor && !user.isAdmin).length} customers
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Activity
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {adminNotifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-blue-500">New</Badge>
                      )}
                    </div>
                  ))}
                  {adminNotifications.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
                Users awaiting account verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length > 0 ? (
                <div className="space-y-4">
                  {pendingUsers.slice(0, 3).map((pendingUser) => (
                    <div key={pendingUser.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{pendingUser.name}</p>
                        <p className="text-sm text-muted-foreground">{pendingUser.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={pendingUser.isVendor ? "bg-purple-500" : "bg-blue-500"}>
                            {pendingUser.isVendor ? "Vendor" : "Customer"}
                          </Badge>
                          {pendingUser.businessType && (
                            <Badge variant="outline">{pendingUser.businessType}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registered on {new Date(pendingUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleVerifyUser(pendingUser.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerifyUser(pendingUser.id, true)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No users awaiting verification
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and verify account requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending Verification ({pendingUsers.length})</TabsTrigger>
                  <TabsTrigger value="all">All Users ({allUsers.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  {pendingUsers.length > 0 ? (
                    <div className="space-y-6">
                      {pendingUsers.map((pendingUser) => (
                        <div key={pendingUser.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{pendingUser.name}</h3>
                              <p className="text-sm text-muted-foreground">{pendingUser.email}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={pendingUser.isVendor ? "bg-purple-500" : "bg-blue-500"}>
                                  {pendingUser.isVendor ? "Vendor" : "Customer"}
                                </Badge>
                                {pendingUser.businessType && (
                                  <Badge variant="outline">{pendingUser.businessType}</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleVerifyUser(pendingUser.id, false)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleVerifyUser(pendingUser.id, true)}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold">ID Information</p>
                              <p className="text-sm">{pendingUser.idType}: {pendingUser.idNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Registration Date</p>
                              <p className="text-sm">{new Date(pendingUser.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="font-medium text-lg">No Pending Verifications</h3>
                      <p className="text-muted-foreground">All users have been verified</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="overflow-auto max-h-[500px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-2">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{user.name}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <Badge className={
                                user.isAdmin ? "bg-yellow-500" : 
                                user.isVendor ? "bg-purple-500" : "bg-blue-500"
                              }>
                                {user.isAdmin ? "Admin" : user.isVendor ? "Vendor" : "Customer"}
                              </Badge>
                            </td>
                            <td className="p-2">
                              {user.isVerified ? (
                                <Badge className="bg-green-500">Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600 border-orange-200">Pending</Badge>
                              )}
                            </td>
                            <td className="p-2">
                              {!user.isAdmin && !user.isVerified && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => handleVerifyUser(user.id, true)}
                                  >
                                    Verify
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Management</CardTitle>
              <CardDescription>
                Monitor and manage all bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="font-medium text-lg">Booking Calendar</h3>
                <p className="text-muted-foreground">View the booking calendar for a detailed schedule</p>
                <Button className="mt-4" onClick={() => navigate('/admin-booking-calendar')}>
                  Open Booking Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                System notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminNotifications.length > 0 ? (
                <div className="space-y-4">
                  {adminNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && <Badge className="bg-blue-500">New</Badge>}
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg">No Notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
