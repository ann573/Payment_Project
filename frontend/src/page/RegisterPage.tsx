import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { registerChema } from "../service/schema/user";
import { Link } from "react-router-dom";
import { useState } from "react";
import { registerAccount } from "../service/user";
import { AxiosError } from "axios";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const [showP, setShowP] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(registerChema),
  });

  const submitForm: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await registerAccount(data);
      if (res.status === 201) {
        toast.success("Đăng ký thành công");
      }
      reset();
    } catch (error) {
      const err = error as AxiosError;

      if (err.status === 400) {
        toast.error("Email đã tồn tại");
      }
    }
  };
  return (
    <>
      <section className="bg-theme-login bg-no-repeat	w-[100vw] h-[100vh] bg-cover overflow-x-hidden">
        <form onSubmit={handleSubmit(submitForm)} className="w-[600px] mx-auto">
          <div className="mt-12 flex flex-col items-center mb-5">
            <img
              src="https://sapo.dktcdn.net/sso-service/images/Sapo-logo.svg"
              alt="logo"
              className="w-1/3"
            />
            <h1 className="text-[26px] font-semibold mt-3">
              Gia nhập với chúng tôi
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

          <div className="mb-5 relative">
            <input
              type={showP ? "text" : "password"}
              id="password"
              placeholder="Mật khẩu cửa hàng"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 italic ml-5">
                {errors?.password.message}
              </p>
            )}
            <div
              className="cursor-pointer absolute left-[94%] top-[16px] text-textColor"
              onClick={() => setShowP((prev) => !prev)}
            >
              {showP ? (
                <i className="ri-eye-line"></i>
              ) : (
                <i className="ri-eye-off-line"></i>
              )}
            </div>
          </div>

          <div className="mb-5 relative">
            <input
              type={show ? "text" : "password"}
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              className="w-full py-4 px-5 rounded-full focus:outline-[#08f] border border-[#bcbec0]"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 italic ml-5">
                {errors?.confirmPassword.message}
              </p>
            )}
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
          </div>

          <p className="mb-5 ml-4">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="italic hover:underline">
              Đăng nhập ngay
            </Link>
          </p>

          <div className="flex flex-col items-center justify-center gap-5 mb-3">
            <button className="bg-custom-gradient py-4 px-20 rounded-full text-white text-2xl font-semibold">
              Đăng ký
            </button>
            <p className="text-textColor">Hoặc đăng ký với</p>
          </div>

          <div className="flex justify-center gap-5">
            <div className="w-2/6 cursor-pointer">
              <img
                src="https://sapo.dktcdn.net/sso-service/images/svg_sociallogin_fb_new.svg"
                alt="facebook"
                className="w-full"
              />
            </div>
            <div className="w-2/6 cursor-pointer">
              <img
                src="https://sapo.dktcdn.net/sso-service/images/svg_sociallogin_gg_new.svg"
                alt="mail"
                className="w-full"
              />
            </div>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>
  );
};

export default RegisterPage;
