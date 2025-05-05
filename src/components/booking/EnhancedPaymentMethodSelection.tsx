
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Banknote, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  logo?: string;
}

interface PaymentMethodSelectionProps {
  onSelectMethod: (method: string) => void;
  selectedMethod: string;
  onBack: () => void;
  onCancel: () => void;
  onContinue: () => void;
}

export const EnhancedPaymentMethodSelection = ({ 
  onSelectMethod, 
  selectedMethod,
  onBack,
  onCancel,
  onContinue
}: PaymentMethodSelectionProps) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'gcash',
      name: 'GCash',
      icon: <Wallet size={24} />,
      description: 'Fast and secure mobile payment',
      color: 'bg-blue-500',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/GCash_Logo.png'
    },
    {
      id: 'maya',
      name: 'Maya',
      icon: <CreditCard size={24} />,
      description: 'Pay with Maya digital wallet',
      color: 'bg-green-500',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/PayMaya_Logo.png'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Banknote size={24} />,
      description: 'Direct bank transfer',
      color: 'bg-purple-500'
    },
    {
      id: 'cash',
      name: 'Cash',
      icon: <Banknote size={24} />,
      description: 'Pay with cash on arrival',
      color: 'bg-yellow-500'
    }
  ];

  // Make sure a payment method is selected before allowing to continue
  const handleContinue = () => {
    if (selectedMethod) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={cn(
              "p-4 cursor-pointer transition-all border-2",
              selectedMethod === method.id 
                ? "border-kasadya-purple bg-purple-50" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onSelectMethod(method.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white",
                method.color
              )}>
                {method.logo ? (
                  <img 
                    src={method.logo} 
                    alt={method.name} 
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  method.icon
                )}
              </div>
              <div>
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-500">{method.description}</div>
              </div>
              {selectedMethod === method.id && (
                <div className="ml-auto">
                  <div className="w-4 h-4 rounded-full bg-kasadya-purple"></div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="pt-4 border-t mt-6">
        <h4 className="text-sm font-medium mb-2">Payment Instructions:</h4>
        {selectedMethod === 'gcash' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
            <p className="font-medium">GCash Payment Instructions:</p>
            <ol className="list-decimal ml-4 mt-2">
              <li>Open your GCash app</li>
              <li>Tap on 'Send Money'</li>
              <li>Enter recipient number: 09XX-XXX-XXXX</li>
              <li>Enter the exact amount</li>
              <li>Include your booking reference in the notes</li>
              <li>Take a screenshot of your payment confirmation</li>
            </ol>
          </div>
        )}
        {selectedMethod === 'maya' && (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
            <p className="font-medium">Maya Payment Instructions:</p>
            <ol className="list-decimal ml-4 mt-2">
              <li>Open your Maya app</li>
              <li>Select 'Send Money'</li>
              <li>Enter recipient account: kasadya@events.com</li>
              <li>Enter the exact amount</li>
              <li>Include your booking reference in the notes</li>
              <li>Submit your payment receipt</li>
            </ol>
          </div>
        )}
        {selectedMethod === 'bank' && (
          <div className="bg-purple-50 border border-purple-200 rounded p-4 text-sm">
            <p className="font-medium">Bank Transfer Instructions:</p>
            <ol className="list-decimal ml-4 mt-2">
              <li>Transfer to our account:</li>
              <li>Bank: Kasadya Bank</li>
              <li>Account Number: 1234-5678-9012</li>
              <li>Account Name: Kasadya Events</li>
              <li>Include your booking reference in the notes</li>
              <li>Upload your payment slip</li>
            </ol>
          </div>
        )}
        {selectedMethod === 'cash' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
            <p className="font-medium">Cash Payment Instructions:</p>
            <ol className="list-decimal ml-4 mt-2">
              <li>Prepare the exact amount</li>
              <li>Pay on the event day or at our office</li>
              <li>A receipt will be provided</li>
              <li>Please note that a booking is only fully confirmed after payment</li>
            </ol>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="bg-kasadya-purple hover:bg-kasadya-deep-purple"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
