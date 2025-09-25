import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Download, 
  Zap, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Receipt,
  Eye,
  RefreshCw
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'electricity_token' | 'payment' | 'refund' | 'maintenance';
  date: string;
  time: string;
  amount: string;
  units?: string;
  meterNumber?: string;
  status: 'successful' | 'pending' | 'failed' | 'cancelled';
  reference: string;
  description: string;
  paymentMethod?: string;
  electricityCompany?: string;
}

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Dummy transaction data
  const dummyTransactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'electricity_token',
      date: '2024-01-15',
      time: '14:30',
      amount: '₦5,000.00',
      units: '250 kWh',
      meterNumber: '20012345678',
      status: 'successful',
      reference: 'REF123456789',
      description: 'Electricity token purchase',
      paymentMethod: 'Bank Transfer',
      electricityCompany: 'Eko Electricity'
    },
    {
      id: 'TXN002',
      type: 'electricity_token',
      date: '2024-01-12',
      time: '09:15',
      amount: '₦3,000.00',
      units: '150 kWh',
      meterNumber: '20012345678',
      status: 'successful',
      reference: 'REF987654321',
      description: 'Electricity token purchase',
      paymentMethod: 'Card Payment',
      electricityCompany: 'Eko Electricity'
    },
    {
      id: 'TXN003',
      type: 'electricity_token',
      date: '2024-01-10',
      time: '16:45',
      amount: '₦2,000.00',
      units: '100 kWh',
      meterNumber: '20087654321',
      status: 'failed',
      reference: 'REF456789123',
      description: 'Electricity token purchase',
      paymentMethod: 'Bank Transfer',
      electricityCompany: 'Ikeja Electricity'
    },
    {
      id: 'TXN004',
      type: 'payment',
      date: '2024-01-08',
      time: '11:20',
      amount: '₦1,500.00',
      status: 'successful',
      reference: 'REF789123456',
      description: 'Monthly cooperative contribution',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN005',
      type: 'electricity_token',
      date: '2024-01-05',
      time: '08:30',
      amount: '₦4,500.00',
      units: '225 kWh',
      meterNumber: '20012345678',
      status: 'pending',
      reference: 'REF321654987',
      description: 'Electricity token purchase',
      paymentMethod: 'Card Payment',
      electricityCompany: 'Eko Electricity'
    },
    {
      id: 'TXN006',
      type: 'refund',
      date: '2024-01-03',
      time: '13:15',
      amount: '₦1,000.00',
      status: 'successful',
      reference: 'REF654321789',
      description: 'Refund for failed transaction',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN007',
      type: 'electricity_token',
      date: '2024-01-01',
      time: '19:45',
      amount: '₦6,000.00',
      units: '300 kWh',
      meterNumber: '20087654321',
      status: 'successful',
      reference: 'REF147258369',
      description: 'Electricity token purchase',
      paymentMethod: 'Bank Transfer',
      electricityCompany: 'Ikeja Electricity'
    },
    {
      id: 'TXN008',
      type: 'maintenance',
      date: '2023-12-28',
      time: '10:00',
      amount: '₦500.00',
      status: 'successful',
      reference: 'REF963852741',
      description: 'Meter maintenance fee',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN009',
      type: 'electricity_token',
      date: '2023-12-25',
      time: '15:30',
      amount: '₦3,500.00',
      units: '175 kWh',
      meterNumber: '20012345678',
      status: 'cancelled',
      reference: 'REF852741963',
      description: 'Electricity token purchase',
      paymentMethod: 'Card Payment',
      electricityCompany: 'Eko Electricity'
    },
    {
      id: 'TXN010',
      type: 'payment',
      date: '2023-12-20',
      time: '12:00',
      amount: '₦2,000.00',
      status: 'successful',
      reference: 'REF741852963',
      description: 'Annual membership fee',
      paymentMethod: 'Bank Transfer'
    }
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = dummyTransactions.filter(transaction => {
    const matchesSearch = transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.meterNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= yearAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'successful':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Successful</Badge>;
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>;
      case 'failed':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Failed</Badge>;
      case 'cancelled':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Cancelled</Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electricity_token':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'maintenance':
        return <Receipt className="w-4 h-4 text-purple-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'electricity_token':
        return 'Electricity Token';
      case 'payment':
        return 'Payment';
      case 'refund':
        return 'Refund';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all your electricity and payment transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{dummyTransactions.length}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dummyTransactions.filter(t => t.status === 'successful').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dummyTransactions.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{dummyTransactions
                      .filter(t => t.status === 'successful')
                      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[₦,]/g, '')), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by reference, description, or meter number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="successful">Successful</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="electricity_token">Electricity Token</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="w-full lg:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transactions ({filteredTransactions.length})</span>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Complete transaction history with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(transaction.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {getTypeLabel(transaction.type)}
                            </h3>
                            {getStatusBadge(transaction.status)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Reference:</span>
                              <span className="ml-2 font-mono text-gray-900">{transaction.reference}</span>
                            </div>
                            
                            {transaction.meterNumber && (
                              <div>
                                <span className="text-gray-500">Meter:</span>
                                <span className="ml-2 font-mono text-gray-900">{transaction.meterNumber}</span>
                              </div>
                            )}
                            
                            {transaction.units && (
                              <div>
                                <span className="text-gray-500">Units:</span>
                                <span className="ml-2 text-gray-900">{transaction.units}</span>
                              </div>
                            )}
                            
                            {transaction.paymentMethod && (
                              <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="ml-2 text-gray-900">{transaction.paymentMethod}</span>
                              </div>
                            )}
                            
                            {transaction.electricityCompany && (
                              <div>
                                <span className="text-gray-500">Electricity Company:</span>
                                <span className="ml-2 text-gray-900">{transaction.electricityCompany}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(transaction.status)}
                          <span className="text-lg font-bold text-gray-900">{transaction.amount}</span>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="mt-3">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
