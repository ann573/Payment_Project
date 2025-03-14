import * as z from "zod";

export const employeeSchema = z.object({
  name: z.string().min(3, "Nhập tối thiểu 3 ký tự"),
  email: z.string().email("Hãy nhập email hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 kí tự")
});
