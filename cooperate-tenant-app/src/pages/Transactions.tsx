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
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGetTransactionDetailsQuery, useGetUserTransactionHistoryQuery } from '../api/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';


export function TransactionsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const { data: transactionData, isLoading, refetch } = useGetUserTransactionHistoryQuery({ 
    id: user?._id as string 
  });
  
  const { data: transactionDetails, isLoading: transactionDetailsLoading } = useGetTransactionDetailsQuery({ 
    id: selectedTransactionId as string 
  }, {
    skip: !selectedTransactionId // Only fetch when a transaction is selected
  });

  console.log('transactionData', transactionData);
  console.log('transactionDetails', transactionDetails);
  
  const transactions: any = transactionData || [];

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction:any) => {
    const matchesSearch = transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.createdAt);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
      case 'completed':
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
    switch (status.toLowerCase()) {
      case 'successful':
      case 'completed':
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
    switch (type.toLowerCase()) {
      case 'electricity_token':
      case 'electricity':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'payment':
      case 'contribution':
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
    switch (type.toLowerCase()) {
      case 'electricity_token':
      case 'electricity':
        return 'Electricity Token';
      case 'payment':
      case 'contribution':
        return 'Payment';
      case 'refund':
        return 'Refund';
      case 'maintenance':
        return 'Maintenance';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleViewDetails = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
  };

  const handleCloseDetails = () => {
    setSelectedTransactionId(null);
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
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
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
                    {transactions.filter((t:any) => t.status.toLowerCase() === 'successful' || t.status.toLowerCase() === 'completed').length}
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
                    {transactions.filter((t:any) => t.status.toLowerCase() === 'pending').length}
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
                    {formatCurrency(transactions
                      .filter((t:any) => t.status.toLowerCase() === 'successful' || t.status.toLowerCase() === 'completed')
                      .reduce((sum:any, t:any) => sum + t.amount, 0))}
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
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription>
              Complete transaction history with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction:any) => (
                  <div key={transaction._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
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
                          
                          <div className="grid grid-cols-1  gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Transaction ID:</span>
                              <span className="ml-2 font-mono text-gray-900">{transaction._id}</span>
                            </div>
                            
                            {transaction.reference && (
                              <div>
                                <span className="text-gray-500">Reference:</span>
                                <span className="ml-2 font-mono text-gray-900">{transaction.reference}</span>
                              </div>
                            )}
                            
                            {transaction.paymentMethod && (
                              <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="ml-2 text-gray-900">{transaction.paymentMethod}</span>
                              </div>
                            )}
                            
                            <div>
                              <span className="text-gray-500">User ID:</span>
                              <span className="ml-2 font-mono text-gray-900">{transaction.userId}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(transaction.status)}
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(transaction.amount)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(transaction.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3"
                          onClick={() => handleViewDetails(transaction._id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        <Dialog open={!!selectedTransactionId} onOpenChange={handleCloseDetails}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Transaction Details
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>

            {transactionDetailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading transaction details...</span>
              </div>
            ) : transactionDetails?.data ? (
              <div className="space-y-6">
                {/* Transaction Overview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getTypeIcon(transactionDetails.data.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getTypeLabel(transactionDetails.data.type)}
                        </h3>
                        <p className="text-sm text-gray-600">{transactionDetails.data.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(transactionDetails.data.amount)}
                      </div>
                      {getStatusBadge(transactionDetails.data.status)}
                    </div>
                  </div>
                </div>

                {/* Transaction Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Transaction Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Transaction ID:</span>
                        <p className="font-mono text-sm text-gray-900 break-all">{transactionDetails.data._id}</p>
                      </div>
                      
                      {transactionDetails.data.reference && (
                        <div>
                          <span className="text-sm text-gray-500">Reference:</span>
                          <p className="font-mono text-sm text-gray-900">{transactionDetails.data.reference}</p>
                        </div>
                      )}
                      
                      {transactionDetails.data.paymentMethod && (
                        <div>
                          <span className="text-sm text-gray-500">Payment Method:</span>
                          <p className="text-sm text-gray-900 capitalize">
                            {transactionDetails.data.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <div className="mt-1">
                          {getStatusBadge(transactionDetails.data.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Timing Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">Created:</span>
                        <p className="text-sm text-gray-900">
                          {new Date(transactionDetails.data.createdAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Last Updated:</span>
                        <p className="text-sm text-gray-900">
                          {new Date(transactionDetails.data.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">User ID:</span>
                        <p className="font-mono text-sm text-gray-900">{transactionDetails.data.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>

              
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Not Found</h3>
                <p className="text-gray-600">Unable to load transaction details</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
