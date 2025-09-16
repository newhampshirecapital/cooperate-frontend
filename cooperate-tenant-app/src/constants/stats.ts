import { 
  DollarSign, 
  HomeIcon, 
  TrendingUp, 
  Zap,
  User,
  LogOut,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  MessageSquare,
  CreditCard,
  AlertTriangle,
  Wallet,
  FileText,
  Settings,
  Wrench,
  Bell,
  Info
} from "lucide-react";

export   const stats = [
    {
      title: 'Total Energy Generated',
      value: '2,847 kWh',
      change: '+12%',
      icon: Zap,
      color: 'text-green-600'
    },
    {
      title: 'Energy Consumed',
      value: '1,923 kWh',
      change: '-5%',
      icon: HomeIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Energy Purchased',
      value: '924 kWh',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Requests',
      value: '$156.80',
      change: '+23%',
      icon: DollarSign,
      color: 'text-green-600'
    }
  ];

  export const recentTransactions = [
    { id: 1, type: 'electricity Token', amount: '45 kWh', price: '$7.20', from: 'BEDC', time: '2 hours ago' },
    { id: 2, type: 'paid contribution', amount: '10000 Naira', price: '$3.68', from: 'Sarah Johnson', time: '4 hours ago' },
    { id: 3, type: 'electricity Token', amount: '45 kWh', price: '$10.72', to: 'Mike Wilson', time: '6 hours ago' },
  ];

  export const NotificationType = {
    // Auth Events
    USER_LOGIN: 'user_login' as const,
    USER_LOGOUT: 'user_logout' as const,
    USER_REGISTRATION: 'user_registration' as const,
    PASSWORD_RESET: 'password_reset' as const,
    EMAIL_VERIFICATION: 'email_verification' as const,
    
    // Admin Events
    USER_INVITED: 'user_invited' as const,
    USER_ROLE_CHANGED: 'user_role_changed' as const,
    USER_APPROVED: 'user_approved' as const,
    USER_REJECTED: 'user_rejected' as const,
    ADMIN_MESSAGE: 'admin_message' as const,
    
    // Payment Events
    PAYMENT_SUCCESS: 'payment_success' as const,
    PAYMENT_FAILED: 'payment_failed' as const,
    CONTRIBUTION_RECORDED: 'contribution_recorded' as const,
    WALLET_UPDATED: 'wallet_updated' as const,
    
    // Support Events
    COMPLAINT_SUBMITTED: 'complaint_submitted' as const,
    COMPLAINT_UPDATED: 'complaint_updated' as const,
    SUPPORT_REPLY: 'support_reply' as const,
    
    // System Events
    SYSTEM_MAINTENANCE: 'system_maintenance' as const,
    SYSTEM_UPDATE: 'system_update' as const,
    GENERAL_ANNOUNCEMENT: 'general_announcement' as const,
  } as const;

  // Icon mapping for notification types
  export const NotificationIcons = {
    // Auth Events
    user_login: User,
    user_logout: LogOut,
    user_registration: UserPlus,
    password_reset: Shield,
    email_verification: CheckCircle,
    
    // Admin Events
    user_invited: UserPlus,
    user_role_changed: Shield,
    user_approved: CheckCircle,
    user_rejected: XCircle,
    admin_message: MessageSquare,
    
    // Payment Events
    payment_success: CreditCard,
    payment_failed: AlertTriangle,
    contribution_recorded: Wallet,
    wallet_updated: Wallet,
    
    // Support Events
    complaint_submitted: FileText,
    complaint_updated: FileText,
    support_reply: MessageSquare,
    
    // System Events
    system_maintenance: Wrench,
    system_update: Settings,
    general_announcement: Bell,
    
    // Fallback
    default: Info,
  } as const;

  // Color mapping for notification types
  export const NotificationColors = {
    // Auth Events
    user_login: 'text-green-600',
    user_logout: 'text-gray-600',
    user_registration: 'text-blue-600',
    password_reset: 'text-orange-600',
    email_verification: 'text-green-600',
    
    // Admin Events
    user_invited: 'text-blue-600',
    user_role_changed: 'text-purple-600',
    user_approved: 'text-green-600',
    user_rejected: 'text-red-600',
    admin_message: 'text-blue-600',
    
    // Payment Events
    payment_success: 'text-green-600',
    payment_failed: 'text-red-600',
    contribution_recorded: 'text-green-600',
    wallet_updated: 'text-blue-600',
    
    // Support Events
    complaint_submitted: 'text-orange-600',
    complaint_updated: 'text-blue-600',
    support_reply: 'text-green-600',
    
    // System Events
    system_maintenance: 'text-orange-600',
    system_update: 'text-blue-600',
    general_announcement: 'text-purple-600',
    
    // Fallback
    default: 'text-gray-600',
  } as const;
