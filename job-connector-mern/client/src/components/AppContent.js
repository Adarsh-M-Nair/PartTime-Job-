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
    if (user.role === 'Student') {
        return <StudentDashboard />;
    }
    if (user.role === 'Employer') {
        return <EmployerDashboard />;
    }
    
    return <div>Unknown user type: {user.role}</div>;
};

export default AppContent;
