import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useVerifyOTPMutation } from '../../api/api';

export function VerifyOTPPage() {
  const navigate = useNavigate();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [verifyOTP, { isLoading, error: verifyError }] = useVerifyOTPMutation();
  
  const error = verifyError as any;

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      toast.error('Please enter all 4 digits');
      return;
    }

    try {
      console.log('Attempting to verify OTP...');
      const result: any = await verifyOTP({ otp: otpString }).unwrap();
      
      if (result?.success === true) {
        toast.success('Email verified successfully!');
        console.log('OTP verification result:', result);
        navigate('/login');
      }
    } catch (error: any) {
      console.log('OTP verification error:', error);
      toast.error(error?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = () => {
    navigate('/resendOtpPage');
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              ))}
            </div>
            
            {error && <p className="text-red-500 text-center">{error.message}</p>}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="link"
              onClick={handleResendOTP}
              className="text-primary hover:underline"
            >
              Resend OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}