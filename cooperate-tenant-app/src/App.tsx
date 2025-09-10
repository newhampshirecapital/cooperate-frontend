import { useState } from "react";
import { Layout } from "./Layout"
import HomePage from "./pages/Home/Home";
import { Toaster } from "sonner";
import { LoginPage } from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";


export function AppContent(){
  const [currentPage, setCurrentPage] = useState('home');
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot'>('login');

  const user = null;

  if (!user) {
    switch (authPage) {
      case 'register':
        return <RegisterPage  />;
      // case 'forgot':
      //   return <ForgotPasswordPage onSwitchToLogin={() => setAuthPage('login')} />;
      default:
        return (
          <LoginPage
            onSwitchToRegister={() => setAuthPage('register')}
            onSwitchToForgotPassword={() => setAuthPage('forgot')}
          />
        );
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      // case 'transactions':
      //   return <TransactionsPage />;
      // case 'profile':
      //   return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" />
    </>
    
  );
}

