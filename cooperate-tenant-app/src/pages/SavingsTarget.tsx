import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Eye,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  XCircle,

  Download,

} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  useListSavingsTargetsQuery, 
  useCancelSavingsTargetMutation,

} from '../api/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

interface SavingsTarget {
  _id: string;
  targetName: string;
  targetDescription?: string;
  targetAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  targetProgress: number;
  progressPercentage: number;
  status: string;
  targetType: string;
  targetDate?: string;
  createdAt: string;
  userId: string;
}



const SavingsTargetPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTarget, setSelectedTarget] = useState<SavingsTarget | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  const { data: savingsTargets, isLoading, refetch } = useListSavingsTargetsQuery({ 
    id: user?.cooperateId as string 
  });

  

  const [cancelSavingsTarget] = useCancelSavingsTargetMutation();

  const targets: SavingsTarget[] = savingsTargets?.data || [];

  // Filter targets based on search and filters
  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.targetDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || target.status === statusFilter;
    const matchesType = typeFilter === 'all' || target.targetType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'quarterly':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'yearly':
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
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

  const getTargetTextColor = (targetType: string) => {
    switch (targetType) {
      case 'monthly':
        return 'text-blue-900';
      case 'quarterly':
        return 'text-green-900';
      case 'yearly':
        return 'text-purple-900';
      default:
        return 'text-gray-900';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
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

  const formatTargetDate = (dateString?: string) => {
    if (!dateString) return 'No deadline set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelTarget = async () => {
    if (!selectedTarget || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelSavingsTarget({
        payload: {
          savingsTargetId: selectedTarget._id,
          userId: user?._id as string
        }
      }).unwrap();
      
      toast.success('Savings target cancelled successfully');
      setShowCancelDialog(false);
      setCancelReason('');
      setSelectedTarget(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to cancel savings target');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleViewDetails = (target: SavingsTarget) => {
    setSelectedTarget(target);
    navigate(`/savings-target/${target._id}`);
  };

  const totalTargets = targets.length;
  const activeTargets = targets.filter(t => t.status === 'active').length;
  const completedTargets = targets.filter(t => t.status === 'completed').length;
  const totalProgress = targets.reduce((sum, t) => sum + t.targetProgress, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Targets</h1>
              <p className="text-gray-600">Manage and monitor cooperative savings targets</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => navigate('/create-savings-target')}>
                <Target className="w-4 h-4 mr-2" />
                Create Target
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
                  <p className="text-sm font-medium text-gray-600">Total Targets</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTargets}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Targets</p>
                  <p className="text-2xl font-bold text-green-600">{activeTargets}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedTargets}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProgress)}</p>
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
                    placeholder="Search targets by name or description..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="w-full lg:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Savings Targets List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Savings Targets ({filteredTargets.length})</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Manage all cooperative savings targets and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-gray-600">Loading savings targets...</p>
              </div>
            ) : filteredTargets.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No savings targets found</h3>
                <p className="text-gray-600 mb-4">Create your first savings target to get started</p>
                <Button onClick={() => navigate('/create-savings-target')}>
                  <Target className="w-4 h-4 mr-2" />
                  Create Target
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTargets.map((target:any) => (
                  <div key={target._id} className={`bg-gradient-to-r ${getTargetColor(target.targetType)} border rounded-lg p-6`}>
                    <div className="flex flex-col md:flex-row items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="hidden md:flex w-10 h-10 bg-white/50 rounded-full  items-center justify-center">
                          {getTargetIcon(target.targetType)}
                        </div>
                        <div>
                          <h4 className={`font-semibold text-lg ${getTargetTextColor(target.targetType)}`}>
                            {target.targetName}
                          </h4>
                          <p className={`text-sm ${getTargetTextColor(target.targetType)} opacity-80`}>
                            {target.targetDescription || 'Cooperative savings target'}
                          </p>
                          <div className="flex flex-col md:flex-row items-start justify-between gap-2 mt-2">
                            {getStatusBadge(target.targetStatus)}
                            <Badge variant="outline" className="text-xs">
                              {target.targetType.charAt(0).toUpperCase() + target.targetType.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {formatTargetDate(target.targetDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-wrap md:text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {formatCurrency(target.targetProgress)} / {formatCurrency(target.targetAmount)}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {((target?.targetProgress / target?.targetAmount) * 100).toFixed(1)}% Complete
                        </div>
                        <div className="w-32 bg-white/50 rounded-full h-2 mb-3">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(target?.progressPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-medium">Amount Paid</span>
                        </div>
                        <div className="text-lg font-bold">{formatCurrency(target.amountPaid)}</div>
                      </div>
                      
                      <div className="bg-white/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Outstanding</span>
                        </div>
                        <div className="text-lg font-bold">{formatCurrency(target.outstandingAmount)}</div>
                      </div>
                      
                      <div className="bg-white/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">Contributors</span>
                        </div>
                        <div className="text-lg font-bold">
                          {savingsTargets?.data?.length}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Created: {new Date(target.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(target)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        
                        {target.targetStatus === 'ongoing' && (
                          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setSelectedTarget(target)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Target
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Savings Target</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to cancel "{target.targetName}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Label htmlFor="cancel-reason">Reason for cancellation</Label>
                                <Textarea
                                  id="cancel-reason"
                                  placeholder="Please provide a reason for cancelling this savings target..."
                                  value={cancelReason}
                                  onChange={(e) => setCancelReason(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setShowCancelDialog(false);
                                    setCancelReason('');
                                    setSelectedTarget(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={handleCancelTarget}
                                  disabled={isCancelling || !cancelReason.trim()}
                                >
                                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsTargetPage;
