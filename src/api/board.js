import { authApi } from './axiosInstance';

const getBoardTypes  = async () => {
  const response = await authApi.get("/boards/types");
  console.log(response);
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

export { getBoardTypes, searchBoard };