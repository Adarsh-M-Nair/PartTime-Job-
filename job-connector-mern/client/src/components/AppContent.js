import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthPage from '../pages/AuthPage';
import StudentDashboard from '../pages/StudentDashboard';
import EmployerDashboard from '../pages/EmployerDashboard';

const AppContent = () => {
    const { user } = useAuth();
    
    if (!user) {
        return <AuthPage />;
    }
    if (user.type === 'student') {
        return <StudentDashboard />;
    }
    if (user.type === 'employer') {
        return <EmployerDashboard />;
    }
};

export default AppContent;
