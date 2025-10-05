import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  ArrowLeft, 
  DollarSign, 
  Target, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListSavingsTargetsQuery, useContributeToSavingsTargetMutation } from '../api/api';
import { toast } from 'react-hot-toast';

const ContributionPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { targetId } = useParams();
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: savingsTargets } = useListSavingsTargetsQuery({ 
    id: user?.cooperateId as string 
  });
  const [contributeToSavingsTarget, { isLoading: isContributing }] = useContributeToSavingsTargetMutation();

  const targets = savingsTargets?.data || [];
  const target = targets.find((t: any) => t._id === targetId);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = Number(formData.amount);
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > target.targetAmount) {
      toast.error('Contribution amount cannot exceed target amount');
      return;
    }

    if (!user?.cooperateId) {
      toast.error('Unable to process contribution. Please ensure you are part of a cooperative.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        amount: formData.amount,
        cooperativeId: user.cooperateId,
        narration: formData.message || `Contribution to ${target.targetName}`,
        savingsTargetId: target._id
      };

      await contributeToSavingsTarget({
        payload,
        id: user._id || ''
      }).unwrap();
      
      toast.success('Contribution submitted successfully!');
      navigate('/');
      
    } catch (error: any) {
      console.error('Error processing contribution:', error);
      
      // Handle specific error messages
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.error?.data?.message) {
        toast.error(error.error.data.message);
      } else {
        toast.error('Failed to process contribution. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!target) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Target Not Found</h1>
            <p className="text-gray-600 mb-6">The savings target you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const suggestedAmounts = [
    target.targetAmount * 0.1, // 10%
    target.targetAmount * 0.25, // 25%
    target.targetAmount * 0.5,  // 50%
    target.targetAmount * 0.75  // 75%
  ].filter(amount => amount >= 1000); // Only show amounts >= ₦1,000

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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Make a Contribution
            </h1>
            <p className="text-gray-600">
              Support your cooperative's savings target
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Target Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Target className="w-5 h-5 text-purple-600" />
                Target Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{target.targetName}</h3>
                  <p className="text-gray-600 mt-1">
                    {target.targetDescription || 'Cooperative savings target'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target Amount</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ₦{target.targetAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {target.targetType}
                    </p>
                  </div>
                </div>

                {target.targetDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline: {new Date(target.targetDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contribution Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CreditCard className="w-5 h-5 text-green-600" />
                Contribution Details
              </CardTitle>
              <CardDescription>
                Enter your contribution amount and payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Contribution Amount (₦) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    min="100"
                    max={target.targetAmount}
                    disabled={isSubmitting || isContributing}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Minimum: ₦100 • Maximum: ₦{target.targetAmount.toLocaleString()}
                  </p>
                </div>

                {/* Suggested Amounts */}
                {suggestedAmounts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Quick Amounts
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestedAmounts.map((amount, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('amount', amount.toString())}
                          disabled={isSubmitting || isContributing}
                          className="text-sm"
                        >
                          ₦{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700">
                    Payment Method *
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    disabled={isSubmitting || isContributing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="card">Debit/Credit Card</SelectItem>
                      <SelectItem value="wallet">Wallet Transfer</SelectItem>
                     
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message 
                  </Label>
                  <Input
                    id="message"
                    placeholder="Add a message to your contribution..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    disabled={isSubmitting || isContributing}
                  />
                </div>


                {/* Important Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Important Information</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your contribution will be processed securely</li>
                        <li>• You'll receive a confirmation email after payment</li>
                        <li>• Progress will be updated in real-time</li>
                        <li>• Contact support if you encounter any issues</li>
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
                    disabled={isSubmitting || isContributing}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting || isContributing}
                  >
                    {(isSubmitting || isContributing) ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Contribute ₦{formData.amount ? Number(formData.amount).toLocaleString() : '0'}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContributionPayment;
