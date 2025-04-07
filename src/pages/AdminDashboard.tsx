import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, CheckCircle, Clock, DollarSign, Filter, Search, Shield, User, UserCheck, UserX } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, verifyUser } = useAuth();
  const { bookings, fetchBookings } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([user]);
  const [selectedTab, setSelectedTab] = useState('bookings');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [user, navigate, fetchBookings]);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter((booking) =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, bookings]);

  useEffect(() => {
    if (user) {
      setFilteredUsers([user].filter((u) =>
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      ));
    }
  }, [userSearchTerm, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await verifyUser(userId, isVerified);
      toast({
        title: "User Verification",
        description: `User ${isVerified ? 'verified' : 'unverified'} successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify user.",
      });
    }
  };

  const getVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge variant="success">
          <CheckCircle className="h-4 w-4 mr-1" />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-4 w-4 mr-1" />
          Unverified
        </Badge>
      );
    }
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <Button onClick={handleLogout} className="mb-4">Logout</Button>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList>
            <TabsTrigger value="bookings" onClick={() => setSelectedTab('bookings')}>Bookings</TabsTrigger>
            <TabsTrigger value="users" onClick={() => setSelectedTab('users')}>User Verification</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>Manage and view all bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Check-in Date</TableHead>
                      <TableHead>Check-out Date</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.email}</TableCell>
                        <TableCell>{booking.roomType}</TableCell>
                        <TableCell>{format(new Date(booking.checkInDate), 'PP')}</TableCell>
                        <TableCell>{format(new Date(booking.checkOutDate), 'PP')}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {booking.totalPrice}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Clock className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>User Verification</CardTitle>
                <CardDescription>Verify user identities to enhance booking security.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Verification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Shield className="h-4 w-4 mr-1" />
                            {user.isAdmin ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.createdAt), 'PP')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!user.isVerified ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => handleVerifyUser(user.id, true)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleVerifyUser(user.id, false)}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
