import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing authentication on app load
    useEffect(() => {
        const initAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    // Login with email and password
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const userData = {
                id: response._id,
                email: response.email,
                role: response.role,
                isProfileComplete: response.isProfileComplete,
            };
            authService.storeAuthData(userData, response.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    // Register new user
    const register = async (email, password, userType, name) => {
        try {
            const response = await authService.register(email, password, userType, name);
            const userData = {
                id: response._id,
                email: response.email,
                role: response.role,
                isProfileComplete: response.isProfileComplete,
            };
            authService.storeAuthData(userData, response.token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    // Logout
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const authInfo = { 
        user, 
        login, 
        register, 
        logout, 
        loading,
        isAuthenticated: !!user 
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
