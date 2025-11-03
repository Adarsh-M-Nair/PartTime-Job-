import React, { useState } from 'react';
import Modal from './Modal';
import { jobService } from '../services/jobService';

const PostJobModal = ({ onClose, onJobPosted }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        payRate: '',
        location: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id.replace('job-', '');
        
        // Map field names to match the form data structure
        const fieldMapping = {
            'title': 'title',
            'category': 'category',
            'payrate': 'payRate', // Fix the case mismatch
            'location': 'location',
            'description': 'description'
        };
        
        const mappedFieldName = fieldMapping[fieldName] || fieldName;
        
        setFormData(prev => ({
            ...prev,
            [mappedFieldName]: value
        }));
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Extract hourly rate from pay rate string
            const hourlyRate = parseFloat(formData.payRate.replace(/[^0-9.]/g, ''));
            
            // Map category to category_id
            const categoryMap = {
                'Catering': 1,
                'Delivery': 2,
                'Tutoring': 3,
                'Retail': 4,
                'Other': 5
            };
            const categoryId = categoryMap[formData.category] || 5;
            
            const jobData = {
                title: formData.title,
                description: formData.description,
                hourly_rate: hourlyRate,
                estimated_hours: 8, // Default value
                location_details: formData.location,
                category_id: categoryId
            };
            
            await jobService.createJob(jobData);
            alert('Job posted successfully!');
            onJobPosted && onJobPosted(); // Notify parent component
            onClose();
        } catch (error) {
            console.error('Error posting job:', error);
            const errorMessage = error.response?.data?.message || 'Failed to post job. Please try again.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                    <label htmlFor="job-title" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input 
                        type="text" 
                        id="job-title" 
                        value={formData.title || ''}
                        onChange={handleInputChange}
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="job-category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select 
                            id="job-category" 
                            value={formData.category || ''}
                            onChange={handleInputChange}
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Select Category</option>
                            <option value="Catering">Catering</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Tutoring">Tutoring</option>
                            <option value="Retail">Retail</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="job-payrate" className="block text-sm font-medium text-gray-700">Pay Rate</label>
                        <input 
                            type="text" 
                            id="job-payrate" 
                            value={formData.payRate || ''}
                            onChange={handleInputChange}
                            placeholder="e.g., $15/hour" 
                            required 
                            disabled={isSubmitting}
                            autoComplete="off"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
                 <div>
                    <label htmlFor="job-location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input 
                        type="text" 
                        id="job-location" 
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        id="job-description" 
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows="5" 
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PostJobModal;
