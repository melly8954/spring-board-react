import { authApi } from './axiosInstance';

const getBoardTypes  = async () => {
  const response = await authApi.get("/boards/types");
  console.log(response);
  return response.data;
};

export { getBoardTypes  };