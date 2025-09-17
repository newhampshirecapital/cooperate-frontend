import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useRegisterMutation } from '../../api/api';
import { PinVerificationModal } from '../../components/modals/PinVerificationModal';




export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerMutation, { isLoading, error: registerError }] = useRegisterMutation();
  
  // PIN verification states
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [showPinModal, setShowPinModal] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const error = registerError as any;
  
  // PIN verification handlers
  const handlePinSuccess = () => {
    setIsPinVerified(true);
    setShowPinModal(false);
    toast.success('PIN verified! You can now register.');
  };

  const handleMaxAttemptsReached = () => {
    setIsBlocked(true);
    setShowPinModal(false);
    toast.error('Maximum PIN attempts reached. Please contact support.');
    // Redirect to support or show support contact info
    setTimeout(() => {
      navigate('/support');
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name || !phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
    
      const result: any = await registerMutation({ email, password, name, phone }).unwrap();
      
      if (result?.success === true) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-otp');
      }
    } catch (error: any) {
      console.log('Registration error:', error);
      toast.error(error?.data?.message || 'Registration failed. Please try again.');
    }
  };

  // Show blocked message if max attempts reached
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Maximum PIN verification attempts exceeded. Please contact support for assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/support')} 
              className="w-full mb-4"
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')} 
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      {/* PIN Verification Modal */}
      <PinVerificationModal
        isOpen={showPinModal}
        onSuccess={handlePinSuccess}
        onMaxAttemptsReached={handleMaxAttemptsReached}
        attempts={pinAttempts}
        maxAttempts={3}
        onAttemptUpdate={setPinAttempts}
      />
      
      {/* Register Form - only show if PIN is verified */}
      {isPinVerified && (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Register as an admin to start your energy cooperative
            </CardDescription>
          </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
               disabled={isLoading}
              />
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               disabled={isLoading}
              />
              {error && <p className="text-red-500">{error.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
               disabled={isLoading}
              />
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                 disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
                {error && <p className="text-red-500">{error.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                 disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                {error && <p className="text-red-500">{error.message}</p>}

              </div>
            </div>
            
            
              <Button type="submit" className="w-full cursor-pointer hover:bg-blue-900" disabled={isLoading}
              >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
        </Card>
      )}
    </div>
  );
}