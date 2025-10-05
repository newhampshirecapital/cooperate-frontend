import { type ReactNode } from "react";
import { Layout } from "./Layout"
import HomePage from "./pages/Home/Home";
import { LoginPage } from "./pages/auth/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { VerifyOTPPage } from "./pages/auth/VerifyOTP";
import ResendOtpPage from "./pages/auth/ResendOtpPage";
import { ForgotPasswordPage } from "./pages/auth/ForgorPassword";
import { ResetPasswordPage } from "./pages/auth/ResetPassword";
import { BillsPage } from "./pages/Bills";
import { ProfilePage } from "./pages/Profile";
import { ComplaintsPage } from "./pages/Complaints";
import { MetersPage } from "./pages/Meters";
import MembershipRequestPage from "./pages/auth/MembershipRequestPage";
import CreateCooperative from "./pages/onboarding/CreateCooperative";
import { NotificationsPage } from "./pages/Notification";
import { TransactionsPage } from "./pages/Transactions";
import InviteUser from "./pages/Admin/InviteUser";
import PendingInvites from "./pages/Admin/pendingInvites";
import AboutPage from "./pages/About";
import FAQPage from "./pages/FAQ";
import PrivacyPage from "./pages/Privacy";
import SupportPage from "./pages/Support";
import TermsPage from "./pages/Terms";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateVirtualAccount from "./pages/virtual-account/CreateVirtualAccount";
import RecordCooperativeAccount from "./pages/bank/recordBankAccount";
import CreateSavingsTarget from "./pages/CreateSavingsTarget";
import AllActivities from "./pages/AllActivities";
import ContributionPayment from "./pages/ContributionPayment";
import {RegisterPage} from "./pages/auth/Register";
import SavingsTargetPage from "./pages/SavingsTarget";
import SavingsTargetDetails from "./pages/SavingsTargetDetails";
import UserContributionsPage from "./pages/UserContributions";
import AdminContributionsPage from "./pages/Admin/AdminContributions";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  // Don't redirect while loading - let the parent component handle loading state
  if (isLoading) {
    return null;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export function AppContent() {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // Define auth routes that don't require authentication
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp', '/resendOtpPage', '/request-membership'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isCreateCooperativeRoute = location.pathname === '/create-cooperative';

  // Show loading spinner while authentication state is being restored
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and not on auth pages or create-cooperative, redirect to login
  if (!user && !isAuthRoute && !isCreateCooperativeRoute) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and on auth pages, redirect to home
  if (user && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  // If admin user doesn't have a cooperative and is not already on create-cooperative page, redirect to create cooperative page
  if (user && user.role === 'admin' && !user.cooperativeId && !user.cooperateId && !isCreateCooperativeRoute) {
    return <Navigate to="/create-cooperative" replace />;
  }

  // If non-admin user tries to access create-cooperative page, redirect to home
  if (user && user.role !== 'admin' && isCreateCooperativeRoute) {
    return <Navigate to="/" replace />;
  }

  // If admin with cooperative tries to access create-cooperative page, redirect to home
  if (user && user.role === 'admin' && (user.cooperativeId || user.cooperateId) && isCreateCooperativeRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/resendOtpPage" element={<ResendOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/request-membership" element={<MembershipRequestPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route 
        path="/create-cooperative" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <CreateCooperative />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="/invite" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <InviteUser />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/pending-invites" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <PendingInvites />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bills" 
        element={
          <ProtectedRoute>
            <Layout>
              <BillsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/complaints" 
        element={
          <ProtectedRoute>
            <Layout>
              <ComplaintsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/applications" 
        element={
          <ProtectedRoute>
            <Layout>
              <MetersPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Layout>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-virtual-account" 
        element={
          <ProtectedRoute>
            <Layout>
              <CreateVirtualAccount />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-cooperative-account" 
        element={
          <ProtectedRoute>
            <Layout>
              <RecordCooperativeAccount />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/record-cooperative-account" 
        element={
          <ProtectedRoute>
            <Layout>
              <RecordCooperativeAccount />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-savings-target" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <CreateSavingsTarget />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/all-activities" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AllActivities />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contribute/:targetId" 
        element={
          <ProtectedRoute>
            <Layout>
              <ContributionPayment />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/savings-targets" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <SavingsTargetPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/savings-target/:id" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <SavingsTargetDetails />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-contributions" 
        element={
          <ProtectedRoute>
            <Layout>
              <UserContributionsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-contributions" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminContributionsPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      {/* Add more protected routes here as needed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}

