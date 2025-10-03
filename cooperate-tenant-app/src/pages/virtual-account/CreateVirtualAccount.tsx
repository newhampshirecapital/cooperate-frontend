import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCreateVirtualAccountMutation } from '../../api/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateVirtualAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createVirtualAccount, { isLoading }] = useCreateVirtualAccountMutation();
  
  const [formData, setFormData] = useState({
    bvn: '',
    nin: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // BVN validation
    if (!formData.bvn) {
      newErrors.bvn = 'BVN is required';
    } else if (!/^\d{11}$/.test(formData.bvn)) {
      newErrors.bvn = 'BVN must be exactly 11 digits';
    }

    // NIN validation
    if (!formData.nin) {
      newErrors.nin = 'NIN is required';
    } else if (!/^\d{11}$/.test(formData.nin)) {
      newErrors.nin = 'NIN must be exactly 11 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createVirtualAccount({
        payload: {
          userId: user?._id || '',
          userName: user?.name || '',
          userEmail: user?.email || '',
          bvn: formData.bvn,
          nin: formData.nin,
        },
      }).unwrap();

      toast.success('Virtual account created successfully!', {
        description: 'You can now manage your finances and view your balance.',
      });

      // Navigate back to home page
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to create virtual account', {
        description: error?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-12">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Virtual Account
            </h1>
            <p className="text-gray-600">
              Set up your virtual bank account to manage your financial transactions
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Setup</CardTitle>
            <CardDescription>
              Please provide your Bank Verification Number and National Identification Number
              to create your virtual account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info Display */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Name:</span>
                    <span className="ml-2">{user?.name}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Email:</span>
                    <span className="ml-2">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* BVN Field */}
              <div className="space-y-2">
                <Label htmlFor="bvn" className="text-sm font-medium">
                  Bank Verification Number (BVN)
                </Label>
                <Input
                  id="bvn"
                  name="bvn"
                  type="text"
                  placeholder="Enter your 11-digit BVN"
                  value={formData.bvn}
                  onChange={handleInputChange}
                  className={errors.bvn ? 'border-red-500' : ''}
                  maxLength={11}
                />
                {errors.bvn && (
                  <p className="text-sm text-red-600">{errors.bvn}</p>
                )}
                <p className="text-xs text-gray-500">
                  Your BVN is required for identity verification
                </p>
              </div>

              {/* NIN Field */}
              <div className="space-y-2">
                <Label htmlFor="nin" className="text-sm font-medium">
                  National Identification Number (NIN)
                </Label>
                <Input
                  id="nin"
                  name="nin"
                  type="text"
                  placeholder="Enter your 11-digit NIN"
                  value={formData.nin}
                  onChange={handleInputChange}
                  className={errors.nin ? 'border-red-500' : ''}
                  maxLength={11}
                />
                {errors.nin && (
                  <p className="text-sm text-red-600">{errors.nin}</p>
                )}
                <p className="text-xs text-gray-500">
                  Your NIN is required for compliance
                </p>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Security Notice</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Your personal information is encrypted and securely stored</li>
                  <li>• We only use your BVN and NIN for identity verification</li>
                  <li>• All financial transactions are protected by bank-grade security</li>
                  <li>• Your data will never be shared with third parties</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Virtual Account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. We'll verify your BVN and NIN with the relevant authorities</p>
              <p>2. A virtual bank account will be created for you</p>
              <p>3. You'll receive your account details and can start using your wallet</p>
              <p>4. Your account balance will be displayed on your dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
