import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, login as apiLogin, setToken, logout as doLogout } from "./auth";

interface User {
  id: string;
  name: string;
  email: string;
  // adicione outros campos conforme sua API
}

interface AuthContextType {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

   const handleLogin = async (email: string, password: string) => {
    const response = await apiLogin(email, password);

    if (response && response.access_token) {
      setToken(response.token); 
      setUser(response.user); 
    } else {
      throw new Error("Login falhou, token não recebido.");
    }
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
