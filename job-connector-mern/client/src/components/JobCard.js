import React from 'react';
import { MapPin, DollarSign } from 'lucide-react';

const JobCard = ({ job, onSelect }) => (
    <div onClick={onSelect} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-transparent hover:border-indigo-500">
        <h3 className="text-xl font-bold text-indigo-700 truncate">{job.title}</h3>
        <p className="text-gray-600 mt-1">{job.employerName}</p>
        <div className="flex items-center text-gray-500 text-sm mt-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{job.category}</span>
            <span className="font-semibold text-green-600 flex items-center"><DollarSign className="w-4 h-4 mr-1"/>{job.payRate}</span>
        </div>
    </div>
);

export default JobCard;
