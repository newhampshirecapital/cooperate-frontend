import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  Battery, 
  Zap, 
  DollarSign, 
  ArrowRight, 
  BarChart3, 
  MessageCircle, 
  CreditCard, 
  BellElectric, 
  FileText,
  Wallet,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  ChevronRight,
  CheckCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGetUserCooperativesQuery, useGetUserMetersQuery, useGetVirtualAccountQuery, useGetWalletBalanceQuery } from '../../api/api';
import TariffRatesModal from '../../components/modals/TariffRatesModal';
import VirtualAccountModal from '../../components/VirtualAccountModal';
import { VirtualAccountDetails } from '../../components/VirtualAccountSidebox';
import bannerOne from '../../assets/banner1.png';

interface Stat {
  title: string;
  value: string;
  change: string;
  color: string;
  icon: any;
}

interface Transaction {
  id: number;
  type: string;
  amount: string;
  time: string;
  meterNumber: string;
}

interface WeeklyUsageData {
  name: string;
  usage: number;
  change: string;
  usageLevel: 'low' | 'medium' | 'high';
  percentage: number;
}

// This will be replaced with dynamic data from user meters
const getDefaultStats = () => [
  { title: 'Last Token', value: '0 kWh', change: 'No data', color: 'text-blue-600', icon: Zap },
  { title: 'Energy Consumed', value: '0 kWh', change: 'This month', color: 'text-green-600', icon: Battery },
  { title: 'Daily Average', value: '0 kWh', change: 'Per day', color: 'text-yellow-600', icon: BarChart3 },
  { title: 'Total Spent', value: '₦0', change: 'On tokens', color: 'text-emerald-600', icon: DollarSign },
];

// This will be replaced with actual transaction data from user meters
const getDefaultTransactions = () => [
  { id: 1, type: 'electricity Token', amount: '0 kWh', time: 'No recent purchases', meterNumber: 'No meters' },
  { id: 2, type: 'electricity Token', amount: '0 kWh', time: 'No recent purchases', meterNumber: 'No meters' },
  { id: 3, type: 'electricity Token', amount: '0 kWh', time: 'No recent purchases', meterNumber: 'No meters' },
];

