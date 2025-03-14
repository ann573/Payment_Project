import { instance } from "@/service"; // Gọi API
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const VerifyPage = () => {
  const { token } = useParams<{ token: string }>(); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await instance.get(`/users/verify-email?token=${token}`);
        console.log(res);
        if (res.status === 200) {
          toast.success("Xác thực email thành công!");
          navigate("/login"); 
        }
      } catch (error) {
        console.log(error);
        toast.error("Link xác thực không hợp lệ hoặc đã hết hạn.");
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <>
    <ToastContainer/>
    <div className="text-center text-xl font-bold pt-20 h-svh">Đang xác thực email, vui lòng đợi...</div>
    </>
  );
};

export default VerifyPage;