import api from "./api";

export const getCourseLessons = async (courseId) =>
  (await api.get(`/courses/${courseId}/lessons`)).data.data.lessons;
export const getLesson = async (id) => (await api.get(`/lessons/${id}`)).data.data.lesson;
export const createLesson = async (courseId, payload) =>
  (await api.post(`/courses/${courseId}/lessons`, payload)).data.data.lesson;
export const updateLesson = async (id, payload) => (await api.put(`/lessons/${id}`, payload)).data.data.lesson;
export const deleteLesson = async (id) => (await api.delete(`/lessons/${id}`)).data;
