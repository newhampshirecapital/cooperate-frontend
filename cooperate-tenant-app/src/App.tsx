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
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp', '/resendOtpPage'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  // If user is not authenticated and not on auth pages, redirect to login
  if (!user && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and on auth pages, redirect to home
  if (user && isAuthRoute) {
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

