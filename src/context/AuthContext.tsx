import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  userEmail: string | null;
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if a user is already logged in when the app starts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (storedEmail && storedToken) {
          setUserEmail(storedEmail);
          setUserToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const login = async (email: string, token: string) => {
    await AsyncStorage.setItem('userEmail', email);
    await AsyncStorage.setItem('userToken', token);
    setUserEmail(email);
    setUserToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userToken');
    setUserEmail(null);
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userEmail, userToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};