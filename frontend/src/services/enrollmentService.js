import api from "./api";

export const enroll = async (courseId) => (await api.post(`/courses/${courseId}/enroll`)).data.data.enrollment;
export const getMyCourses = async () => (await api.get("/enrollments/my-courses")).data.data.enrollments;
export const getEnrollment = async (courseId) => (await api.get(`/courses/${courseId}/enrollment`)).data.data;
export const updateProgress = async (courseId, progress) =>
  (await api.put(`/courses/${courseId}/progress`, { progress })).data.data.enrollment;
