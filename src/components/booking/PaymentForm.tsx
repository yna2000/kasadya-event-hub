
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from '@/hooks/use-toast';
import PaymentMethodSelection from './PaymentMethodSelection';

interface PaymentFormProps {
  bookingId: string;
  serviceName: string;
  vendorName: string;
  totalAmount: number;
  onSuccess?: () => void;
}

const paymentSchema = z.object({
  cardName: z.string().min(3, { message: 'Name on card is required' }),
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Card number must be 16 digits' }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Format must be MM/YY' }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits' }),
  amount: z.number().positive({ message: 'Amount must be positive' }),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  serviceName,
  vendorName,
  totalAmount,
  onSuccess,
}) => {
  const { processPayment } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya' | 'bank' | 'cash'>('cash');

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      amount: totalAmount,
    }
  });

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      const success = await processPayment(bookingId, data.amount, paymentMethod);
      
      if (success) {
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was a problem processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry date with /
  const formatExpiryDate = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value.length > 2) {
      return value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    return value;
  };

  return (
    
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">{serviceName}</p>
          <p className="text-sm text-gray-600">Provided by {vendorName}</p>
          <p className="text-lg font-semibold text-kasadya-purple mt-2">Total: ₱{totalAmount.toLocaleString()}</p>
        </div>
        
        <div className="mb-6">
          <PaymentMethodSelection 
            selectedMethod={paymentMethod}
            onMethodChange={(method) => setPaymentMethod(method as 'gcash' | 'maya' | 'bank' | 'cash')}
          />
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="4111 1111 1111 1111"
                      maxLength={19}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^\d*$/.test(value) && value.length <= 16) {
                          e.target.value = formatCardNumber(value);
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        maxLength={5}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\//g, '');
                          if (/^\d*$/.test(value) && value.length <= 4) {
                            e.target.value = formatExpiryDate(value);
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value) && value.length <= 4) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₱</span>
                      <Input
                        type="number"
                        className="pl-7"
                        {...field}
                        value={value}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          onChange(isNaN(newValue) ? 0 : newValue);
                        }}
                        min={0}
                        max={totalAmount}
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500">You can pay the full amount or make a partial payment.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex flex-col space-y-2 px-0">
              <Button 
                type="submit" 
                className="w-full bg-kasadya-purple hover:bg-kasadya-deep-purple"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Payment...' : `Pay Now with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Your payment information is secure and encrypted. We do not store your card details.
              </p>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
