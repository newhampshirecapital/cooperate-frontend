import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Activity,
  MessageCircle,
  DollarSign,
  UserPlus,
  FileText,
  Bell,
  Clock,
  ArrowRight,
  Users,
  Target
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

const RecentActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: activityData, isLoading, error } = useGetRecentActivityQuery({
    id: user?.cooperateId as string,
  });

  const activities: ActivityItem[] = (activityData?.data || []).slice(0, 2);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'contribution_made':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'message_sent':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'user_invited':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      case 'complaint_submitted':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'meter_application':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'savings_target_created':
        return <Target className="w-4 h-4 text-pink-500" />;
      case 'member_joined':
        return <Users className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
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
          subtitle: `${activity.userName} contributed ₦${metadata?.amount?.toLocaleString() || '0'} to ${metadata?.targetName || 'savings target'}`,
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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities and member actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities and member actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Failed to load recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system activities and member actions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-2">
              Activity will appear here as members interact with the system
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities.map((activity) => {
                const activityInfo = formatActivityDescription(activity);
                return (
                  <div key={activity._id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.action)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activityInfo.title}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${getActivityColor(activity.action)}`}>
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {activityInfo.subtitle}
                      </p>
                      {activityInfo.details && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {activityInfo.details}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(activity.timestamp)}</span>
                        <span>•</span>
                        <span>{activity.userName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/all-activities')}
              >
                View All Activities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
