import { authApi } from './axiosInstance';

const getBoardTypes  = async () => {
  const response = await authApi.get("/boards/types");
  return response.data;
};

const searchBoard = async (filter) => {
  try{
    const response = await authApi.get("/boards", { params: filter }); 
    return response.data;
  } catch (error) {
    throw error;
  }
}

const createBoard = async (formData) => {
  try{
    const response = await authApi.post("/boards", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    return response.data;
  } catch (error) {
    throw error;
  }
}

const getBoardDetail = async (boardId) => {
  try{
    const response = await authApi.get(`/boards/${boardId}`, {
        withCredentials: true,
      });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { getBoardTypes, searchBoard, createBoard, getBoardDetail };