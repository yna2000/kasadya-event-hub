
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useAuth();

  useEffect(() => {
    // Create admin user if it doesn't exist
    const createAdminUser = () => {
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      
      // Check if admin already exists
      const adminExists = users.some((user: any) => user.email === 'admin@kasadya.com');
      
      if (!adminExists) {
        // Create admin user
        const adminUser = {
          id: 'admin-user',
          name: 'Admin User',
          email: 'admin@kasadya.com',
          password: 'admin123',
          isAdmin: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Admin user created');
      }
    };
    
    createAdminUser();
  }, []);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      // Redirect is handled in the useEffect hook
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <p>Admin Login: admin@kasadya.com / admin123</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:text-blue-700">
                  Register now
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
