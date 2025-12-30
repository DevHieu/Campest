import axiosClient from "../libs/axiosClient";

export const getUser = async () => {
  const res = await axiosClient.get("/auth/get-user");
  return res.data;
};

export const login = async (data) => {
  console.log(data);
  const res = await axiosClient.post("/auth/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await axiosClient.post("/auth/signup", data);
  return res.data;
};
