import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string) => void;
    logout: () => void;
    user: { email: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start as loading
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);

    useEffect(() => {
        // Restore auth state from localStorage on app start
        const storedAuth = localStorage.getItem("isAuthenticated");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
            setUser({ email: "admin@gmail.com", name: "Admin" });
        }
        setIsLoading(false); // Done checking — allow routing to proceed
    }, []);

    const login = (email: string) => {
        setIsAuthenticated(true);
        setUser({ email, name: "Admin" });
        localStorage.setItem("isAuthenticated", "true");
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("isAuthenticated");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
