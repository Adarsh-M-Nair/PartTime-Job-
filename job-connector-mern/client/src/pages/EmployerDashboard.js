import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import PostJobModal from '../components/PostJobModal';
import ViewApplicationsModal from '../components/ViewApplicationsModal';

// Mock Data (replace with API calls)
const mockEmployerJobs = [
    { id: 'job5', title: 'Barista for Morning Shifts', employerName: 'The Local Cafe', location: '123 Main St', category: 'Food Service', payRate: '$17/hour', applicationCount: 12 },
    { id: 'job6', title: 'Flyer Distributor', employerName: 'The Local Cafe', location: 'Campus-wide', category: 'Marketing', payRate: '$15/hour', applicationCount: 34 }
];

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
    const [selectedJobForApps, setSelectedJobForApps] = useState(null);

    useEffect(() => {
        // TODO: API Call to fetch jobs for this employer
        setLoading(true);
        setTimeout(() => { // Simulate network delay
            setJobs(mockEmployerJobs);
            setLoading(false);
        }, 1000);
    }, []);

    const handleViewApplications = (job) => {
        setSelectedJobForApps(job);
        setIsApplicationsModalOpen(true);
    }
    
    if (loading) {
        return <div className="text-center p-10">Loading your job postings...</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">My Job Postings</h2>
                <button onClick={() => setIsPostModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
                    <PlusCircle className="w-5 h-5"/>
                    <span>Post a New Job</span>
                </button>
            </div>
            
            <div className="space-y-4">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                            <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <button onClick={() => handleViewApplications(job)} className="w-full sm:w-auto bg-indigo-100 text-indigo-800 px-4 py-2 rounded-md hover:bg-indigo-200 text-sm font-medium">
                            View Applications ({job.applicationCount})
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-10 px-6 bg-white rounded-lg shadow-sm">
                        <p>You haven't posted any jobs yet.</p>
                        <button onClick={() => setIsPostModalOpen(true)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 mx-auto">
                            <PlusCircle className="w-5 h-5"/>
                            <span>Post Your First Job</span>
                        </button>
                    </div>
                )}
            </div>

            {isPostModalOpen && <PostJobModal onClose={() => setIsPostModalOpen(false)} />}
            {isApplicationsModalOpen && <ViewApplicationsModal job={selectedJobForApps} onClose={() => setIsApplicationsModalOpen(false)} />}

        </div>
    );
};

export default EmployerDashboard;
