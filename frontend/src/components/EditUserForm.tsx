import axios, { AxiosResponse } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface EditUserFormProps {
  email: string;
  setIsOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenForm: boolean;
}

type TForm = {
  password: string;
  rePassword: string;
};
const EditUserForm: React.FC<EditUserFormProps> = ({
  setIsOpenForm,
  email,
  isOpenForm,
}) => {
  const {
    handleSubmit,
    // reset,
    register,
    watch,
    formState: { errors },
  } = useForm<TForm>();

  const onSubmitForm = async (data: TForm) => {
    try {
        const dataBody = {email, password: data.password}
        const res : AxiosResponse = await axios.patch("/users/change_password", dataBody, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        if (res.status === 200) {
            toast.success("Thay đổi mật khẩu thành công")
            setIsOpenForm(false)
        }
    } catch (error) {
        console.log(error);
    }
  };
  return (
    <>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <Label htmlFor="password">Nhập mật khẩu</Label>
              <Input
                id="password"
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                {...register("password", {
                  required: "Password không được để trống",
                  minLength: {
                    value: 6,
                    message: "Password phải có ít nhất 6 ký tự",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rePassword">Nhập lại mật khẩu</Label>
              <Input
                id="rePassword"
                placeholder="Nhập lại mật khẩu"
                type="password"
                {...register("rePassword", {
                  required: "Vui lòng nhập lại mật khẩu",
                  validate: (value) =>
                    value === watch("password") ||
                    "Mật khẩu nhập lại không khớp",
                })}
              />
              {errors.rePassword && (
                <p className="text-red-500">{errors.rePassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-500 text-white">
              Sửa mật khẩu
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditUserForm;
