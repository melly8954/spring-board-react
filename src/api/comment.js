import { authApi } from './axiosInstance';

// 댓글 목록 조회
const getComments = async (filter) => {
  try {
    const response = await authApi.get(`/comments`, { params: filter });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 일반 댓글/대댓글 모두 지원
const addComment = async (dto) => {
  try {
    const response = await authApi.post(`/comments`, dto);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 ID로 댓글 삭제
const deleteComment = async (commentId) => {
  try {
    const response = await authApi.delete(`/comments/${commentId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 좋아요 토글
const toggleCommentLike = async (commentId) => {
  try {
    const response = await authApi.post(`/comments/${commentId}/likes`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { getComments, addComment, deleteComment, toggleCommentLike };

