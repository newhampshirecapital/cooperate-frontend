import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useListSavingsTargetsQuery } from '../api/api';

interface SavingsTarget {
  _id: string;
  targetName: string;
  targetDescription?: string;
  targetAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  targetProgress: number;
  progressPercentage: number;
  status: string;
  targetType: string;
  targetDate?: string;
  createdAt: string;
  cooperativeId: string;
  userId: string;
}

const SavingsTargetsSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: savingsTargets, isLoading } = useListSavingsTargetsQuery({ 
    id: user?.cooperateId as string 
  });

  const targets: SavingsTarget[] = savingsTargets?.data || [];

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'quarterly':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'yearly':
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTargetColor = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'quarterly':
        return 'from-green-50 to-green-100 border-green-200';
      case 'yearly':
        return 'from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getTargetTextColor = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return 'text-blue-900';
      case 'quarterly':
        return 'text-green-900';
      case 'yearly':
        return 'text-purple-900';
      default:
        return 'text-gray-900';
    }
  };

  const formatTargetDate = (dateString?: string) => {
    if (!dateString) return 'No deadline set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleViewDetails = (target: SavingsTarget) => {
    navigate(`/savings-target/${target._id}`);
  };

  const handleContribute = (target: SavingsTarget) => {
    navigate(`/contribute/${target._id}`);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5 text-purple-600" />
            Active Savings Targets
          </CardTitle>
          <CardDescription>
            Current cooperative savings goals and contribution opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5 text-purple-600" />
            Active Savings Targets
          </CardTitle>
          <CardDescription>
            Current cooperative savings goals and contribution opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {targets.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No active savings targets</p>
              <p className="text-sm text-gray-400">
                Check back later for new cooperative savings opportunities
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {targets.map((target) => {
                return (
                  <div key={target._id} className={`bg-gradient-to-r ${getTargetColor(target.targetType)} border rounded-lg p-4`}>
                    <div className="flex flex-col md:flex-row items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="hidden md:flex w-10 h-10 bg-white/50 rounded-full items-center justify-center">
                          {getTargetIcon(target.targetType)}
                        </div>
                        <div>
                          <h4 className={`font-semibold ${getTargetTextColor(target.targetType)}`}>
                            {target.targetName}
                          </h4>
                          <p className={`text-sm ${getTargetTextColor(target.targetType)} opacity-80`}>
                            {target.targetDescription || 'Cooperative savings target'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {target.targetType.charAt(0).toUpperCase() + target.targetType.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {formatTargetDate(target.targetDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left mt-1 md:text-right">
                        <p className={`text-lg font-bold ${getTargetTextColor(target.targetType)}`}>
                          {formatCurrency(target.targetProgress)} / {formatCurrency(target.targetAmount)}
                        </p>
                        <p className="text-xs opacity-80">{(target.targetProgress /target.targetAmount * 100).toFixed(1)}% Complete</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                  

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(target)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleContribute(target)}
                        className={`flex-1 ${
                          target.targetType === 'monthly' ? 'bg-blue-600 hover:bg-blue-700' :
                          target.targetType === 'quarterly' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Contribute
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SavingsTargetsSection;
