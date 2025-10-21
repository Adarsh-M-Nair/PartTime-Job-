import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';
import Modal from './Modal';

const JobDetailsModal = ({ job, onClose }) => {
    // TODO: Implement application submission logic
    const handleApply = (e) => {
        e.preventDefault();
        alert('Application submitted! (This is a placeholder)');
        onClose();
    };

    return (
        <Modal isOpen={!!job} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-3xl font-bold mb-2">{job.title}</h2>
                <p className="text-lg text-gray-700 font-semibold">{job.employerName}</p>
                <p className="text-gray-500 mb-4 flex items-center"><MapPin className="w-4 h-4 mr-2"/>{job.location}</p>
                <div className="flex space-x-4 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full">{job.category}</span>
                    <span className="font-semibold text-green-600 text-lg flex items-center"><DollarSign className="w-4 h-4 mr-1"/>{job.payRate}</span>
                </div>
                <h4 className="font-semibold mt-6 mb-2 text-gray-800">Job Description</h4>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                <form onSubmit={handleApply} className="mt-8">
                    <h4 className="font-semibold mb-2 text-gray-800">Apply Now</h4>
                    <div>
                        <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700">Cover Letter / Short Message</label>
                        <textarea id="cover-letter" rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                         <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit Application</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default JobDetailsModal;
