
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ServiceUploadForm from '@/components/vendor/ServiceUploadForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ServicePostingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and is a vendor
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Check if user is a vendor
    if (!user.isVendor) {
      toast({
        title: "Access Denied",
        description: "Only vendors can post services.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    // Check if vendor is verified
    if (!user.isVerified) {
      toast({
        title: "Account Not Verified",
        description: "Your account needs to be verified by an admin before you can post services.",
        variant: "destructive",
      });
      // Still allow them to stay on page, but they'll see a warning
    }
  }, [user, navigate, toast]);

  // Handler for successful service submission
  const handleSuccess = () => {
    toast({
      title: "Service Submitted",
      description: "Your service has been submitted for admin approval.",
    });
    
    // Create a delay before navigating
    setTimeout(() => {
      navigate('/vendor-dashboard');
    }, 1500);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Post a New Service</h1>

      {user && !user.isVerified && (
        <Alert className="bg-yellow-50 mb-6 border-yellow-300">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Account Pending Verification</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your account is pending verification by an administrator. You can create services now, but they won't be published until your account is verified.
          </AlertDescription>
        </Alert>
      )}

      {user && user.isVerified && (
        <Alert className="bg-blue-50 mb-6 border-blue-300">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Service Approval Process</AlertTitle>
          <AlertDescription className="text-blue-700">
            All services require admin approval before they appear in the marketplace. You'll be notified once your service is approved.
          </AlertDescription>
        </Alert>
      )}

      {user && (
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <ServiceUploadForm onSuccess={handleSuccess} />
        </div>
      )}

      {!user && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            Please log in as a vendor to post services.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/login')}>Log In</Button>
            <Button variant="outline" onClick={() => navigate('/register')}>Register as Vendor</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePostingPage;
