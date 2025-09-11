import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useResendOTPMutation } from '../../api/api';

export function ResendOTPPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resendOTP, { isLoading, error: resendError }] = useResendOTPMutation();
  
  const error = resendError as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
   
      const result: any = await resendOTP({ email }).unwrap();
      
      if (result?.success === true) {
        toast.success('OTP sent successfully! Please check your email.');
        console.log('Resend OTP result:', result);
        navigate('/verify-otp');
      }
    } catch (error: any) {
      console.log('Resend OTP error:', error);
      toast.error(error?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Resend OTP</CardTitle>
          <CardDescription>
            Enter your email address to receive a new verification code
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
            
            <Button type="submit" className="w-full cursor-pointer hover:bg-blue-900" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Remember your OTP?{' '}
              <Link
                to="/verify-otp"
                className="text-primary hover:underline"
              >
                Verify OTP
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResendOTPPage;
