import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginSchema } from "../service/schema/user";
import { loginAccount } from "./../service/user";
// import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import IErrorResponse from "../interface/IErrorResponse";
import { IResponse } from "../interface/IResponse";
import ModelForgotPass from "@/components/ModelForgotPass";
import { useAuthStore } from "./../../store/useAuthStore";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const { login } = useAuthStore();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const submitForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const response: AxiosResponse<IResponse> = await loginAccount(data);
      if (response.status === 200) {
        const res = response.data;
        if (res.success) {
          login(res.data.user);
          nav("/");

          Cookies.set("user", res.data?.user.name);
          Cookies.set("role", res.data?.user.role);
          Cookies.set("accessToken", res.data.accessToken);
        }
      }
    } catch (error) {
      const { response } = error as AxiosError<IErrorResponse>;
      toast.error(response?.data.error);
    }
  };

  return (
    <>
      <section className="bg-theme-login bg-no-repeat w-[100vw] h-[100vh] bg-cover overflow-x-hidden">
        <form onSubmit={handleSubmit(submitForm)} className="w-[600px] mx-auto">
          <div className="mt-20 flex flex-col items-center mb-5">
            <img
              src="https://sapo.dktcdn.net/sso-service/images/Sapo-logo.svg"
              alt="logo"
              className="w-1/3"
            />
            <h1 className="text-[26px] font-semibold mt-3">
              Đăng nhập vào cửa hàng của bạn
            </h1>
          </div>

          <div className="mb-5">
            <input
              type="email"
              id="email"
              placeholder="Email của bạn"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 italic ml-5">
                {errors?.email.message}
              </p>
            )}
          </div>

          <div className="mb-10 relative">
            <input
              type={show ? "text" : "password"}
              id="password"
              placeholder="Mật khẩu cửa hàng"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("password")}
            />
            <div
              className="cursor-pointer absolute left-[94%] top-[16px] text-textColor"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 italic ml-5">
                {errors?.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-5 mb-3">
            <button className="bg-custom-gradient py-4 px-20 rounded-full text-white text-2xl font-semibold">
              Đăng nhập
            </button>
          </div>
        </form>

        <ModelForgotPass />
      </section>

      <ToastContainer />
    </>
  );
};

export default LoginPage;
