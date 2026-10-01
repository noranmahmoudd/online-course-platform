import api from "./api";

export const getComments = async (lessonId) => (await api.get(`/lessons/${lessonId}/comments`)).data.data.comments;
export const addComment = async (lessonId, content) =>
  (await api.post(`/lessons/${lessonId}/comments`, { content })).data.data.comment;
export const updateComment = async (id, content) =>
  (await api.put(`/comments/${id}`, { content })).data.data.comment;
export const deleteComment = async (id) => (await api.delete(`/comments/${id}`)).data;
