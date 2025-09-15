import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Gauge, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';

interface MyApplicationsProps {
  userMeterApplications: any;
  userMeterApplicationRequests: any;
  onViewApplication: (applicationId: string, applicationType: 'meter-account' | 'new-meter') => void;
  onEditApplication: (applicationId: string, applicationType: 'meter-account' | 'new-meter') => void;
  onDeleteApplication: (applicationId: string, applicationType: 'meter-account' | 'new-meter') => void;
  onSwitchTab: (tab: string) => void;
}

const MyApplications: React.FC<MyApplicationsProps> = ({
  userMeterApplications,
  userMeterApplicationRequests,
  onViewApplication,
  onEditApplication,
  onDeleteApplication,
  onSwitchTab
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Meter Account Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Meter Account Applications</span>
          </CardTitle>
          <CardDescription>
            Track your meter account applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.isArray(userMeterApplications?.data) && userMeterApplications?.data?.length > 0 ? (
              userMeterApplications?.data?.map((app: any) => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gauge className="w-5 h-5 text-blue-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium truncate">Meter Account Application</span>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {app.name} • {app.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.address ? `${app.address.street}, ${app.address.city}` : 'N/A'} • 
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className="text-xs text-gray-500">ID: {app._id.slice(-8)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewApplication(app._id, 'meter-account')}
                      >
                        View
                      </Button>
                      {app.status.toUpperCase() === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Edit button clicked for meter-account:', app._id);
                            onEditApplication(app._id, 'meter-account');
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteApplication(app._id, 'meter-account')}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Gauge className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Meter Account Applications</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any meter account applications yet.</p>
                <Button 
                  onClick={() => onSwitchTab('meter-account')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Create Meter Account Application
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Meter Application Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">New Meter Requests</span>
          </CardTitle>
          <CardDescription>
            Track your new meter installation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.isArray(userMeterApplicationRequests?.data) && userMeterApplicationRequests?.data?.length > 0 ? (
              userMeterApplicationRequests?.data?.map((app: any) => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-medium truncate">New Meter Request</span>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {app.name} • {app.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.address ? `${app.address.street}, ${app.address.city}` : 'N/A'} • 
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span className="text-xs text-gray-500">ID: {app._id.slice(-8)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewApplication(app._id, 'new-meter')}
                      >
                        View
                      </Button>
                      {app.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Edit button clicked for new-meter:', app._id);
                            onEditApplication(app._id, 'new-meter');
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteApplication(app._id, 'new-meter')}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No New Meter Requests</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any new meter requests yet.</p>
                <Button 
                  onClick={() => onSwitchTab('new-meter')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Create New Meter Request
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyApplications;
