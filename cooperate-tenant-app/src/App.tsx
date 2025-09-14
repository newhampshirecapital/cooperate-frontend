import { type ReactNode } from "react";
import { Layout } from "./Layout"
import HomePage from "./pages/Home/Home";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
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

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  
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
  const { user } = useAuth();

  // Define auth routes that don't require authentication
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp', '/resendOtpPage', '/request-membership'];
  const isAuthRoute = authRoutes.includes(location.pathname);
  const isCreateCooperativeRoute = location.pathname === '/create-cooperative';

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
      <Route 
        path="/create-cooperative" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreateCooperative />
          </ProtectedRoute>
        } 
      />
      
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
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Transactions</h1>
                <p className="text-gray-600">Transaction history will be displayed here.</p>
              </div>
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
        path="/meters" 
        element={
          <ProtectedRoute>
            <Layout>
              <MetersPage />
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

