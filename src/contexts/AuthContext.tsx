
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
} | null;

interface AuthContextType {
  user: UserType;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'customer' | 'vendor') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

  // Mock login function - In a real app, this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic (replace with actual API call)
      if (email && password) {
        // In a real app, you would validate credentials against a backend
        const mockUser = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          name: email.split('@')[0],
          email,
          role: 'customer' as const,
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
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

  // Mock register function
  const register = async (name: string, email: string, password: string, role: 'customer' | 'vendor') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration logic (replace with actual API call)
      if (name && email && password) {
        const mockUser = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          name,
          email,
          role,
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast({
          title: "Registration successful",
          description: `Welcome to Kasadya Marketplace, ${name}!`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Registration failed",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
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

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
