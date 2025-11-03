import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { applicationService } from '../services/applicationService';

const ViewApplicationsModal = ({ job, onClose }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
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
        if (job?.id) load();
    }, [job]);

    return (
         <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-2xl font-bold">Applications for {job.title}</h2>
            <div className="mt-4 -mx-6 px-6 border-t border-b border-gray-200 max-h-[60vh] overflow-y-auto">
                 {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                 ) : applications.length > 0 ? applications.map((app) => (
                    <div key={app._id} className="py-4 border-b last:border-b-0">
                        <p className="font-semibold text-gray-800">
                            {app.student_profile_id?.first_name} {app.student_profile_id?.last_name}
                        </p>
                        {app.student_profile_id?.university && (
                            <p className="text-sm text-gray-500">{app.student_profile_id.university}</p>
                        )}
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{app.cover_letter || 'No cover letter provided.'}</p>
                        <p className="text-xs text-gray-400 mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                 )) : <p className="text-center py-8 text-gray-500">No applications for this job yet.</p>}
            </div>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
            </div>
        </Modal>
    );
};

export default ViewApplicationsModal;
