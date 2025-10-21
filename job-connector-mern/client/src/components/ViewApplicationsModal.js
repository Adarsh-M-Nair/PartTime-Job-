import React from 'react';
import Modal from './Modal';

const ViewApplicationsModal = ({ job, onClose }) => {
    // TODO: Fetch applications for the given job ID
    const applications = [
        { studentName: 'Charlie Brown', studentEmail: 'charlie@email.com', coverLetter: 'I am very enthusiastic and a hard worker!', appliedAt: new Date() },
        { studentName: 'Lucy van Pelt', studentEmail: 'lucy@email.com', coverLetter: 'I have extensive experience and would be a perfect fit.', appliedAt: new Date() }
    ];

    return (
         <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-2xl font-bold">Applications for {job.title}</h2>
            <div className="mt-4 -mx-6 px-6 border-t border-b border-gray-200 max-h-[60vh] overflow-y-auto">
                 {applications.length > 0 ? applications.map((app, index) => (
                    <div key={index} className="py-4 border-b last:border-b-0">
                        <p className="font-semibold text-gray-800">{app.studentName}</p>
                        <p className="text-sm text-indigo-600 hover:underline cursor-pointer">{app.studentEmail}</p>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{app.coverLetter}</p>
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
