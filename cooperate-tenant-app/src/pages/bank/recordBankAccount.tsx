import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  Building2, 
  CreditCard,  
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  useRecordCooperativeAccountMutation, 
  useGetBanksListQuery,
  useGetCooperativeAccountQuery 
} from '../../api/api';
import { toast } from 'react-hot-toast';

interface FormData {
  accountNumber: string;
  accountName: string;
  accountBank: string;
}

const RecordCooperativeAccount = () => {
  const { user } = useAuth();
  console.log(user);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    accountNumber: '',
    accountName: '',
    accountBank: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks
  const { data: banksData, isLoading: banksLoading } = useGetBanksListQuery();
  const { data: existingAccount } = useGetCooperativeAccountQuery({ 
    id: user?.cooperateId as string
  });
  const [recordAccount] = useRecordCooperativeAccountMutation();

  // Check if account already exists
  useEffect(() => {
    if (existingAccount?.data) {
      setFormData({
        accountNumber: existingAccount.data.accountNumber || '',
        accountName: existingAccount.data.accountName || '',
        accountBank: existingAccount.data.accountBank || ''
      });
    }
  }, [existingAccount]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{10}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Account number must be exactly 10 digits';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    } else if (formData.accountName.trim().length < 2) {
      newErrors.accountName = 'Account name must be at least 2 characters';
    }

    if (!formData.accountBank) {
      newErrors.accountBank = 'Please select a bank';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (!user?.cooperateId) {
      toast.error('Cooperative ID not found');
      return;
    }
 

    setIsSubmitting(true);

    try {
      const payload = {
        
        cooperateId: user.cooperateId as string,
        accountNumber: formData.accountNumber.trim(),
        accountName: formData.accountName.trim(),
        bankName: formData.accountBank,
        userId: user._id,
      };

      await recordAccount({ payload }).unwrap();
      
      toast.success('Bank account recorded successfully!');
      navigate('/admin-dashboard');
      
    } catch (error: any) {
      console.error('Error recording account:', error);
      toast.error(error?.data?.message || 'Failed to record bank account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const banks:any = banksData?.banks || [];
  const hasExistingAccount = existingAccount?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {hasExistingAccount ? 'Update Cooperative Bank Account' : 'Record Cooperative Bank Account'}
            </h1>
            <p className="text-gray-600">
              {hasExistingAccount 
                ? 'Update your cooperative\'s bank account details for member payments and transactions'
                : 'Set up your cooperative\'s bank account to receive member payments and manage transactions'
              }
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Bank Account Information
            </CardTitle>
            <CardDescription>
              Provide accurate bank account details for your cooperative
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
                  Account Number *
                </Label>
                <Input
                  id="accountNumber"
                  type="text"
                  placeholder="Enter 10-digit account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  className={`${errors.accountNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                  maxLength={10}
                />
                {errors.accountNumber && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accountNumber}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Enter the 10-digit account number without spaces or special characters
                </p>
              </div>

              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="accountName" className="text-sm font-medium text-gray-700">
                  Account Name *
                </Label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Enter account holder name"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange('accountName', e.target.value)}
                  className={`${errors.accountName ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.accountName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accountName}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  This should match the name on the bank account exactly
                </p>
              </div>

              {/* Bank Selection */}
              <div className="space-y-2">
                <Label htmlFor="accountBank" className="text-sm font-medium text-gray-700">
                  Bank *
                </Label>
                <Select
                  value={formData.accountBank}
                  onValueChange={(value) => handleInputChange('accountBank', value)}
                >
                  <SelectTrigger className={`${errors.accountBank ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banksLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading banks...
                        </div>
                      </SelectItem>
                    ) : banks.length > 0 ? (
                      banks.map((bank: any) => (
                        <SelectItem key={bank.code} value={bank.name}>
                          {bank.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-banks" disabled>
                        No banks available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.accountBank && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accountBank}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Select the bank where your cooperative account is held
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• This account will be used to receive payments from cooperative members</li>
                      <li>• Ensure all details are accurate to avoid payment delays</li>
                      <li>• You can update these details later if needed</li>
                      <li>• Contact support if you need assistance with account setup</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {hasExistingAccount ? 'Updating...' : 'Recording...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {hasExistingAccount ? 'Update Account' : 'Record Account'}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you're having trouble setting up your bank account, our support team is here to help.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/support')}
                  className="text-sm"
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/faq')}
                  className="text-sm"
                >
                  View FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecordCooperativeAccount;
