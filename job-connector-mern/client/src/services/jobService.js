import api from './authService';

export const jobService = {
  // Get all job postings
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  // Get a specific job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create a new job posting (Employer only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Get jobs owned by the logged-in employer
  getEmployerJobs: async () => {
    const response = await api.get('/profiles/employer');
    return response.data;
  },

  // Update a job posting (Employer only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete a job posting (Employer only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  }
};

export default jobService;
