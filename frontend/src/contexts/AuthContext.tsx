import { createContext, useContext, useEffect, useState } from "react";

type userData = {
    id: number;
    name: string;
    role: string;
    email: string;
    isAuthenticated: boolean;
} | null;

type AuthContextType = {
    user: userData;
    login: (userData:Exclude<userData, null>) => void;
    logout: () => void;
}

type AuthProviderProps = {
    children: React.ReactNode;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
const [user, setUser] = useState<userData>(null);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
        const storeUser = localStorage.getItem("user");
        if (storeUser) {
            setUser(JSON.parse(storeUser));
        }
            setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Mock user data for demonstration purposes
    // const userData: userData = {
    //     id: 1,
    //     name: "Test User",
    //     role: "admin",
    //     isAunthenticated: true,
    // };

    const login = (userData: userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    }

      if (loading) return <div>Loading...</div>; // ⏳ wait for user data

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
