import { instance } from "./index";
type userLogin = {
  email: string;
  password: string;
};

type userRegister = {
  email: string;
  password: string;
  confirmPassword: string
};

export const loginAccount = async (data: userLogin) => {
  const res = await instance.post("/users/login", data,  {
    withCredentials: true, 
  });
  return res;
};

export const registerAccount = async (data: userRegister) => {
  const res = await instance.post("/register", data);
  return res;
};
