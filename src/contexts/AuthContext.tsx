import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from './NotificationContext';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  profileImage?: string;
  phone?: string;
  address?: string;
  dateJoined: string;
} | null;

interface AuthContextType {
  user: UserType;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'customer' | 'vendor') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<Omit<UserType, 'id'>>) => void;
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
  const { addNotification } = useNotifications();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage (for demo purposes)
      const storedUsers = localStorage.getItem('users');
      let users: any[] = [];
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        const foundUser = users.find(u => u.email === email);
        
        // In a real app, you would verify the password with bcrypt or similar
        if (foundUser && foundUser.password === password) {
          // Remove password before storing in state
          const { password: _, ...userWithoutPassword } = foundUser;
          
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          
          // Create a welcome back notification
          addNotification({
            userId: userWithoutPassword.id,
            title: "Welcome back!",
            message: `You've successfully logged in to Kasadya Marketplace.`,
            type: 'system'
          });
          
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          setIsLoading(false);
          return true;
        }
      }
      
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'customer' | 'vendor') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const storedUsers = localStorage.getItem('users');
      let users: any[] = [];
      
      if (storedUsers) {
        users = JSON.parse(storedUsers);
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          toast({
            title: "Registration failed",
            description: "Email already in use",
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }
      }
      
      // Create new user
      const newUser = {
        id: `user-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        password, // In a real app, you would hash this password
        role,
        phone: '',
        address: '',
        dateJoined: new Date().toISOString(),
      };
      
      // Add user to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Create a welcome notification
      addNotification({
        userId: userWithoutPassword.id,
        title: "Welcome to Kasadya Marketplace!",
        message: `Thank you for registering, ${name}! Start exploring our services and vendors.`,
        type: 'system'
      });
      
      toast({
        title: "Registration successful",
        description: `Welcome to Kasadya Marketplace, ${name}!`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
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
      description: "You have been logged out successfully",
    });
  };

  const updateUserProfile = (userData: Partial<Omit<UserType, 'id'>>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update user in users array
    const storedUsers = localStorage.getItem('users');
    
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, ...userData, password: u.password }; // Keep the password unchanged
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
