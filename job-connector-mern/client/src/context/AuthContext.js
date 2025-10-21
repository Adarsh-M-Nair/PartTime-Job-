import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { name: 'Alex Doe', type: 'student' } or { name: 'The Local Cafe', type: 'employer' }

    // Simulate login
    const login = (email, userType) => {
        if (userType === 'student') {
            setUser({ name: 'Alex Doe', email: email, type: 'student' });
        } else {
            setUser({ name: 'The Local Cafe', email: email, type: 'employer' });
        }
    };

    // Simulate logout
    const logout = () => {
        setUser(null);
    };

    const authInfo = { user, login, logout };

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
