import { useLoginMutation, useRegisterMutation } from '../api/api';
import type { LoginPayload, RegisterPayload } from '../interface/auth';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { secureTokenStorage, secureStorage } from '../lib/secureStorage';

interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'member';
  cooperativeId?: string;
  cooperateId?: string; // Handle API typo
  isVerified: boolean;
  isBlocked: boolean;
  wallet: number;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registerMutation] = useRegisterMutation()
  const [loginMutation] = useLoginMutation();

  // Initialize tokens from secure storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [storedToken, storedRefreshToken, storedUser] = await Promise.all([
          secureTokenStorage.getToken(),
          secureTokenStorage.getRefreshToken(),
          secureStorage.getItem('user')
        ]);
        
        if (storedToken && storedRefreshToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          
          // Restore user data if available
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (parseError) {
              console.warn('Failed to parse stored user data:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth from secure storage:', error);
        // Clear any corrupted tokens
        await secureTokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);


  const register = async (payload: RegisterPayload) => {
    try {
      await registerMutation(payload).unwrap();
      toast.success('Registration successful! Please login to continue.');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Re-throw the error with proper formatting for the component to handle
      if (error?.data?.message) {
        throw { data: { message: error.data.message } };
      } else if (error?.error?.data?.message) {
        throw { data: { message: error.error.data.message } };
      } else {
        throw error;
      }
    }
  };


  const login = async (payload: LoginPayload) => {
    try {
      const response = await loginMutation(payload).unwrap();
      const { token: accessToken, refreshToken: newRefreshToken, ...userProfile } = response.data;
      
      // Store tokens and user data securely with 24-hour expiration
      const tokenExpiration = 24 * 60 * 60 * 1000; // 24 hours
      await Promise.all([
        secureTokenStorage.setToken(accessToken, tokenExpiration),
        secureTokenStorage.setRefreshToken(newRefreshToken, tokenExpiration * 7), // Refresh token lasts 7 days
        secureStorage.setItem('user', JSON.stringify(userProfile), { expireIn: tokenExpiration })
      ]);

      setToken(accessToken);
      setRefreshToken(newRefreshToken);
      setUser({ ...userProfile });
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

 

  const logout = async () => {
    try {
      // Clear all tokens and user data from secure storage
      secureTokenStorage.clearTokens();
      secureStorage.removeItem('user');
      
      // Clear state
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      
      // Optional: Call logout endpoint to invalidate tokens on server
      // await logoutMutation().unwrap();
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user to update');
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update user data in secure storage
      await secureStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };
 



  

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        register,
        login,
        logout,
        updateUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}