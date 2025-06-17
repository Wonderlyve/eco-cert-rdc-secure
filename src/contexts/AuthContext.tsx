
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'establishment' | 'student' | 'employer' | 'citizen';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institution?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  institution?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler la vérification du token au démarrage
    const token = localStorage.getItem('ecert_token');
    const userData = localStorage.getItem('ecert_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('ecert_token');
        localStorage.removeItem('ecert_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulation d'authentification (à remplacer par vraie API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email === 'admin@ecert.cd' ? 'Administrateur' : 'Utilisateur Test',
      role: email === 'admin@ecert.cd' ? 'admin' : 'student',
      institution: 'Université de Kinshasa',
      verified: true
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('ecert_token', mockToken);
    localStorage.setItem('ecert_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      institution: userData.institution,
      verified: userData.role !== 'establishment' // Les établissements nécessitent vérification manuelle
    };
    
    const mockToken = 'mock_jwt_token_' + Date.now();
    
    localStorage.setItem('ecert_token', mockToken);
    localStorage.setItem('ecert_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('ecert_token');
    localStorage.removeItem('ecert_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
