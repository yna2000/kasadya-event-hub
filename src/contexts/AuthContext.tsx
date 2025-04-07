
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export type UserType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
  idType?: 'national_id' | 'passport' | 'drivers_license';
  idNumber?: string;
  isVerified?: boolean;
  createdAt: string;
  lastLogin: string;
};

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role?: string,
    idType?: string,
    idNumber?: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Create a local function to create notifications without using the NotificationContext
  const createNotification = (userId: string, title: string, message: string, type: 'booking' | 'payment' | 'system') => {
    // Get existing notifications from localStorage
    const storedNotifications = localStorage.getItem('notifications');
    let notifications = [];
    
    if (storedNotifications) {
      notifications = JSON.parse(storedNotifications);
    }
    
    // Create new notification
    const newNotification = {
      id: `notif-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    // Add to notifications array
    notifications = [newNotification, ...notifications];
    
    // Save back to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Show toast
    toast({
      title: title,
      description: message,
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo, we'll use local storage and simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const user = users.find((u: any) => u.email === email);
        
        if (user && user.password === password) {
          // Create a user object without the password
          const { password: _, ...userWithoutPassword } = user;
          
          // Update last login
          userWithoutPassword.lastLogin = new Date().toISOString();
          
          // Store in state and local storage
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          // Create a welcome back notification
          createNotification(
            userWithoutPassword.id,
            "Welcome back!",
            `You've successfully logged in to Kasadya Marketplace.`,
            'system'
          );
          
          toast({
            title: "Login successful",
            description: "Welcome back to Kasadya Marketplace!"
          });
          
          setIsLoading(false);
          return true;
        }
      }
      
      // If we get here, login failed
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string = 'customer',
    idType: string = 'national_id',
    idNumber: string = ''
  ) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For demo, we'll use local storage and simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('users') || '[]';
      const users = JSON.parse(storedUsers);
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        toast({
          title: "Registration failed",
          description: "Email already exists. Please use a different email or login.",
          variant: "destructive"
        });
        
        setIsLoading(false);
        return false;
      }
      
      // Create a new user
      const newUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        password,
        role,
        idType,
        idNumber,
        isVerified: false, // Initially set to false until admin verifies
        isAdmin: false, // Default to non-admin
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Add to users array and store
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store in state and local storage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Create a welcome notification
      createNotification(
        userWithoutPassword.id,
        "Welcome to Kasadya Marketplace!",
        `Thank you for registering, ${name}! Your ID verification is pending admin approval.`,
        'system'
      );
      
      toast({
        title: "Registration successful",
        description: "Welcome to Kasadya Marketplace! Your account is pending ID verification."
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
