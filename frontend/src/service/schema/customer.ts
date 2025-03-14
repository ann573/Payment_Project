import * as z from "zod";

export const customerSchema = z.object({
  name: z.string().min(3, "Nhập tối thiểu 3 ký tự"),
  telephone: z
    .string()
    .nonempty("Vui lòng nhập số")
    .refine((value) => /^\d+$/.test(value), {
      message: "Vui lòng chỉ nhập số",
    })
    .refine((value) => /^0\d{9}$/.test(value), { 
      message: "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số",
    }),
});
