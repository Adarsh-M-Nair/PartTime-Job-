import React from 'react';
import Modal from './Modal';

const PostJobModal = ({ onClose }) => {
    // TODO: Implement job posting logic
    const handlePostJob = (e) => {
        e.preventDefault();
        alert('Job posted! (This is a placeholder)');
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                    <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input type="text" id="job-title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="job-category" className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" id="job-category" placeholder="e.g., Catering" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                     <div>
                        <label htmlFor="job-payrate" className="block text-sm font-medium text-gray-700">Pay Rate</label>
                        <input type="text" id="job-payrate" placeholder="e.g., $15/hour" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
                 <div>
                    <label htmlFor="job-location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" id="job-location" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="job-description" rows="5" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Post Job</button>
                </div>
            </form>
        </Modal>
    );
};

export default PostJobModal;
