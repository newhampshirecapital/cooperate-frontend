import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Download,
  Search,

  BarChart3,

  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import ViewContributorsModal from '../components/modals/ViewContributorsModal';

import { 
  useGetSavingsTargetPaymentQuery,
  useGetSavingTargetStatsQuery
} from '../api/api';
import { toast } from 'sonner';

interface SavingsTarget {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  targetProgress: number;
  progressPercentage: number;
  status: string;
  targetType: string;
  targetDate: string;
}

interface Contribution {
  _id: string;
  contributionToTarget: {
    amount: number;
    description: string;
    createdAt: string;
    status: string;
    paymentMethod: string;
    reference: string;
    metadata: {
      userName: string;
      cooperativeName: string;
      lencoTransactionId: string;
    };
  };
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface Stats {
  totalContributions: number;
  totalAmount: number;
  uniqueContributors: number;
  averageContribution: number;
}

interface Pagination {
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const SavingsTargetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showContributorsModal, setShowContributorsModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { 
    data: paymentData, 
    isLoading: paymentLoading, 
    refetch: refetchPayments 
  } = useGetSavingsTargetPaymentQuery({ id: id! });

  console.log('paymentData', paymentData);

  const { 
    data: statsData, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useGetSavingTargetStatsQuery({ id: id! });

  const savingsTarget: SavingsTarget = paymentData?.data?.savingsTarget;
  const contributions: Contribution[] = paymentData?.data?.contributions || [];
  const stats: Stats = paymentData?.data?.stats || statsData?.data?.contributionStats;
  const pagination: Pagination = paymentData?.data?.pagination;

  // Filter contributions based on search
  const filteredContributions = contributions.filter((contribution) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      contribution.contributionToTarget.description.toLowerCase().includes(searchLower) ||
      contribution.user.fullName.toLowerCase().includes(searchLower) ||
      contribution.user.email.toLowerCase().includes(searchLower) ||
      contribution.contributionToTarget.reference.toLowerCase().includes(searchLower) ||
      contribution.contributionToTarget.metadata.userName.toLowerCase().includes(searchLower)
    );
  });

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      case 'quarterly':
        return <Calendar className="w-6 h-6 text-green-500" />;
      case 'yearly':
        return <Target className="w-6 h-6 text-purple-500" />;
      default:
        return <Target className="w-6 h-6 text-gray-500" />;
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'ongoing':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Active</Badge>;
      case 'completed':
        return <Badge className={`${baseClasses} bg-blue-100 text-blue-800`}>Completed</Badge>;
      case 'cancelled':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</Badge>;
      case 'expired':
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Expired</Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    refetchPayments();
    refetchStats();
    toast.success('Data refreshed successfully');
  };

  if (paymentLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading savings target details...</p>
        </div>
      </div>
    );
  }

  if (!savingsTarget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Savings Target Not Found</h2>
          <p className="text-gray-600 mb-4">The savings target you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/savings-targets')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Savings Targets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex  items-center justify-between">
            <div className="flex  items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/savings-targets')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{savingsTarget.name}</h1>
                <p className="text-gray-600">{savingsTarget.description}</p>
              </div>
            </div>
            <div className="hidden md:flex  items-center gap-3">
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
          <div className="flex md:hidden mt-2 items-center gap-3">
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

        {/* Target Overview */}
        <div className={`bg-gradient-to-r ${getTargetColor(savingsTarget.targetType)} border rounded-lg p-6 mb-8`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="hidden md:flex w-16 h-16 bg-white/50 rounded-full items-center justify-center">
                {getTargetIcon(savingsTarget.targetType)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{savingsTarget.name}</h2>
                  {getStatusBadge(savingsTarget.status)}
                </div>
                <p className="text-gray-700 mb-2">{savingsTarget.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(savingsTarget.targetDate).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline">
                    {savingsTarget.targetType.charAt(0).toUpperCase() + savingsTarget.targetType.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col md:hidden items-center gap-4">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {formatCurrency(savingsTarget.targetProgress)} / {formatCurrency(savingsTarget.targetAmount)}
              </div>
              <div className="text-md text-gray-600 mb-3">
                {savingsTarget.progressPercentage.toFixed(1)}% Complete
              </div>
              <div className="w-48 bg-white/50 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(savingsTarget.progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            </div>
            
            <div className="hidden md:block">
              <div className="text-xl font-bold text-gray-900 mb-1">
                {formatCurrency(savingsTarget.targetProgress)} / {formatCurrency(savingsTarget.targetAmount)}
              </div>
              <div className="text-md text-gray-600 mb-3">
                {savingsTarget.progressPercentage.toFixed(1)}% Complete
              </div>
              <div className="w-48 bg-white/50 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(savingsTarget.progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Amount Paid</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(savingsTarget.amountPaid)}</div>
            </div>
            
            <div className="bg-white/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Outstanding</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(savingsTarget.outstandingAmount)}</div>
            </div>
            
            <div className="bg-white/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Contributors</span>
              </div>
              <div className="text-2xl font-bold">{paymentData?.data?.contributions.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                  <p className="text-2xl font-bold text-gray-900">{paymentData?.data?.contributions.length || 0}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(savingsTarget.targetAmount)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Contributors</p>
                  <p className="text-2xl font-bold text-purple-600">{stats?.uniqueContributors || 0}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Contribution</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats?.averageContribution || 0)}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contributions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col md:flex-row items-center justify-between">
              <span>Contributions ({filteredContributions.length})</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowContributorsModal(true)}
                  disabled={contributions.length === 0}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Contributors
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              All contributions made to this savings target
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by description, name, email, or reference..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-full lg:w-32">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contributions List */}
            {filteredContributions.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions found</h3>
                <p className="text-gray-600">No contributions have been made to this savings target yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContributions.map((contribution) => (
                  <div key={contribution._id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="hidden md:flex w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {contribution.user.fullName}
                            </h3>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {contribution.contributionToTarget.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{contribution.contributionToTarget.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Email:</span>
                              <span className="ml-2 text-gray-900">{contribution.user.email}</span>
                            </div>
                            
                            <div>
                              <span className="text-gray-500">Amount:</span>
                              <span className="ml-2 font-semibold text-gray-900">{formatCurrency(contribution.contributionToTarget.amount)}</span>
                            </div>
                            
                            <div>
                              <span className="text-gray-500">Reference:</span>
                              <span className="ml-2 font-mono text-gray-900 text-xs">{contribution.contributionToTarget.reference}</span>
                            </div>
                            
                            <div>
                              <span className="text-gray-500">Payment Method:</span>
                              <span className="ml-2 text-gray-900 capitalize">{contribution.contributionToTarget.paymentMethod.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                       
                        
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(contribution.contributionToTarget.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalCount > pageSize && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.totalCount)} of {pagination.totalCount} contributions
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
                    Page {currentPage} of {Math.ceil(pagination.totalCount / pageSize)}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!pagination.hasMore}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* View Contributors Modal */}
        <ViewContributorsModal
          isOpen={showContributorsModal}
          onClose={() => setShowContributorsModal(false)}
          contributors={contributions}
          savingsTargetName={savingsTarget?.name || 'Savings Target'}
        />
      </div>
    </div>
  );
};

export default SavingsTargetDetails;
