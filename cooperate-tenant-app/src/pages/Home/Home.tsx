import { useAuth } from '../../context/AuthContext';

import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { recentTransactions, stats } from '../../constants/stats';
import { Battery, Sun, Wind, TrendingUp } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

const HomePage = () => {
  const { user,  isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-blue-100">
              Here's your energy overview for today
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {user?.role === 'admin' ? 'Administrator' : 'Member'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="w-5 h-5" />
              Energy Sources
            </CardTitle>
            <CardDescription>Your current energy generation breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span>Monthly</span>
                </div>
                <span className="font-medium">200KW</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <span>Weekly</span>
                </div>
                <span className="font-medium">25KW</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-500" />
                  <span>Daily Average</span>
                </div>
                <span className="font-medium">10KW</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest energy trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'sold' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {transaction.type === 'sold' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-blue-600 rotate-180" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'sold' ? 'Sold' : 'Bought'} {transaction.amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.type === 'sold' ? 'to' : 'from'} {transaction.to || transaction.from}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.price}</p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};

export default HomePage;
