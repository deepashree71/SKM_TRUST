import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ngo_access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ngo_access_token')
      window.location.href = '/dashboard'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  logout:         () => api.post('/auth/logout'),
  me:             () => api.get('/auth/me'),
  updateProfile:  (data) => api.put('/auth/me', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (token, data) => api.post(`/auth/reset-password/${token}`, data),
}

export const donationApi = {
  createOrder:        (data) => api.post('/donations/create', data),
  verifyPayment:      (data) => api.post('/donations/verify-payment', data),
  subscribe:          (data) => api.post('/donations/subscribe', data),
  cancelSubscription: (id) => api.put(`/donations/subscription/${id}/cancel`),
  getSubscriptions:   () => api.get('/donations/subscriptions'),
  getHistory:         () => api.get('/donations/my-history'),
  downloadReceipt:    (id) => api.get(`/donations/${id}/receipt`, { responseType: 'blob' }),
}

export const donationPosterApi = {
  generate:      (data) => api.post('/donation-posters/generate', data),
  getMyPosters:  () => api.get('/donation-posters/my'),
  getOne:        (id) => api.get(`/donation-posters/${id}`),
  updatePrivacy: (id, privacy) => api.put(`/donation-posters/${id}/privacy`, { privacy }),
  deleteOne:     (id) => api.delete(`/donation-posters/${id}`),
  getPublic:     (token) => api.get(`/donation-posters/public/${token}`),
}

export const programApi = {
  getAll: (params) => api.get('/programs', { params }),
  getOne: (slug) => api.get(`/programs/${slug}`),
}

export const volunteerApi = {
  apply:          (data) => api.post('/volunteers/apply', data),
  getProfile:     () => api.get('/volunteers/profile'),
  generateIdCard: () => api.post('/volunteers/generate-id-card', {}, { responseType: 'blob' }),
}

export const eventApi = {
  getAll:             (params) => api.get('/events', { params }),
  getOne:             (slug) => api.get(`/events/${slug}`),
  register:           (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.put(`/events/${id}/cancel-registration`),
}

export const certificateApi = {
  getMyCertificates: () => api.get('/certificates/my'),
  download:          (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  verify:            (token) => api.get(`/certificates/verify/${token}`),
}

export const galleryApi = {
  getAll: (params) => api.get('/gallery', { params }),
}

export const storyApi = {
  getAll: (params) => api.get('/stories', { params }),
  getOne: (slug) => api.get(`/stories/${slug}`),
}

export const transparencyApi = {
  getDocuments: (params) => api.get('/transparency', { params }),
  download:     (id) => api.get(`/transparency/${id}/download`, { responseType: 'blob' }),
}

export const contactApi = {
  submit: (data) => api.post('/contact', data),
}

export const notificationApi = {
  getAll:            () => api.get('/notifications'),
  markRead:          (id) => api.put(`/notifications/${id}/read`),
  markAllRead:       () => api.put('/notifications/read-all'),
  getPreferences:    () => api.get('/notifications/preferences'),
  updatePreferences: (data) => api.put('/notifications/preferences', data),
}

export const cmsApi = {
  getPage:     (key) => api.get(`/cms/${key}`),
  getSettings: () => api.get('/cms/site/settings'),
}

export const impactMapApi = {
  getLocations: (params) => api.get('/impact-map/locations', { params }),
  getMetrics:   () => api.get('/impact-map/metrics'),
}

export const adminApi = {
  getStats:           () => api.get('/admin/stats'),
  getUsers:           (params) => api.get('/admin/users', { params }),
  blockUser:          (id) => api.put(`/admin/users/${id}/block`),
  unblockUser:        (id) => api.put(`/admin/users/${id}/unblock`),
  getVolunteers:      (params) => api.get('/admin/volunteers', { params }),
  getVolunteer:       (id) => api.get(`/admin/volunteers/${id}`),
  approveVolunteer:   (id) => api.put(`/admin/volunteers/${id}/approve`),
  rejectVolunteer:    (id, data) => api.put(`/admin/volunteers/${id}/reject`, data),
  getPrograms:        () => api.get('/admin/programs'),
  createProgram:      (data) => api.post('/admin/programs', data),
  updateProgram:      (id, data) => api.put(`/admin/programs/${id}`, data),
  deleteProgram:      (id) => api.delete(`/admin/programs/${id}`),
  toggleFeatured:     (id) => api.put(`/admin/programs/${id}/toggle-featured`),
  addGalleryImage:    (id, imageUrl) => api.post(`/admin/programs/${id}/gallery`, { imageUrl }),
  removeGalleryImage: (id, imgId) => api.delete(`/admin/programs/${id}/gallery/${imgId}`),
  getEvents:          () => api.get('/admin/events'),
  createEvent:        (data) => api.post('/admin/events', data),
  updateEvent:        (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent:        (id) => api.delete(`/admin/events/${id}`),
  cancelEvent:        (id) => api.put(`/admin/events/${id}/cancel`),
  getRegistrations:   (id) => api.get(`/admin/events/${id}/registrations`),
  markAttendance:     (id, data) => api.put(`/admin/events/${id}/mark-attendance`, data),
  getCertificates:    (params) => api.get('/admin/certificates', { params }),
  bulkIssueCerts:     (data) => api.post('/admin/certificates/bulk-issue', data),
  reissueCert:        (id, data) => api.post(`/admin/certificates/${id}/reissue`, data),
  revokeCert:         (id, data) => api.put(`/admin/certificates/${id}/revoke`, data),
  correctCert:        (id, data) => api.put(`/admin/certificates/${id}/correct`, data),
  getGallery:         () => api.get('/admin/gallery'),
  uploadGallery:      (data) => api.post('/admin/gallery', data),
  updateGallery:      (id, data) => api.put(`/admin/gallery/${id}`, data),
  deleteGallery:      (id) => api.delete(`/admin/gallery/${id}`),
  getStories:         () => api.get('/admin/stories'),
  createStory:        (data) => api.post('/admin/stories', data),
  updateStory:        (id, data) => api.put(`/admin/stories/${id}`, data),
  deleteStory:        (id) => api.delete(`/admin/stories/${id}`),
  toggleStory:        (id) => api.put(`/admin/stories/${id}/toggle-active`),
  getDonations:       (params) => api.get('/admin/donations', { params }),
  getDonationPosters: () => api.get('/admin/donation-posters'),
  removePoster:       (id) => api.delete(`/admin/donation-posters/${id}`),
  getTransparency:    () => api.get('/admin/transparency'),
  createDoc:          (data) => api.post('/admin/transparency', data),
  updateDoc:          (id, data) => api.put(`/admin/transparency/${id}`, data),
  deleteDoc:          (id) => api.delete(`/admin/transparency/${id}`),
  getMessages:        (params) => api.get('/admin/contact', { params }),
  markMessageRead:    (id) => api.put(`/admin/contact/${id}/read`),
  getCmsPages:        () => api.get('/admin/cms'),
  updateCmsPage:      (key, data) => api.put(`/admin/cms/${key}`, data),
  updateCmsSettings:  (data) => api.put('/admin/cms-settings', data),
  createImpactLoc:    (data) => api.post('/admin/impact-locations', data),
  updateImpactLoc:    (id, data) => api.put(`/admin/impact-locations/${id}`, data),
  deleteImpactLoc:    (id) => api.delete(`/admin/impact-locations/${id}`),
  upsertMetric:       (data) => api.post('/admin/impact-metrics', data),
  broadcast:          (data) => api.post('/admin/broadcast', data),
  getAuditLog:        (params) => api.get('/admin/audit-log', { params }),
}

export default api
