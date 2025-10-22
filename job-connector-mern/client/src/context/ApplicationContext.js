import React, { createContext, useContext, useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { useAuth } from './AuthContext';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load applications from backend on mount
    useEffect(() => {
        if (user && user.role === 'Student') {
            loadApplications();
        }
    }, [user]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const applicationsData = await applicationService.getMyApplications();
            setApplications(applicationsData);
        } catch (error) {
            console.error('Error loading applications:', error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    // Submit a new application
    const submitApplication = async (jobId, coverLetter) => {
        try {
            const response = await applicationService.submitApplication(jobId, coverLetter);
            // Reload applications to get the latest data from backend
            await loadApplications();
            return response;
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    };

    // Get applications for current user
    const getUserApplications = () => {
        return applications;
    };

    // Update application status (for future use)
    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await applicationService.updateApplicationStatus(applicationId, newStatus);
            // Reload applications to get the latest data from backend
            await loadApplications();
        } catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    };

    const applicationInfo = {
        applications,
        loading,
        submitApplication,
        getUserApplications,
        updateApplicationStatus,
        loadApplications,
    };

    return (
        <ApplicationContext.Provider value={applicationInfo}>
            {children}
        </ApplicationContext.Provider>
    );
};

// Custom Hook to use Application Context
export const useApplications = () => {
    return useContext(ApplicationContext);
};
