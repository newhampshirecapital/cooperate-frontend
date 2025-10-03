import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell, 
  FileText,
  BarChart3,
  UserPlus,
  Activity,
  Clock,
  Eye,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useGetCooperativeNotificationsQuery, useGetUnreadCooperativeNotificationsQuery, useMarkAsReadMutation, useDeleteNotificationMutation, useGetAllCooperativeMembersQuery, useGetRecentActivityQuery } from '../../api/api';
import { NotificationIcons, NotificationColors } from '../../constants/stats';
import { useState } from 'react';
import { toast } from 'sonner';
import NotificationDetailModal from '../../components/modals/NotificationDetailModal';
import ViewMembersModal from '../../components/modals/ViewMembersModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const {data: cooperativeMembers} = useGetAllCooperativeMembersQuery({id: user?.cooperativeId || user?.cooperateId as string});
  
  // Fetch recent activity
  const {data: recentActivityData} = useGetRecentActivityQuery({
    id: user?.cooperativeId || user?.cooperateId as string,
    days: 7,
    limit: 10
  });

 
  
  // Fetch notifications for the cooperative
  const { data: notificationsData, refetch: refetchNotifications } = useGetCooperativeNotificationsQuery({ 
    id: user?.cooperativeId || user?.cooperateId as string 
  });
  
  const { data: unreadNotificationsData } = useGetUnreadCooperativeNotificationsQuery({ 
    id: user?.cooperativeId || user?.cooperateId as string 
  });
  
  const [markAsReadMutation] = useMarkAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();
  
  const notifications = notificationsData?.data || [];
  
  const unreadNotifications = unreadNotificationsData?.data || [];
  const unreadCount = unreadNotifications.length;
  const totalMembers = cooperativeMembers?.data.length;
  // Handle notification actions
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation({ id: notificationId }).unwrap();
      toast.success('Notification marked as read');
      refetchNotifications();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotificationMutation({ id: notificationId }).unwrap();
        toast.success('Notification deleted');
        refetchNotifications();
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const openNotificationDetail = (notification: any) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const closeNotificationDetail = () => {
    setSelectedNotification(null);
    setIsDetailModalOpen(false);
  };

  const openMembersModal = () => {
    setShowMembersModal(true);
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
  };

  const getNotificationIcon = (type: string) => {
    const Icon = NotificationIcons[type as keyof typeof NotificationIcons] || NotificationIcons.default;
    return Icon;
  };

  const getNotificationColor = (type: string) => {
    return NotificationColors[type as keyof typeof NotificationColors] || NotificationColors.default;
  };

  const getTypeColor = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'user_message': 'bg-blue-100 text-blue-800',
      'complaint_submitted_to_admin': 'bg-red-100 text-red-800',
      'complaint_updated': 'bg-orange-100 text-orange-800',
      'payment_success': 'bg-green-100 text-green-800',
      'payment_failed': 'bg-red-100 text-red-800',
      'user_invited': 'bg-purple-100 text-purple-800',
      'user_approved': 'bg-green-100 text-green-800',
      'user_rejected': 'bg-red-100 text-red-800',
      'system_maintenance': 'bg-orange-100 text-orange-800',
      'system_update': 'bg-blue-100 text-blue-800',
      'general_announcement': 'bg-purple-100 text-purple-800',
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  };

  // Mock data - in real app, this would come from API
  const stats = {
    totalMembers: totalMembers,
    activeMeters: 1156,
    monthlyRevenue: 2450000,
    pendingBills: 23,
    complaints: 8,
    energyGenerated: 45600
  };

  const openComplaints = notifications.filter((notification: any) => notification.type === 'complaint_submitted_to_admin').length;

  const meterApplications = notifications.filter((application:any) => application.type === 'meter_application_submitted_to_admin').length;
  const accountApplications = notifications.filter((account:any) => account.type === 'meter_account_request_submitted_to_admin').length;
  const messages = notifications.filter((message:any) => message.type === 'message_sent_to_admin').length;
  
  // Use real activity data or fallback to mock data
  const recentActivities = recentActivityData?.data || [
    { id: 1, type: 'member', action: 'New member registered', time: '2 hours ago', user: 'John Doe' },
    { id: 2, type: 'bill', action: 'Bill generated', time: '4 hours ago', user: 'System' },
    { id: 3, type: 'complaint', action: 'Complaint submitted', time: '6 hours ago', user: 'Jane Smith' },
    { id: 4, type: 'payment', action: 'Payment received', time: '8 hours ago', user: 'Mike Johnson' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'bill': return <FileText className="w-4 h-4 text-green-500" />;
      case 'complaint': return <Bell className="w-4 h-4 text-orange-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
    <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name || 'Admin'}
              </p>
              <Badge variant="outline" className="mt-2">
                {user?.cooperativeId ? 'Cooperative Admin' : 'System Admin'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications Center
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </Button>
              </CardTitle>
              <CardDescription>
                Manage all cooperative notifications and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification: any) => {
                    const Icon = getNotificationIcon(notification.type);
                    const iconColor = getNotificationColor(notification.type);
                    
                    return (
                      <div
                        key={notification._id}
                        className={`p-4 border rounded-lg transition-colors ${
                          !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 
                                  className={`font-medium cursor-pointer hover:underline ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}
                                  onClick={() => openNotificationDetail(notification)}
                                >
                                  {notification.title}
                                </h4>
                                <Badge variant="outline" className={`${getTypeColor(notification.type)} text-xs`}>
                                  {notification.type.replace(/_/g, ' ')}
                                </Badge>
                                {!notification.isRead && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openNotificationDetail(notification)}
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification._id)}
                                title="Mark as read"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={openMembersModal}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                Click to view all members
              </p>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Meters</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMeters}</div>
              <p className="text-xs text-muted-foreground">
                {(stats.activeMeters / stats.totalMembers)}% coverage
              </p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBills}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openComplaints}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting resolution
              </p>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members Meter Applications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meterApplications}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting resolution
              </p>
            </CardContent>
          </Card>


          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Account request</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accountApplications}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.energyGenerated.toLocaleString()} kWh</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm text-red-500 font-medium">Messages Sent to Admin</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/invite">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite New Member
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/pending-invites">
                    <Users className="w-4 h-4 mr-2" />
                    Pending Invites
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and member actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity: any) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          by <span className="font-bold">{activity.userName}</span> • {activity?.timestamp?.toLocaleString().split('T')[0]} 
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Activities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section - Placeholder for future implementation */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Charts and analytics will be implemented here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isDetailModalOpen}
        onClose={closeNotificationDetail}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
      />

      {/* View Members Modal */}
      <ViewMembersModal
        members={cooperativeMembers?.data || []}
        isOpen={showMembersModal}
        onClose={closeMembersModal}
      />
    </div>
  );
};

export default AdminDashboard;
