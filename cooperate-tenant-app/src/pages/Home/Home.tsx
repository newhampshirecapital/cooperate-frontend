import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';

const HomePage = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to Cooperate!</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="font-semibold">User Information</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
            </div>
            
            <Button 
              onClick={logout}
              variant="outline"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
            <Button asChild className="w-full">
              <a href="/login">Login</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
