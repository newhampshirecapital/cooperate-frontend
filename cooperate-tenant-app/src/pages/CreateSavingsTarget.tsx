import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { 
  Target, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Loader2,
  
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCreateSavingsTargetMutation } from '../api/api';
import { toast } from 'react-hot-toast';
import type { CreateSavingsTargetPayload, SavingsTargetType } from '../interface/auth';

interface FormData {
  targetName: string;
  targetDescription: string;
  targetAmount: string;
  targetType: string;
  targetDate: string;
}

const CreateSavingsTarget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    targetName: '',
    targetDescription: '',
    targetAmount: '',
    targetType: '',
    targetDate: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createTarget] = useCreateSavingsTargetMutation();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.targetName.trim()) {
      newErrors.targetName = 'Target name is required';
    } else if (formData.targetName.trim().length < 3) {
      newErrors.targetName = 'Target name must be at least 3 characters';
    }

    if (!formData.targetAmount.trim()) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(Number(formData.targetAmount)) || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid amount';
    }

    if (!formData.targetType) {
      newErrors.targetType = 'Please select a target type';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      if (selectedDate <= today) {
        newErrors.targetDate = 'Target date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    console.log(`Input change - Field: ${field}, Value: "${value}"`);
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
      const payload: CreateSavingsTargetPayload = {
        userId: user._id,
        cooperativeId: user.cooperateId,
        targetName: formData.targetName.trim(),
        targetDescription: formData.targetDescription.trim() || undefined,
        targetAmount: Number(formData.targetAmount),
        targetType: formData.targetType as unknown as SavingsTargetType,
        targetDate: new Date(formData.targetDate)
      };

      console.log('Form Data:', formData);
      console.log('Payload being sent:', payload);
      console.log('Target Amount:', formData.targetAmount, '->', Number(formData.targetAmount));

      await createTarget({ payload }).unwrap();
      
      toast.success('Savings target created successfully!');
      navigate('/admin-dashboard');
      
    } catch (error: any) {
      console.error('Error creating target:', error);
      toast.error(error?.data?.message || 'Failed to create savings target');
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetTypes = [
    { value: 'monthly', label: 'Monthly', description: 'Recurring monthly savings' },
    { value: 'quarterly', label: 'Quarterly', description: 'Recurring quarterly savings' },
    { value: 'yearly', label: 'Yearly', description: 'Recurring yearly savings' }
  ];

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
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Savings Target
            </h1>
            <p className="text-gray-600">
              Set up a new savings goal for your cooperative members
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Target className="w-5 h-5 text-purple-600" />
              Target Information
            </CardTitle>
            <CardDescription>
              Define your cooperative's savings goals and objectives
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target Name */}
              <div className="space-y-2">
                <Label htmlFor="targetName" className="text-sm font-medium text-gray-700">
                  Target Name *
                </Label>
                <Input
                  id="targetName"
                  type="text"
                  placeholder="e.g., Emergency Fund, Infrastructure Upgrade"
                  value={formData.targetName}
                  onChange={(e) => handleInputChange('targetName', e.target.value)}
                  className={`${errors.targetName ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.targetName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetName}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Give your savings target a clear, descriptive name
                </p>
              </div>

              {/* Target Description */}
              <div className="space-y-2">
                <Label htmlFor="targetDescription" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="targetDescription"
                  placeholder="Describe the purpose and benefits of this savings target..."
                  value={formData.targetDescription}
                  onChange={(e) => handleInputChange('targetDescription', e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Optional: Provide more details about this savings goal
                </p>
              </div>

              {/* Target Amount */}
              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-sm font-medium text-gray-700">
                  Target Amount (₦) *
                </Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="Enter target amount"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                  className={`${errors.targetAmount ? 'border-red-500 focus:border-red-500' : ''}`}
                  
                />
                {errors.targetAmount && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetAmount}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Enter the total amount you want to save
                </p>
              </div>

              {/* Target Type */}
              <div className="space-y-2">
                <Label htmlFor="targetType" className="text-sm font-medium text-gray-700">
                  Target Type *
                </Label>
                <Select
                  value={formData.targetType}
                  onValueChange={(value) => handleInputChange('targetType', value)}
                >
                  <SelectTrigger className={`${errors.targetType ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Select target type" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.targetType && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetType}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Choose how often members should contribute to this target
                </p>
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-sm font-medium text-gray-700">
                  Target Date *
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                  className={`${errors.targetDate ? 'border-red-500 focus:border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.targetDate && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetDate}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  When do you want to achieve this savings target?
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">Important Information</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• This target will be visible to all cooperative members</li>
                      <li>• Members can contribute to this target based on the selected type</li>
                      <li>• You can modify or delete targets later if needed</li>
                      <li>• Progress will be tracked automatically</li>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Create Target
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
                Learn more about creating effective savings targets for your cooperative.
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

export default CreateSavingsTarget;
