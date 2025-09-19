import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { recentTransactions, stats } from '../../constants/stats';
import bgImage from '../../assets/bglogo2.jpg';
import { 
  Battery, 
  Sun, 
  Wind, 
  Zap, 
  Users, 
  Shield, 
  DollarSign, 
  Leaf, 
  ArrowRight, 
  Star,
  Heart,
  Globe,
  Lightbulb,
  BarChart3,
  MessageCircle,
  CreditCard,
  BellElectric,
  FileText,
  ZapIcon
} from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import { Navigate } from 'react-router-dom';
import { useGetUserCooperativesQuery } from '../../api/api';
import TariffRatesModal from '../../components/modals/TariffRatesModal';
import { useState } from 'react';

const HomePage = () => {
  const { user,  isLoading } = useAuth();
  const { data: cooperatives } = useGetUserCooperativesQuery();
 

  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  const cooperativeName = cooperatives?.data?.name;


  //check if cooperativeId is not null
  if (user?.cooperateId === null) {
    return <Navigate to="/request-membership" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-green-900/30"></div>
        
        <div className="relative container mx-auto px-6 py-8 md:py-12">
          {/* Main Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Welcome to <span className="bg-gradient-to-r from-blue-300 to-green-300 bg-clip-text text-transparent">
                {cooperativeName || 'EnergyCooperative'}
              </span>
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-6 max-w-2xl mx-auto drop-shadow-md">
              Empowering communities through sustainable energy solutions
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* User Status Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{user?.role === 'admin' ? 'Administrator' : 'Member'}</h3>
                <p className="text-xs text-gray-600">Account Type</p>
              </CardContent>
            </Card>

            {/* Membership Status Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Verified</h3>
                <p className="text-xs text-gray-600">Member Status</p>
              </CardContent>
            </Card>

            {/* Energy Usage Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                    <Battery className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">245 kWh</h3>
                <p className="text-xs text-gray-600">This Month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 text-sm font-semibold shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>
            <Button size="sm" variant="outline" className="border-white/50 text-gray-500 hover:bg-white/10 px-6 py-2 text-sm font-semibold backdrop-blur-sm">
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Quick Stats with Enhanced Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 px-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="text-center hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white relative overflow-hidden">
                {/* Decorative clipart */}
                <div className="absolute top-2 right-2 opacity-10">
                  {stat.title === 'Total Members' && <Users className="w-8 h-8 text-blue-400" />}
                  {stat.title === 'Energy Generated' && <Zap className="w-8 h-8 text-green-400" />}
                  {stat.title === 'Cost Savings' && <DollarSign className="w-8 h-8 text-yellow-400" />}
                  {stat.title === 'Carbon Reduced' && <Leaf className="w-8 h-8 text-emerald-400" />}
                </div>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center shadow-lg">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* About Cooperative Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Cooperative?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are more than just an energy solutions provider. We are a community-driven movement 
            towards sustainable living and energy independence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Renewable Energy</h3>
              <p className="text-gray-600">
                All our energy comes from clean, renewable sources including solar, wind, and hydro power.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lower Energy Costs</h3>
              <p className="text-gray-600">
                Save up to 30% on your energy bills through our cooperative pricing model and efficiency programs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Ownership</h3>
              <p className="text-gray-600">
                Own a stake in your energy future. Members have voting rights and share in cooperative profits.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliable Service</h3>
              <p className="text-gray-600">
                Enjoy 99.9% uptime with our advanced grid technology and 24/7 customer support.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Environmental Impact</h3>
              <p className="text-gray-600">
                Reduce your carbon footprint by 2.5 tons annually while supporting local renewable energy projects.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Technology</h3>
              <p className="text-gray-600">
                Access real-time energy data, smart home integration, and automated energy management tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Take Action Today</h2>
            <p className="text-blue-100 text-lg">Manage your energy, track your savings, and stay connected</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-20 bg-white hover:bg-gray-50 text-gray-900 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/bills'}
            >
              <CreditCard className="w-6 h-6" />
              <span className="font-semibold">View Bills</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-20 bg-white hover:bg-gray-50 text-gray-900 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/meters'}
            >
              <BellElectric className="w-6 h-6" />
              <span className="font-semibold">Manage Meters</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-20 bg-white hover:bg-gray-50 text-gray-900 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/notifications'}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-semibold">Messages</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-20 bg-white hover:bg-gray-50 text-gray-900 flex flex-col items-center gap-2"
              onClick={() => window.location.href = '/complaints'}
            >
              <FileText className="w-6 h-6" />
              <span className="font-semibold">Support</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-20 bg-white hover:bg-gray-50 text-gray-900 flex flex-col items-center gap-2"
              onClick={() => setIsTariffModalOpen(true)}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="font-semibold">Tariff Rates</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Energy Dashboard */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Your Energy Dashboard</h2>
          </div>
          <p className="text-gray-600">Monitor your energy usage and savings in real-time</p>
          
          {/* User Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Usage</p>
                  <p className="text-xl font-bold text-gray-900">245 kWh</p>
                </div>
                <Battery className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Savings This Month</p>
                  <p className="text-xl font-bold text-green-600">$45.20</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Carbon Saved</p>
                  <p className="text-xl font-bold text-emerald-600">12.5 kg</p>
                </div>
                <Leaf className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Bill Due</p>
                  <p className="text-xl font-bold text-orange-600">Dec 15</p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Energy Sources */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5" />
                Energy Generation Sources
              </CardTitle>
              <CardDescription>Your current renewable energy breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                      <Sun className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Solar Energy</p>
                      <p className="text-sm text-gray-600">Monthly Generation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">200kW</p>
                    <p className="text-sm text-green-600">+12%</p>
                  </div>
                </div>
                <Progress value={75} className="h-3" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                      <Wind className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Wind Energy</p>
                      <p className="text-sm text-gray-600">Weekly Generation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">25kW</p>
                    <p className="text-sm text-green-600">+8%</p>
                  </div>
                </div>
                <Progress value={45} className="h-3" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                      <Battery className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Storage Capacity</p>
                      <p className="text-sm text-gray-600">Daily Average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">10kW</p>
                    <p className="text-sm text-blue-600">+5%</p>
                  </div>
                </div>
                <Progress value={30} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Energy Activity
              </CardTitle>
              <CardDescription>Your latest energy transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'electricity Token' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'electricity Token' ? (
                          <Zap className="w-6 h-6 text-green-600" />
                        ) : (
                          <DollarSign className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.type === 'electricity Token' ? 'Purchased' : 'Contribution'} 
                          {transaction.from && ` from ${transaction.from}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{transaction.amount}</p>
                      <p className="text-sm text-gray-500">{transaction.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Transactions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Community Impact */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Community Impact</h2>
            <p className="text-gray-600">Together, we are making a difference</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ZapIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2,500+</h3>
              <p className="text-gray-600">Energy solutions provided</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15,000+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8/5</h3>
              <p className="text-gray-600">Member Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </div>
      
      <TariffRatesModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;