import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Building2, 
  Target, 
  Plus, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGetCooperativeAccountQuery, useListSavingsTargetsQuery } from '../api/api';

const ContributionSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: cooperativeAccount, isLoading } = useGetCooperativeAccountQuery({ 
    id: user?.cooperateId as string 
  });
  const { data: savingsTargets, isLoading: savingsTargetsLoading } = useListSavingsTargetsQuery({ 
    id: user?.cooperateId as string 
  });

  const hasAccount = cooperativeAccount?.data;
  const account = cooperativeAccount?.data;

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Building2 className="w-5 h-5 text-blue-600" />
            Contribution Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Building2 className="w-5 h-5 text-blue-600" />
          Contribution Management
        </CardTitle>
        <CardDescription>
          Manage cooperative contributions and savings targets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Cooperative Account Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Cooperative Account
          </h3>
          
          {!hasAccount ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">Account Setup Required</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    Please set up your cooperative bank account to enable contribution management and member payments.
                  </p>
                 <Link to="/create-cooperative-account">
                 <Button 
                    
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Set Up Account
                  </Button>
                 </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-2">Account Active</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex items-center justify-between">
                      <span>Account Number:</span>
                      <span className="font-mono font-semibold">{account.accountNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bank:</span>
                      <span className="font-semibold">{account.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Account Name:</span>
                      <span className="font-semibold">{account.accountName}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Savings Targets Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Savings Targets
            </h3>
            <Button 
              onClick={() => navigate('/create-savings-target')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!hasAccount}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Target
            </Button>
          </div>

          {!hasAccount ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Set up your cooperative account first</p>
              <p className="text-sm text-gray-500">
                You need to configure your bank account before creating savings targets
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Mock savings targets - in real app, these would come from API */}
              <div className="grid gap-4">
                {/* Savings Targets from API */}
                {savingsTargetsLoading ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading savings targets...</p>
                  </div>
                ) : savingsTargets?.data && savingsTargets.data.length > 0 ? (
                  savingsTargets.data.map((target: any, index: number) => (
                    <div key={target._id || index} className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">{target.targetName}</h4>
                            <p className="text-sm text-blue-700">{target.targetDescription || 'No description'}</p>
                            <p className="text-sm text-blue-700 capitalize">{target.targetType} savings target</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-900">
                            ₦{Number(target.targetAmount).toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600">Target Amount</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-blue-800">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {target?.targetDate ? new Date(target.targetDate).toLocaleDateString() : 'No date set'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>25 members</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">
                      No savings targets created yet. Create your first target to start managing cooperative contributions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {hasAccount && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {savingsTargets?.data?.length || 0}
                </p>
                <p className="text-gray-600">Active Targets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ₦{savingsTargets?.data?.reduce((total: number, target: any) => total + Number(target.targetAmount || 0), 0).toLocaleString() || '0'}
                </p>
                <p className="text-gray-600">Total Target</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionSection;
