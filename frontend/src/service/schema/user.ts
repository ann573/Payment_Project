import * as z from "zod";

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

export const loginSchema = z.object({
  email: z.string().email("Hãy nhập đúng định dạng email"),
  password: z.string().min(6, "Password cần tối thiểu 6 ký tự"),
});

export const registerChema = z
  .object({
    email: z.string().email("Hãy nhập đúng định dạng email"),
    password: z
      .string()
      .min(6, "Password cần tối thiểu 6 ký tự")
      .regex(specialCharRegex, {
        message: "Chuỗi phải chứa ít nhất một ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng nhau",
    path: ["confirmPassword"], 
  });
