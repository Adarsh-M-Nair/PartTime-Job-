import React from 'react';

const MyApplications = () => {
    // TODO: fetch this data from an API
    const applications = [
        { id: 'app1', jobId: 'job3', studentId: 'student1', status: 'pending', jobTitle: 'Math & Physics Tutor', employerName: 'Academic Success Center' },
        { id: 'app2', jobId: 'job4', studentId: 'student1', status: 'accepted', jobTitle: 'Retail Associate', employerName: 'College Bookstore' }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {applications.map(app => (
                <div key={app.id} className="p-4 border rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                     <div>
                        <p className="font-bold text-lg text-gray-800">{app.jobTitle}</p>
                        <p className="text-gray-600">{app.employerName}</p>
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
