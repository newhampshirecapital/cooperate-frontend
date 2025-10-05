import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { 
  Search, 
  Users, 
  DollarSign, 
  Calendar, 
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

interface Contributor {
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

interface ViewContributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributors: Contributor[];
  savingsTargetName: string;
}

const ViewContributorsModal: React.FC<ViewContributorsModalProps> = ({
  isOpen,
  onClose,
  contributors,
  savingsTargetName
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <Badge className={`${baseClasses} bg-green-100 text-green-800`}>Completed</Badge>;
      case 'pending':
        return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>;
      case 'failed':
        return <Badge className={`${baseClasses} bg-red-100 text-red-800`}>Failed</Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter contributors based on search term
  const filteredContributors = contributors.filter(contributor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contributor.user.fullName.toLowerCase().includes(searchLower) ||
      contributor.user.email.toLowerCase().includes(searchLower) ||
      contributor.contributionToTarget.description.toLowerCase().includes(searchLower) ||
      contributor.contributionToTarget.reference.toLowerCase().includes(searchLower)
    );
  });

  // Calculate total amount contributed
  const totalAmount = contributors.reduce((sum, contributor) => sum + contributor.contributionToTarget.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contributors for "{savingsTargetName}"
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Contributors</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {contributors.length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(totalAmount)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Completed</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {contributors.filter(c => c.contributionToTarget.status.toLowerCase() === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, description, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Contributors List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContributors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No contributors found' : 'No contributors yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Contributors will appear here once they make contributions'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContributors.map((contributor) => (
                  <Card key={contributor._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {contributor.user.fullName}
                              </h3>
                              {getStatusBadge(contributor.contributionToTarget.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Email:</span>
                                <span className="ml-2 text-gray-900">{contributor.user.email}</span>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Amount:</span>
                                <span className="ml-2 font-semibold text-gray-900">
                                  {formatCurrency(contributor.contributionToTarget.amount)}
                                </span>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Description:</span>
                                <span className="ml-2 text-gray-900">
                                  {contributor.contributionToTarget.description}
                                </span>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="ml-2 text-gray-900 capitalize">
                                  {contributor.contributionToTarget.paymentMethod.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Reference:</span>
                                <span className="ml-2 font-mono text-gray-900 text-xs">
                                  {contributor.contributionToTarget.reference}
                                </span>
                              </div>
                              
                              <div>
                                <span className="text-gray-500">Transaction ID:</span>
                                <span className="ml-2 font-mono text-gray-900 text-xs">
                                  {contributor.contributionToTarget.metadata.lencoTransactionId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-2">
                            {formatCurrency(contributor.contributionToTarget.amount)}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(contributor.contributionToTarget.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(contributor.contributionToTarget.status)}
                              <span className="capitalize">
                                {contributor.contributionToTarget.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t mt-4">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContributorsModal;
