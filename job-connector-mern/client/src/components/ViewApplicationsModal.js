import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { applicationService } from '../services/applicationService';
import { CheckCircle, XCircle } from 'lucide-react';

const ViewApplicationsModal = ({ job, onClose, onApplicationUpdated }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const apps = await applicationService.getJobApplications(job.id);
            setApplications(apps);
        } catch (e) {
            console.error('Failed to load applications', e);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (job?.id) loadApplications();
    }, [job]);

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdating(applicationId);
        try {
            await applicationService.updateApplicationStatus(applicationId, newStatus);
            // Reload applications to get updated status
            await loadApplications();
            // Notify parent to refresh job list (to update count)
            if (onApplicationUpdated) {
                onApplicationUpdated();
            }
        } catch (error) {
            console.error('Failed to update application status:', error);
            alert('Failed to update application status. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    return (
         <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-2xl font-bold">Applications for {job.title}</h2>
            <div className="mt-4 -mx-6 px-6 border-t border-b border-gray-200 max-h-[60vh] overflow-y-auto">
                 {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                 ) : applications.length > 0 ? applications.map((app) => {
                    // Handle various data structures for student_profile_id
                    let studentProfile = app.student_profile_id;
                    
                    // If it's a string (ObjectId), it wasn't populated
                    if (typeof studentProfile === 'string') {
                        studentProfile = null;
                    }
                    
                    // Extract name with fallbacks - remove "User" suffix if last name is same as first name
                    const firstName = studentProfile?.first_name || '';
                    let lastName = studentProfile?.last_name || '';
                    // If last name is same as first name or is "User", don't include it
                    if (lastName === firstName || lastName === 'User' || !lastName.trim()) {
                        lastName = '';
                    }
                    const fullName = lastName 
                        ? `${firstName} ${lastName}`.trim() 
                        : firstName || 'Student';
                    
                    const getStatusBadge = (status) => {
                        const statusColors = {
                            'Pending': 'bg-yellow-100 text-yellow-800',
                            'Reviewed': 'bg-blue-100 text-blue-800',
                            'Interview': 'bg-purple-100 text-purple-800',
                            'Hired': 'bg-green-100 text-green-800',
                            'Rejected': 'bg-red-100 text-red-800'
                        };
                        return statusColors[status] || 'bg-gray-100 text-gray-800';
                    };

                    return (
                    <div key={app._id} className="py-4 border-b last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">
                                    {fullName}
                                </p>
                                {studentProfile?.university && (
                                    <p className="text-sm text-gray-500">{studentProfile.university}</p>
                                )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                                {app.status}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{app.cover_letter || 'No cover letter provided.'}</p>
                        <p className="text-xs text-gray-400 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        
                        {/* Accept/Reject Buttons - only show if status is Pending or Reviewed */}
                        {(app.status === 'Pending' || app.status === 'Reviewed') && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleStatusUpdate(app._id, 'Hired')}
                                    disabled={updating === app._id}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {updating === app._id ? 'Updating...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                    disabled={updating === app._id}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    <XCircle className="w-4 h-4" />
                                    {updating === app._id ? 'Updating...' : 'Reject'}
                                </button>
                            </div>
                        )}
                    </div>
                    );
                 }) : <p className="text-center py-8 text-gray-500">No applications for this job yet.</p>}
            </div>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
            </div>
        </Modal>
    );
};

export default ViewApplicationsModal;
