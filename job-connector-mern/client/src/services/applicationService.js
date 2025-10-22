import api from './authService';

export const applicationService = {
  // Submit a job application
  submitApplication: async (jobId, coverLetter) => {
    const response = await api.post('/profiles/apply', {
      job_id: jobId,
      cover_letter: coverLetter,
    });
    return response.data;
  },

  // Get applications submitted by the current user
  getMyApplications: async () => {
    const response = await api.get('/profiles/applications/me');
    return response.data;
  },

  // Get applications for a specific job (Employer view)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/profiles/applications/${jobId}`);
    return response.data;
  },

  // Update application status (Employer only)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put(`/profiles/applications/${applicationId}/status`, {
      status,
    });
    return response.data;
  },
};

export default applicationService;
