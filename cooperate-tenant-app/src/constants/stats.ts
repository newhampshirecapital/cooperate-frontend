import { DollarSign, HomeIcon, TrendingUp, Zap } from "lucide-react";

export   const stats = [
    {
      title: 'Total Energy Generated',
      value: '2,847 kWh',
      change: '+12%',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Energy Consumed',
      value: '1,923 kWh',
      change: '-5%',
      icon: HomeIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Energy Purchased',
      value: '924 kWh',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Requests',
      value: '$156.80',
      change: '+23%',
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  export const recentTransactions = [
    { id: 1, type: 'electricity Token', amount: '45 kWh', price: '$7.20', from: 'BEDC', time: '2 hours ago' },
    { id: 2, type: 'paid contribution', amount: '10000 Naira', price: '$3.68', from: 'Sarah Johnson', time: '4 hours ago' },
    { id: 3, type: 'electricity Token', amount: '45 kWh', price: '$10.72', to: 'Mike Wilson', time: '6 hours ago' },
  ];