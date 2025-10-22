import React from 'react';
import { useApplications } from '../context/ApplicationContext';

const MyApplications = () => {
    const { getUserApplications, loading } = useApplications();
    const applications = getUserApplications();

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500 text-lg">Loading applications...</p>
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'interview': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    if (applications.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500 text-lg">No applications submitted yet.</p>
                <p className="text-gray-400 text-sm mt-2">Apply to jobs to see them here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {applications.map(app => (
                <div key={app._id} className="p-4 border rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                     <div className="flex-1">
                        <p className="font-bold text-lg text-gray-800">{app.job_id?.title || 'Job Title'}</p>
                        <p className="text-gray-600">{app.job_id?.company_name || 'Company Name'}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        {app.cover_letter && (
                            <p className="text-gray-500 text-sm mt-2 italic">
                                "{app.cover_letter.substring(0, 100)}{app.cover_letter.length > 100 ? '...' : ''}"
                            </p>
                        )}
                     </div>
                     <span className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(app.status)}`}>
                         {app.status}
                     </span>
                </div>
            ))}
        </div>
    );
};

export default MyApplications;
