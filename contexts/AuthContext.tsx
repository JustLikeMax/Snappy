import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { AuthService, User } from "../services/AuthService";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        age?: number;
        bio?: string;
        location?: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (
        data: Partial<User> & { profile_image_url?: string }
    ) => Promise<void>;
    setUser: (user: User | null) => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const checkAuthState = async () => {
        try {
            setIsLoading(true);
            const token = await AuthService.getToken();

            if (token) {
                const userData = await AuthService.getCurrentUser();
                setUser(userData);
            }
        } catch (authError) {
            // Token might be expired or invalid
            console.warn("Auth check failed:", authError);
            await AuthService.removeToken();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthState();
    }, []);
    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Test connection first
            await AuthService.testConnection();

            const response = await AuthService.login({ email, password });
            setUser(response.user);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Login failed");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const register = async (data: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        age?: number;
        bio?: string;
        location?: string;
    }) => {
        try {
            setIsLoading(true);
            setError(null);

            // Test connection first
            await AuthService.testConnection();

            const response = await AuthService.register(data);
            setUser(response.user);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Registration failed"
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const updateProfile = async (
        data: Partial<User> & { profile_image_url?: string }
    ) => {
        try {
            setError(null);
            const updatedUser = await AuthService.updateProfile(data);
            setUser(updatedUser);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Profile update failed"
            );
            throw error;
        }
    };
    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        setUser,
        error,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
