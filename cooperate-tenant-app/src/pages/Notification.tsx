import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { 
  Bell, 
  MessageSquare, 
  Send,
  Trash2,
  Check,
  Settings,
  AlertCircle,
  Info,
  Receipt,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useDeleteNotificationMutation, useGetUserNotificationsQuery, useReadAllNotificationsMutation, useMarkAsReadMutation } from '../api/api';
import { NotificationIcons, NotificationColors } from '../constants/stats';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const { user } = useAuth();
  const { data: notificationsData, refetch } = useGetUserNotificationsQuery({ id: user?._id as string });
  const [readAllNotificationsMutation] = useReadAllNotificationsMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();
 
  const notifications = notificationsData?.data || [];
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });

  const [markAsReadMutation] = useMarkAsReadMutation();

  const messages = [
    {
      id: 'MSG001',
      from: 'admin',
      subject: 'Response to Billing Inquiry',
      message: 'Thank you for your inquiry about the billing discrepancy. We have reviewed your account and found that there was indeed an error in the calculation. A corrected bill has been generated and sent to your email. The difference of ₦1,200 has been credited to your account.',
      timestamp: '2024-01-17 13:30',
      read: false,
      type: 'response'
    },
    {
      id: 'MSG002',
      from: 'admin',
      subject: 'Meter Installation Update',
      message: 'Your meter installation has been scheduled for January 22nd, 2024, between 9:00 AM and 12:00 PM. Our technician will contact you 30 minutes before arrival. Please ensure someone is available at the premises.',
      timestamp: '2024-01-16 08:15',
      read: true,
      type: 'update'
    },
    {
      id: 'MSG003',
      from: 'admin',
      subject: 'Monthly Energy Report',
      message: 'Your monthly energy report is now available. You generated 2,847 kWh and consumed 1,923 kWh this month, resulting in a net surplus of 924 kWh. Well done on your energy efficiency!',
      timestamp: '2024-01-15 10:00',
      read: true,
      type: 'report'
    }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageForm.subject || !messageForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.loading('Sending message...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Message sent to admin successfully!');
      setMessageForm({ subject: '', message: '' });
    }, 1500);
  };

  const markAsRead = async (id: string) => {
    const res = await markAsReadMutation({ id: id });
    if (res.data) {
      toast.success('Marked as read');
      refetch();
    } else {
      toast.error('Failed to mark as read');
    }

   
  };

  const deleteNotification = async (id: string) => {
    //alert the user
    if (window.confirm('Are you sure you want to delete this notification?')) {
    const res = await deleteNotificationMutation({ id: id });
    if (res.data) {
      toast.success('Notification deleted');
      refetch();
    } else {
        toast.error('Failed to delete notification');
      }
    }
    //toast.success('Notification deleted');
  };

  const readAllNotifications = async () => {
    const res = await readAllNotificationsMutation({ id: user?._id as string });
    if (res.data) {
      toast.success('All notifications marked as read');
      refetch();
    } else {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-orange-100 text-orange-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'meter':
        return 'bg-blue-100 text-blue-800';
      case 'energy':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBorder = (priority: string) => {
    return priority === 'high' ? 'border-l-4 border-orange-400' : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Notifications & Messages</h2>
          <p className="text-gray-600">Stay updated with system notifications and communicate with admin</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 h-auto">
        <TabsList className="flex flex-col p-2 md:grid w-full md:grid-cols-3 h-auto ">
          <TabsTrigger value="notifications" className="flex w-full items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
            <Badge variant="secondary" className="ml-1 text-xs">
              {notifications.filter((n:any) => !n.isRead).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex w-full items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
            <Badge variant="secondary" className="ml-1 text-xs">
              {messages.filter(m => !m.read).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="send-message" className="flex w-full items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  System Notifications
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => readAllNotifications()}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-sm">
                Important updates and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification:any) => {
                  // Get the appropriate icon and color based on notification type
                  const Icon = NotificationIcons[notification.type as keyof typeof NotificationIcons] || NotificationIcons.default;
                  const iconColor = NotificationColors[notification.type as keyof typeof NotificationColors] || NotificationColors.default;
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 border rounded-lg transition-colors ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      } ${getPriorityBorder(notification.priority)}`}
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between ">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              <Badge variant="outline" className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                              {notification.priority === 'high' && (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-2 text-xs mb-2 text-gray-500">
                              <Clock className="w-3 h-3" />
                              
                              {notification.createdAt.toLocaleString().split('T')[0]} {notification.createdAt.toLocaleString().split('T')[1].split(':')[0]}:{notification.createdAt.toLocaleString().split('T')[1].split(':')[1]}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          {!notification.isRead ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 mt-1 text-green-800 text-xs">
                              Already Read
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages from Admin
              </CardTitle>
              <CardDescription>
                Direct communications and responses from the administrative team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg ${
                      !message.read ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          !message.read ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <MessageSquare className={`w-4 h-4 ${
                            !message.read ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${!message.read ? 'text-green-900' : 'text-gray-900'}`}>
                            {message.subject}
                          </h4>
                          <p className="text-xs text-gray-500">From: Administrator</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                        {!message.read && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {message.message}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {message.timestamp}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                        {/* {!message.read && (
                          <Button variant="outline" size="sm" onClick={() => markAsRead()}>
                            <Check className="w-4 h-4 mr-2" />
                            Mark Read
                          </Button>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="send-message" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message to Admin
                  </CardTitle>
                  <CardDescription>
                    Contact the administrative team directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Enter message subject"
                        value={messageForm.subject}
                        onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        value={messageForm.message}
                        onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Message Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Before sending:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Check if your issue can be resolved through our FAQ</li>
                      <li>• Use the complaints section for formal complaints</li>
                      <li>• Be clear and specific about your inquiry</li>
                      <li>• Include relevant details (meter number, dates, etc.)</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Response Time:</h4>
                    <p className="text-gray-600">
                      We typically respond to messages within 24-48 hours during business days.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Info className="w-4 h-4 mr-2" />
                    FAQ & Help Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Submit Complaint
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Receipt className="w-4 h-4 mr-2" />
                    Billing Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}