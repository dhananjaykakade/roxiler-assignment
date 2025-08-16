import { createContext, useContext, useState, ReactNode ,useEffect} from "react";
import api from "@/api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | undefined>;
  logout: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const { token, User } = res.data.data;
      const userData: User = { token, role: User.role, name: User.name, email: User.email , id: User.id};

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      localStorage.setItem("role", User.role);

      setUser(userData);

      return userData;

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error , setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};