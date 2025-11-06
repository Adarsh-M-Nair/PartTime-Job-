import React, { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Search, ChevronDown, User } from 'lucide-react';
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobDetailsModal';
import MyApplications from '../components/MyApplications';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [view, setView] = useState('jobs'); // 'jobs' or 'applications'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const jobsData = await jobService.getJobs();
            // Transform backend data to frontend format
            const transformedJobs = jobsData.map(job => ({
                id: job._id,
                title: job.title,
                employerName: job.company_name,
                location: job.location_details,
                category: getCategoryName(job.category_id),
                payRate: `$${job.hourly_rate}/hour`,
                description: job.description,
                postedAt: new Date(job.createdAt)
            }));
            setJobs(transformedJobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
            // Fallback to mock data if API fails
            setJobs([
                { id: 'job1', title: 'Catering Assistant for Weekend Event', employerName: 'Gourmet Gatherings', location: 'Campus Center', category: 'Catering', payRate: '$18/hour', description: 'Assist with food prep, setup, and service for a large on-campus event. Must be able to lift 25 lbs. Great for someone with a positive attitude!', postedAt: new Date(2025, 9, 28) },
                { id: 'job2', title: 'Evening Delivery Driver', employerName: 'Pizza Palace', location: 'Downtown', category: 'Delivery', payRate: '$15/hour + tips', description: 'Deliver pizzas and other food items in the downtown area. Must have a valid driver\'s license and a reliable vehicle. Shifts are from 5 PM to 11 PM.', postedAt: new Date(2025, 9, 27) },
                { id: 'job3', title: 'Math & Physics Tutor', employerName: 'Academic Success Center', location: 'Library, 2nd Floor', category: 'Tutoring', payRate: '$20/hour', description: 'Tutor undergraduate students in introductory calculus and physics courses. Must have completed these courses with an A grade. Flexible hours.', postedAt: new Date(2025, 9, 26) },
                { id: 'job4', title: 'Retail Associate', employerName: 'College Bookstore', location: 'Student Union', category: 'Retail', payRate: '$16.50/hour', description: 'Assist customers, manage inventory, and operate the cash register. Friendly and helpful personality required.', postedAt: new Date(2025, 9, 25) },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        const categories = {
            1: 'Catering',
            2: 'Delivery', 
            3: 'Tutoring',
            4: 'Retail'
        };
        return categories[categoryId] || 'Other';
    };

    const MainContent = () => {
        if (loading) {
            return <div className="text-center p-10">Loading jobs...</div>;
        }

        if (view === 'jobs') {
            const normalizedQuery = searchQuery.trim().toLowerCase();
            const filteredJobs = jobs.filter(job => {
                const matchesCategory = selectedCategory === 'All Categories' || job.category === selectedCategory;
                if (!normalizedQuery) return matchesCategory;
                const haystack = `${job.title} ${job.employerName} ${job.location} ${job.category}`.toLowerCase();
                return matchesCategory && haystack.includes(normalizedQuery);
            });
            return (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => <JobCard key={job.id} job={job} onSelect={() => setSelectedJob(job)} />)}
                </div>
            );
        }

        if (view === 'applications') {
            return <MyApplications />;
        }
    };

    return (
        <div>
            {/* Welcome Section with User Name */}
            <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Welcome, {user?.name || 'Student'}!
                        </h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            {view === 'jobs' ? 'Browse available job opportunities' : 'Track your job applications'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    {view === 'jobs' ? 'Available Jobs' : 'My Applications'}
                </h2>
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    {view === 'jobs' ? (
                        <button onClick={() => setView('applications')} className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors">
                            <FileText className="w-5 h-5"/>
                            <span>My Applications</span>
                        </button>
                    ) : (
                         <button onClick={() => setView('jobs')} className="w-full md:w-auto flex items-center justify-center space-x-2 bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors">
                            <ArrowLeft className="w-5 h-5"/>
                            <span>Back to Jobs</span>
                        </button>
                    )}
                </div>
            </div>

            {view === 'jobs' && (
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search for jobs (e.g., 'Catering')"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                     <div className="relative">
                        <select
                            className="w-full md:w-48 appearance-none bg-white pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option>All Categories</option>
                            <option>Catering</option>
                            <option>Delivery</option>
                            <option>Tutoring</option>
                            <option>Retail</option>
                        </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}
            
            <MainContent />

            {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
        </div>
    );
};

export default StudentDashboard;
