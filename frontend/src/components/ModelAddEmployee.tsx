"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employeeSchema } from "@/service/schema/employee";
import { instance } from "@/service"; // Gọi API
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"; // Hiển thị thông báo

import { ClipLoader } from "react-spinners";

// interface ModelAddEmployeeProps {
//   setEmployee: React.Dispatch<React.SetStateAction<TEmployee[]>>;
// }
const ModelAddEmployee = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: zodResolver(employeeSchema),
  });

  // State điều khiển Dialog
  const [isOpen, setIsOpen] = useState(false);
  // const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // const [otpValue, setOtpValue] = useState<string>("");

  type TFormData = {
    name: string;
    email: string;
    password: string;
    otp: string;
  };

  const handleRegister = async (data: TFormData) => {
    try {
      setLoading(true);
      const res: AxiosResponse = await instance.post("/users/register", data);
      if (res.status === 200) {
        toast.success("Vui lòng kiểm tra email để xác thực tài khoản.");
        reset();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-500 text-white sm:text-base text-sm py-2">
            Thêm nhân viên
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên nhân viên</Label>
              <Input
                id="name"
                placeholder="Nhập tên nhân viên"
                {...register("name")}
              />
              {errors?.name && (
                <p className="text-red-500">{errors?.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email nhân viên"
                {...register("email")}
              />
              {errors?.email && (
                <p className="text-red-500">{errors?.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
              />
              {errors?.password && (
                <p className="text-red-500">{errors?.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-orange-500 text-white">
              Đăng ký
            </Button>
          </form>

          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <ClipLoader color="#0089ff" size={50} />
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/*  */}
    </>
  );
};

export default ModelAddEmployee;
