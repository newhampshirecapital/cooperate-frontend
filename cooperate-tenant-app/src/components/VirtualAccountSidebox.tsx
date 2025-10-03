import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CreditCard, ArrowRight, Wallet, Eye, EyeOff } from 'lucide-react';
import bannerOne from '../assets/homepageimg2.png';

interface VirtualAccountSideboxProps {
  user: any;
  virtualAccount: any;
  onClose: () => void;
}

const VirtualAccountSidebox: React.FC<VirtualAccountSideboxProps> = ({ 
  

  onClose 
}) => {
  const navigate = useNavigate();
  

  const handleCreateVirtualAccount = () => {
    // Navigate to virtual account creation page
    navigate('/create-virtual-account');
  };

  

  


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Set Up Your Virtual Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create your secure virtual account to access exclusive cooperative benefits, manage payments, and track your energy savings.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Benefits Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Unlock These Exclusive Benefits:</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-800">Secure Virtual Bank Account</span>
                  <p className="text-xs text-gray-500 mt-1">Get your own account number for easy fund transfers and payments</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-800">Real-time Balance Tracking</span>
                  <p className="text-xs text-gray-500 mt-1">Monitor your wallet balance and transaction history instantly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-800">Instant Payment Processing</span>
                  <p className="text-xs text-gray-500 mt-1">Pay for electricity tokens and cooperative fees seamlessly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-800">Cooperative Rewards Program</span>
                  <p className="text-xs text-gray-500 mt-1">Earn points and discounts on energy purchases and services</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-medium text-gray-800">Priority Customer Support</span>
                  <p className="text-xs text-gray-500 mt-1">Get faster assistance and dedicated support for account holders</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleCreateVirtualAccount}
          >
            Create Your Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Later Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Account Details Component for when user has virtual account
export const VirtualAccountDetails: React.FC<{
  user: any;
  virtualAccount: any;
  walletBalance?: any;
}> = ({  virtualAccount, walletBalance }) => {
  const [showBalance, setShowBalance] = React.useState(false);

  if (!virtualAccount?.data) {
    return null;
  }

  const account = virtualAccount.data;
  const balance = walletBalance?.data?.balance || 0;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image section */}
        <div className="md:w-1/3 flex-shrink-0">
          <img src={bannerOne} alt="Virtual Account" className="w-full h-48 md:h-full object-cover" />
        </div>
        
        {/* Content section */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                Your Cooperative Account
              </h3>
              <p className="text-blue-100 text-sm">
                Manage your energy payments, track savings, and access exclusive member benefits
              </p>
            </div>
            
            <div className="space-y-4">
        {/* Account Number */}
        <div>
          <p className="text-xs text-blue-100 mb-1">Account Number</p>
          <p className="font-mono text-lg font-semibold">
            {account.accountNumber || 'N/A'}
          </p>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-100 mb-1">Available Balance</p>
            <p className="text-2xl font-bold">
              {showBalance ? (
                new Intl.NumberFormat('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                }).format(balance)
              ) : (
                '••••••'
              )}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>

              {/* Bank Name */}
              <div>
                <p className="text-xs text-blue-100 mb-1">Bank</p>
                <p className="font-semibold">{account.bankName || 'Not Available'}</p>
              </div>

              {/* Account Status */}
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-100 mb-1">Account Status</p>
                    <p className="text-sm font-semibold text-green-300">Active & Verified</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-100 mb-1">Member Since</p>
                    <p className="text-sm font-semibold">
                      {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Info */}
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-2">💡 Quick Tip:</p>
                <p className="text-xs text-blue-100">
                  Use this account number to receive payments from family, friends, or employers. 
                  All funds are instantly available for energy purchases and cooperative services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VirtualAccountSidebox;
