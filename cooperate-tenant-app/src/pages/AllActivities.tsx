import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Activity,
  MessageCircle,
  DollarSign,
  UserPlus,
  FileText,
  Bell,
  Clock,
  ArrowLeft,
  Users,
  Target,
  Filter,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGetRecentActivityQuery } from '../api/api';

interface ActivityItem {
  _id: string;
  action: string;
  cooperativeId: string;
  createdAt: string;
  description: string;
  metadata: any;
  timestamp: string;
  updatedAt: string;
  userEmail: string;
  userId: string;
  userName: string;
}

const AllActivities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState('30');
  const [selectedAction, setSelectedAction] = useState('all');
  
  const { data: activityData, isLoading, error } = useGetRecentActivityQuery({
    id: user?.cooperateId as string,
  });

  const activities: ActivityItem[] = activityData?.data || [];

  // Filter activities based on selected action
  const filteredActivities = selectedAction === 'all' 
    ? activities 
    : activities.filter(activity => activity.action === selectedAction);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'contribution_made':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'message_sent':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'user_invited':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'complaint_submitted':
        return <Bell className="w-5 h-5 text-orange-500" />;
      case 'meter_application':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'savings_target_created':
        return <Target className="w-5 h-5 text-pink-500" />;
      case 'member_joined':
        return <Users className="w-5 h-5 text-emerald-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'contribution_made':
        return 'bg-green-100 text-green-800';
      case 'message_sent':
        return 'bg-blue-100 text-blue-800';
      case 'user_invited':
        return 'bg-purple-100 text-purple-800';
      case 'complaint_submitted':
        return 'bg-orange-100 text-orange-800';
      case 'meter_application':
        return 'bg-indigo-100 text-indigo-800';
      case 'savings_target_created':
        return 'bg-pink-100 text-pink-800';
      case 'member_joined':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatActivityDescription = (activity: ActivityItem) => {
    const { action, description, metadata } = activity;
    
    switch (action) {
      case 'contribution_made':
        return {
          title: 'Contribution Made',
          subtitle: `${activity.userName} contributed ₦${metadata?.targetAmount?.toLocaleString() || '0'} to ${metadata?.targetName || 'savings target'}`,
          details: metadata?.targetDescription || description
        };
      case 'message_sent':
        return {
          title: 'Message Sent',
          subtitle: `${activity.userName} sent a message`,
          details: metadata?.subject || metadata?.messageBody || description
        };
      case 'user_invited':
        return {
          title: 'User Invited',
          subtitle: `${activity.userName} invited a new member`,
          details: description
        };
      case 'complaint_submitted':
        return {
          title: 'Complaint Submitted',
          subtitle: `${activity.userName} submitted a complaint`,
          details: metadata?.complaintSubject || description
        };
      case 'meter_application':
        return {
          title: 'Meter Application',
          subtitle: `${activity.userName} submitted a meter application`,
          details: description
        };
      case 'savings_target_created':
        return {
          title: 'Savings Target Created',
          subtitle: `${activity.userName} created a new savings target`,
          details: metadata?.targetName || description
        };
      case 'member_joined':
        return {
          title: 'Member Joined',
          subtitle: `${activity.userName} joined the cooperative`,
          details: description
        };
      default:
        return {
          title: 'Activity',
          subtitle: description,
          details: ''
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionOptions = () => {
    const uniqueActions = [...new Set(activities.map(activity => activity.action))];
    return [
      { value: 'all', label: 'All Activities' },
      ...uniqueActions.map(action => ({
        value: action,
        label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      }))
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Activities
            </h1>
            <p className="text-gray-600">
              Complete history of cooperative activities and member actions
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Time Period:</label>
                <Select value={selectedDays} onValueChange={setSelectedDays}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Activity Type:</label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getActionOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activity History</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredActivities.length} activities found
              </span>
            </CardTitle>
            <CardDescription>
              Showing activities from the last {selectedDays} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Failed to load activities</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No activities found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your filters or time period
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => {
                  const activityInfo = formatActivityDescription(activity);
                  return (
                    <div key={activity._id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getActivityIcon(activity.action)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {activityInfo.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${getActivityColor(activity.action)}`}>
                            {activity.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {activityInfo.subtitle}
                        </p>
                        {activityInfo.details && (
                          <p className="text-sm text-gray-500 mb-3">
                            {activityInfo.details}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(activity.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{activity.userName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{activity.userEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllActivities;