// Generate weekly usage data - in a real app, this would come from actual meter readings
const getWeeklyUsageData = (): WeeklyUsageData[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Mock data - in a real app, this would be calculated from actual usage data
  const mockUsage = [12.5, 15.2, 18.7, 14.3, 16.8, 22.1, 19.4]; // kWh per day
  const mockChanges = ['+5%', '+12%', '+8%', '-3%', '+7%', '+15%', '+9%'];
  
  const maxUsage = Math.max(...mockUsage);
  
  return days.map((day, index) => {
    const usage = mockUsage[index];
    const change = mockChanges[index];
    const percentage = (usage / maxUsage) * 100;
    
    let usageLevel: 'low' | 'medium' | 'high';
    if (usage < 15) {
      usageLevel = 'low';
    } else if (usage < 20) {
      usageLevel = 'medium';
    } else {
      usageLevel = 'high';
    }
    
    return {
      name: day,
      usage: usage,
      change: change,
      usageLevel: usageLevel,
      percentage: percentage
    };
  });
};

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const userId = user?._id || '';
  const { data: cooperatives } = useGetUserCooperativesQuery({id: userId});
  const { data: userMeters } = useGetUserMetersQuery({ id: userId });
  const { data: virtualAccount } = useGetVirtualAccountQuery({ id: userId });
  
  const { data: walletBalance } = useGetWalletBalanceQuery({ id: userId });
  
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [showVirtualAccountSidebox, setShowVirtualAccountSidebox] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showFundConfirmationModal, setShowFundConfirmationModal] = useState(false);
  const navigate = useNavigate();

  // Show modal with 3-second delay when virtual account is null
  React.useEffect(() => {
    if (!isLoading && virtualAccount?.data === null && user && userId) {
      const timeoutId = setTimeout(() => {
        setShowVirtualAccountSidebox(true);
      }, 1000);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isLoading, virtualAccount, user, userId]);

  


  // Check if user doesn't have a virtual account
  const hasVirtualAccount = virtualAccount !== null && virtualAccount?.data;
  
 

  const cooperativeName = cooperatives?.data?.name;

  // Calculate energy usage stats from user meter data
  const calculateEnergyStats = () => {
    if (!userMeters?.data || userMeters.data.length === 0) {
      return getDefaultStats();
    }

    const meters = userMeters.data;
    
    // Mock calculations - in a real app, these would come from actual meter readings
    const lastTokenAmount = meters[0]?.lastTokenAmount || 0;
    const monthlyConsumption = meters.reduce((total: number, meter: any) => total + (meter.monthlyConsumption || 0), 0);
    const dailyAverage = monthlyConsumption / 30; // Assuming 30 days
    const totalSpent = meters.reduce((total: number, meter: any) => total + (meter.totalSpent || 0), 0);

    return [
      { 
        title: 'Last Token', 
        value: `${lastTokenAmount} kWh`, 
        change: meters[0]?.lastTokenDate ? 'Recent purchase' : 'No data', 
        color: 'text-blue-600', 
        icon: Zap 
      },
      { 
        title: 'Energy Consumed', 
        value: `${monthlyConsumption.toFixed(1)} kWh`, 
        change: 'This month', 
        color: 'text-green-600', 
        icon: Battery 
      },
      { 
        title: 'Daily Average', 
        value: `${dailyAverage.toFixed(1)} kWh`, 
        change: 'Per day', 
        color: 'text-yellow-600', 
        icon: BarChart3 
      },
      { 
        title: 'Total Spent', 
        value: `₦${totalSpent.toLocaleString()}`, 
        change: 'On tokens', 
        color: 'text-emerald-600', 
        icon: DollarSign 
      },
    ];
  };

  // Calculate recent transactions from user meter data
  const calculateRecentTransactions = () => {
    if (!userMeters?.data || userMeters.data.length === 0) {
      return getDefaultTransactions();
    }

    const meters = userMeters.data;
    
    // Mock transaction data - in a real app, this would come from actual transaction history
    return meters.slice(0, 3).map((meter: any, index: number) => ({
      id: index + 1,
      type: 'electricity Token',
      amount: `${meter.lastTokenAmount || 0} kWh`,
      time: meter.lastTokenDate ? new Date(meter.lastTokenDate).toLocaleDateString() : 'No recent purchases',
      meterNumber: meter.meterNumber || 'Unknown'
    }));
  };

  const stats = calculateEnergyStats();
  const recentTransactions = calculateRecentTransactions();

  if (user?.cooperateId === null) {
    navigate('/request-membership');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {virtualAccount?.data === null && (
        <p className="text-center p-1 text-gray-600">Please create your account to continue. <Button onClick={() => navigate('/create-virtual-account')} className="text-blue-200">Create Virtual Account</Button></p>
      )}
      {/* Hero Section */}
      <div className="bg-white py-16 md:py-24">
        
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Text and Actions */}
            <div className="lg:pr-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Welcome to <br className="hidden md:inline" />
                <span className="text-blue-600">{cooperativeName || 'EnergyCooperative'}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl">
                Empowering communities through sustainable energy solutions. We are a community-driven movement towards sustainable living and energy independence.
              </p>
              
              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  onClick={() => navigate('/transactions')}
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Side: Hero Image */}
            <div className="hidden lg:block">
              <img 
                src={bannerOne} 
                alt="A visual of sustainable energy infrastructure like solar panels and wind turbines" 
                className="rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fintech Account Overview Section */}
      <div className="bg-gray-50 py-8 -mt-16 md:-mt-24 z-10 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Account Overview</h2>
            <p className="text-gray-600">Manage your finances and contributions</p>
          </div>
          
          {/* Horizontal Scrollable Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Wallet Balance Card */}
            <div className="flex-shrink-0 w-80">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-100">Wallet Balance</h3>
                        <p className="text-xs text-blue-200">Available funds</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 p-2"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-3xl font-bold">
                      {showBalance ? (
                        new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                        }).format(walletBalance?.data?.balance || 0)
                      ) : (
                        '••••••'
                      )}
                    </p>
                    <p className="text-sm text-blue-200 mt-1">
                      {showBalance ? 'Current balance' : 'Tap to reveal'}
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/transactions')}
                  >
                    View Transactions
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Fund Account Card */}
            <div className="flex-shrink-0 w-80">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-100">Fund Account</h3>
                      <p className="text-xs text-green-200">Add money to wallet</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-lg font-semibold mb-2">Quick Funding</p>
                    <p className="text-sm text-green-200">
                      Add funds instantly to your wallet
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0 mb-3"
                    onClick={() => setShowAccountDetails(!showAccountDetails)}
                  >
                    {showAccountDetails ? 'Hide Details' : 'Show Account Details'}
                  </Button>
                  
                  {showAccountDetails && virtualAccount?.data && (
                    <div className="bg-white/10 rounded-lg p-3 mb-3">
                      <p className="text-xs text-green-200 mb-1">Account Number</p>
                      <p className="font-mono text-sm font-semibold">
                        {virtualAccount.data.accountNumber}
                      </p>
                      <p className="text-xs text-green-200 mt-1">Bank: {virtualAccount.data.bankName}</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => setShowFundConfirmationModal(true)}
                  >
                    I have sent the money
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Cooperative Contribution Card */}
            <div className="flex-shrink-0 w-80">
              <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-100">Transformer Funds</h3>
                      <p className="text-xs text-purple-200">Current contribution</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-2xl font-bold mb-1">
                      ₦{((user?.wallet || 0) * 0.1).toLocaleString()}
                    </p>
                    <p className="text-sm text-purple-200">
                      Monthly contribution
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-xs text-green-300">+5% this month</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3 mb-3">
                    <p className="text-xs text-purple-200 mb-1">Cooperative</p>
                    <p className="text-sm font-semibold">
                      {cooperatives?.data?.name || 'EnergyCooperative'}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">
                      Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  
                 
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Usage Tracking Section */}
      <div className="container mx-auto px-6 py-12 z-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Track Your Energy Usage</h2>
          <p className="text-lg text-gray-600">Monitor your electricity consumption and spending patterns</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat: Stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2">{stat.title}</p>
                  <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="container mx-auto px-6 py-12">
        {/* Virtual Account Section - Show only if user has virtual account */}
        {hasVirtualAccount && (
          <div className="mb-8">
            <VirtualAccountDetails 
              user={user} 
              virtualAccount={virtualAccount} 
              walletBalance={walletBalance}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Energy Activity */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                Recent Token Purchases
              </CardTitle>
              <CardDescription>Your latest electricity token purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'electricity Token' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'electricity Token' ? (
                          <Zap className="w-5 h-5" />
                        ) : (
                          <DollarSign className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.type}</p>
                        <p className="text-xs text-gray-600">
                          Meter: {transaction.meterNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{transaction.amount}</p>
                      <p className="text-xs text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200" onClick={() => navigate('/transactions')}>
                  View All Transactions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Energy Usage Chart */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                Weekly Energy Usage
              </CardTitle>
              <CardDescription>Your daily energy consumption patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weekly Chart */}
              <div className="space-y-4">
                {getWeeklyUsageData().map((day: WeeklyUsageData) => (
                  <div key={day.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                        <div className="w-16 text-sm font-medium text-gray-700">
                          {day.name}
                    </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{day.usage} kWh</span>
                            <span className={`text-xs font-medium ${day.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {day.change}
                            </span>
                    </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                day.usageLevel === 'high' ? 'bg-red-500' : 
                                day.usageLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${day.percentage}%` }}
                            ></div>
                  </div>
                </div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Usage Legend */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Low Usage</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Medium Usage</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>High Usage</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Action Buttons Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Cooperative Tools</h2>
            <p className="text-lg text-gray-600">Quickly access the features you need most</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <Button className="h-24 bg-blue-600 text-white hover:bg-blue-700 flex flex-col items-center gap-2" onClick={() => navigate('/bills')}>
              <CreditCard className="w-6 h-6" />
              <span className="font-semibold text-sm">View Bills</span>
            </Button>
            <Button className="h-24 bg-green-600 text-white hover:bg-green-700 flex flex-col items-center gap-2" onClick={() => navigate('/meters')}>
              <BellElectric className="w-6 h-6" />
              <span className="font-semibold text-sm">Manage Meters</span>
            </Button>
            <Button className="h-24 bg-gray-800 text-white hover:bg-gray-700 flex flex-col items-center gap-2" onClick={() => navigate('/notifications')}>
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold text-sm">Messages</span>
            </Button>
            <Button className="h-24 bg-yellow-600 text-white hover:bg-yellow-700 flex flex-col items-center gap-2" onClick={() => navigate('/complaints')}>
              <FileText className="w-6 h-6" />
              <span className="font-semibold text-sm">Support</span>
            </Button>
            <Button className="h-24 bg-purple-600 text-white hover:bg-purple-700 flex flex-col items-center gap-2" onClick={() => setIsTariffModalOpen(true)}>
              <BarChart3 className="w-6 h-6" />
              <span className="font-semibold text-sm">Tariff Rates</span>
            </Button>
          </div>
        </div>
      </div>

      <TariffRatesModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
      />
      
      {/* Virtual Account Modal - Show if user doesn't have virtual account */}
      {showVirtualAccountSidebox && virtualAccount?.data === null && (
        <VirtualAccountModal
          user={user}
          virtualAccount={virtualAccount}
          onClose={() => setShowVirtualAccountSidebox(false)}
        />
      )}

      {/* Fund Confirmation Modal */}
      {showFundConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Payment Confirmed
              </CardTitle>
              <CardDescription className="text-gray-600">
                Thank you for your payment. We're processing your transaction.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">What happens next?</h4>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You will receive a confirmation message shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Your wallet balance will be updated within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>You can start using your funds immediately after update</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="mb-2">If you experience any issues or have questions, please contact our admin team:</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>+234 800 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>support@energycooperative.com</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setShowFundConfirmationModal(false)}
                >
                  Got it
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/support')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
