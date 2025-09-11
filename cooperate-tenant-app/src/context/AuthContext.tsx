import { useRegisterMutation } from '../api/api';
import type { RegisterPayload } from '../interface/auth';
import { createContext, useContext, type ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  cooperativeId?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;

  register: (payload: RegisterPayload) => Promise<void>;



}

interface AuthProviderProps {
    children: ReactNode;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
 

  const [registerMutation] = useRegisterMutation()


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



 



  

  return (
    <AuthContext.Provider
      value={{
        user:null,
        register,
       
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