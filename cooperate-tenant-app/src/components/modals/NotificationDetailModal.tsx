import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  Clock, 
  User, 
  Send,
  Eye,
  Trash2,
  Forward,
  Reply,
  MessageSquare
} from 'lucide-react';
import { NotificationIcons, NotificationColors } from '../../constants/stats';
import { toast } from 'sonner';

interface NotificationDetailModalProps {
  notification: any | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete
}) => {
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMessage, setForwardMessage] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  if (!notification) return null;


  

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
      'meter_application_submitted_to_admin': 'bg-blue-100 text-blue-800',
      'meter_account_request_submitted_to_admin': 'bg-green-100 text-green-800',
    };
    return typeMap[type] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleForwardToNHC = async () => {
    if (!forwardMessage.trim()) {
      toast.error('Please add additional information before forwarding');
      return;
    }

    setIsForwarding(true);
    try {
      // TODO: Implement API call to forward to NHC
      // await forwardToNHCMutation({
      //   notificationId: notification._id,
      //   additionalInfo: forwardMessage,
      //   adminId: user._id
      // }).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Complaint forwarded to NHC successfully');
      setShowForwardModal(false);
      setForwardMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to forward complaint to NHC');
    } finally {
      setIsForwarding(false);
    }
  };

  const canForwardToNHC = () => {
    return notification.type === 'complaint_submitted_to_admin' || 
           notification.type === 'complaint_updated';
  };

  const isUserMessage = () => {
    return notification.type === 'message_sent_to_admin' || 
           notification.metadata?.messageType === 'user_message';
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsReplying(true);
    try {
      // TODO: Implement API call to reply to message
      // await replyToMessageMutation({
      //   messageId: notification.metadata?.messageId,
      //   reply: replyMessage,
      //   adminId: user._id,
      //   userId: notification.userId
      // }).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Reply sent successfully');
      setShowReplyModal(false);
      setReplyMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon className={`w-6 h-6 ${iconColor}`} />
              Notification Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row gap-3 items-start justify-between ">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{notification.title}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                      {notification.type.replace(/_/g, ' ')}
                    </Badge>
                    {notification.priority && (
                      <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                        {notification.priority} Priority
                      </Badge>
                    )}
                    {!notification.isRead && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification._id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(notification._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {isUserMessage() ? 'User Message' : 'Message'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isUserMessage() ? (
                  <div className="space-y-4">
                    {/* User Message Details */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">From:</Label>
                          <p className="font-medium">{notification.metadata?.senderName || 'Unknown'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Subject:</Label>
                          <p className="font-medium">{notification.metadata?.subject || 'No Subject'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Message ID:</Label>
                          <p className="text-sm font-mono text-gray-600">{notification.metadata?.messageId}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">User ID:</Label>
                          <p className="text-sm font-mono text-gray-600">{notification.userId}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message Body */}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Message Body:</Label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {notification.metadata?.messageBody || notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {notification.message}
                    </p>
                    {notification?.metadata?.category && (
                      <p className="text-gray-800 font-bold leading-relaxed whitespace-pre-wrap mt-2">
                        Category: {notification?.metadata?.category}
                      </p>
                    )}
                   
                    {notification?.metadata?.subject && (
                      <p className="text-gray-800 font-bold leading-relaxed whitespace-pre-wrap mt-2">
                        Subject: {notification?.metadata?.subject}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Timing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {notification.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(notification.updatedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Source Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {notification.from && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">{notification.from}</span>
                    </div>
                  )}
                  {notification.userId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium text-sm">{notification.userId}</span>
                    </div>
                  )}
                  {notification.cooperativeId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cooperative:</span>
                      <span className="font-medium text-sm">{notification.cooperativeId}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {isUserMessage() && (
                  <Button
                    onClick={() => setShowReplyModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                )}
                {canForwardToNHC() && (
                  <Button
                    onClick={() => setShowForwardModal(true)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Forward className="w-4 h-4 mr-2" />
                    Forward to NHC
                  </Button>
                )}
              </div>
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forward to NHC Modal */}
      <Dialog open={showForwardModal} onOpenChange={setShowForwardModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Forward className="w-5 h-5" />
              Forward to NHC
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Original Complaint:</h4>
              <Card className="p-4 bg-gray-50">
                <p className="text-sm text-gray-700">{notification.message}</p>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forward-message">
                Additional Information for NHC *
              </Label>
              <Textarea
                id="forward-message"
                placeholder="Add any additional context, investigation findings, or recommendations for NHC..."
                value={forwardMessage}
                onChange={(e) => setForwardMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This information will be sent along with the original complaint to NHC for further action.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForwardModal(false);
                  setForwardMessage('');
                }}
                disabled={isForwarding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleForwardToNHC}
                disabled={isForwarding || !forwardMessage.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isForwarding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Forwarding...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Forward to NHC
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="w-5 h-5" />
              Reply to Message
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Original Message:</h4>
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>From:</strong> {notification.metadata?.senderName || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Subject:</strong> {notification.metadata?.subject || 'No Subject'}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {notification.metadata?.messageBody || notification.message}
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply-message">
                Your Reply *
              </Label>
              <Textarea
                id="reply-message"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Your reply will be sent directly to the user who sent this message.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage('');
                }}
                disabled={isReplying}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReply}
                disabled={isReplying || !replyMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isReplying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationDetailModal;
