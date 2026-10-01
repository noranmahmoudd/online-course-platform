import api from "./api";

export const getCourses = async (params) => (await api.get("/courses", { params })).data.data;
export const getCourse = async (id) => (await api.get(`/courses/${id}`)).data.data.course;
export const createCourse = async (payload) => (await api.post("/courses", payload)).data.data.course;
export const updateCourse = async (id, payload) => (await api.put(`/courses/${id}`, payload)).data.data.course;
export const deleteCourse = async (id) => (await api.delete(`/courses/${id}`)).data;
export const getInstructorCourses = async () => (await api.get("/courses/instructor/mine")).data.data.courses;
export const getCourseStats = async (id) => (await api.get(`/courses/${id}/stats`)).data.data.stats;
