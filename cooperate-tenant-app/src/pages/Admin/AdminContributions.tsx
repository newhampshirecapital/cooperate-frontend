import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  Search, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  Calendar,
  DollarSign,
  Receipt,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGetCooperativeContributionsQuery } from '../../api/api';
import { toast } from 'sonner';

interface Contribution {
  _id: string;
  amount: number;
  narration: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cooperativeId: string;
  savingsTargetId?: string;
  savingsTarget?: {
    _id: string;
    targetName: string;
    targetDescription?: string;
    targetAmount: number;
    targetType: string;
  };
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  paymentMethod?: string;
  reference?: string;
}

interface ContributionStats {
  totalContributions: number;
  totalAmount: number;
  uniqueContributors: number;
  averageContribution: number;
  contributionsByTarget: Array<{
    targetId: string;
    targetName: string;
    count: number;
    amount: number;
  }>;
  contributionsByMonth: Array<{
    month: string;
    count: number;
    amount: number;
  }>;
}

const AdminContributionsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showStats, setShowStats] = useState(true);

  const { data: contributionsData, isLoading, refetch } = useGetCooperativeContributionsQuery({ 
    id: user?.cooperateId as string 
  });

  const contributions: Contribution[] = contributionsData?.data?.contributions || [];

  const stats: ContributionStats = contributionsData?.data?.stats;

  // Filter contributions based on search and filters
  const filteredContributions = contributions.filter((contribution:any) => {
    const matchesSearch = contribution?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution?.savingsTarget?.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution?.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contribution.status === statusFilter;
    const matchesTarget = targetFilter === 'all' || contribution.savingsTargetId === targetFilter;
    const matchesUser = userFilter === 'all' || contribution.userId === userFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const contributionDate = new Date(contribution.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = contributionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = contributionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = contributionDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          matchesDate = contributionDate >= yearAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTarget && matchesUser && matchesDate;
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
        return <CheckCircle className="w-4 h-4 text-red-600" />;
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
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>;
    }
  };

  const getTargetIcon = (targetType?: string) => {
    switch (targetType?.toLowerCase()) {
      case 'monthly':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'quarterly':
        return <Calendar className="w-4 h-4 text-green-600" />;
      case 'yearly':
        return <Target className="w-4 h-4 text-purple-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

  const handleRefresh = () => {
    refetch();
    toast.success('Contributions refreshed successfully');
  };

  // Calculate statistics
  const totalContributions = contributions.length;
  const successfulContributions = contributions.filter(c => c.status.toLowerCase() === 'successful' || c.status.toLowerCase() === 'completed').length;
  //const pendingContributions = contributions.filter(c => c.status.toLowerCase() === 'pending').length;
  const totalAmount = contributions
    .filter(c => c.status.toLowerCase() === 'successful' || c.status.toLowerCase() === 'completed')
    .reduce((sum, c) => sum + c.amount, 0);

  // Get unique savings targets for filter
  const uniqueTargets = Array.from(new Set(contributions
    .filter(c => c.savingsTarget)
    .map(c => ({ id: c.savingsTargetId, name: c.savingsTarget?.targetName }))
  ));

  // Get unique users for filter
  const uniqueUsers = Array.from(new Set(contributions
    .filter(c => c.user)
    .map(c => ({ id: c.userId, name: `${c.user?.firstName} ${c.user?.lastName}` }))
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-hidden max-w-screen-lg">
      <div className="max-w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cooperative Contributions</h1>
              <p className="text-gray-600">Monitor and manage all contributions to cooperative savings targets</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                {showStats ? 'Hide' : 'Show'} Stats
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContributions}</p>
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
                  <p className="text-2xl font-bold text-green-600">{successfulContributions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Contributors</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.uniqueContributors || uniqueUsers.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Section */}
        {showStats && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mb-8">
            {/* Contributions by Target */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Contributions by Target
                </CardTitle>
                <CardDescription>Breakdown of contributions by savings target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.contributionsByTarget?.map((target) => (
                    <div key={target.targetId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{target.targetName}</p>
                        <p className="text-sm text-gray-600">{target.count} contributions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(target.amount)}</p>
                        <p className="text-sm text-gray-600">
                          {((target.amount / totalAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>Contribution trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.contributionsByMonth?.slice(-6).map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{month.month}</p>
                        <p className="text-sm text-gray-600">{month.count} contributions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(month.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contributions by narration, target, user name, or ID..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Targets</SelectItem>
                  {uniqueTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id!}>
                      {target.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
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

        {/* Contributions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contributions ({filteredContributions.length})</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              All contributions made to cooperative savings targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading contributions...</p>
              </div>
            ) : filteredContributions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions found</h3>
                <p className="text-gray-600">No contributions have been made to cooperative savings targets yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContributions.map((contribution:any) => (
                  <div key={contribution._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start flex-col md:flex-row justify-between">
                      <div className="flex flex-col md:flex-row items-start gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          {getTargetIcon(contribution.savingsTarget?.targetType)}
                        </div>
                        
                        <div className="flex-1 ">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {contribution.savingsTarget?.targetName || 'General Contribution'}
                            </h3>
                           <div className=''> {getStatusBadge(contribution.status)}</div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{contribution.narration}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Contribution ID:</span>
                              <span className="ml-2 font-mono text-gray-900">{contribution._id}</span>
                            </div>
                            
                            <div>
                              <span className="text-gray-500">Contributor:</span>
                              <span className="ml-2 text-gray-900">
                                {contribution.metadata?.userName}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Savings Target:</span>
                              <span className="ml-2 text-gray-900">
                                {contribution.metadata?.savingsTarget?.name}
                              </span>
                            </div>
                            {contribution.reference && (
                              <div>
                                <span className="text-gray-500">Reference:</span>
                                <span className="ml-2 font-mono text-gray-900">{contribution.reference}</span>
                              </div>
                            )}
                            
                            {contribution.paymentMethod && (
                              <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="ml-2 text-gray-900">{contribution.paymentMethod}</span>
                              </div>
                            )}
                            
                            {contribution.savingsTarget && (
                              <div>
                                <span className="text-gray-500">Target Type:</span>
                                <span className="ml-2 text-gray-900 capitalize">{contribution.savingsTarget.targetType}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(contribution.status)}
                          <span className="text-lg font-bold text-gray-900">{formatCurrency(contribution.amount)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(contribution.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(contribution.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2">
                          {contribution.savingsTarget && (
                            <Badge variant="outline" className="text-xs">
                              {contribution.savingsTarget.targetType.charAt(0).toUpperCase() + contribution.savingsTarget.targetType.slice(1)}
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredContributions.length > pageSize && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredContributions.length)} of {filteredContributions.length} contributions
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {Math.ceil(filteredContributions.length / pageSize)}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage >= Math.ceil(filteredContributions.length / pageSize)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContributionsPage;
