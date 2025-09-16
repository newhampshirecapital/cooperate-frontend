import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Footer } from './components/Footer';
import { 
  Home, 
  History, 
  User, 
  //Settings, 
  LogOut,
  Zap,
  Menu,
  X,
  CreditCard,
  BellElectric,
  MessageCircle,
  Bell,
  UserPlus,
  PersonStanding
  
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useGetAllpendingInvitesQuery } from './api/api';
import NotificationTab from './components/ui/notification-tab';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const { data: pendingInvites } = useGetAllpendingInvitesQuery({id: user?.cooperateId || ''});

  

//   if (!user || !user.isVerified || !user.cooperativeId) {
//     return <>{children}</>;
//   }

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'transactions', label: 'Transactions', icon: History, path: '/transactions' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    {id: 'bills', label: 'Bills & Payment', icon: CreditCard, path: '/bills' },
    {id: 'complaint', label: 'Complaints', icon: MessageCircle, path: '/complaints' },
    {id: 'meters', label: 'Meters', icon: BellElectric, path: '/meters' },
    {id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
    ...(user?.role === 'admin' ? [{ id: 'invite', label: 'Invite', icon: UserPlus, path: '/invite' }] : []),
    ...(user?.role === 'admin' ? [{ id: 'pending invites', label: 'Pending Invites', icon: PersonStanding, path: '/pending-invites' }] : [])
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">EnergyCooperative</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">Welcome {user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Navigation */}
          <nav className={`
            fixed lg:static top-0 left-0 h-full lg:h-auto z-50 lg:z-auto
            w-64 bg-white rounded-lg shadow-sm p-6
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isPendingInvites = item.id === 'pending invites';
                const inviteCount = pendingInvites?.data?.length || 0;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-accent'}`}
                      onClick={() => handleNavigation(item.path || '')}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isPendingInvites && inviteCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          {inviteCount}
                        </Badge>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1 w-full lg:w-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Animated Notification Tab */}
      {pendingInvites && pendingInvites.data.length > 0 && showNotification && (
        <NotificationTab
          message="You have pending invites!"
          count={pendingInvites.data.length}
          onClose={() => setShowNotification(false)}
          autoHide={true}
          delay={3000}
          duration={5000}
        />
      )}
    </div>
  );
}