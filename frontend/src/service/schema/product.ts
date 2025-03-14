import { z } from "zod";

export const productSchema = z.object({
  name: z.string().nonempty("Vui lòng nhập tên sản phẩm"), 
  sort_title: z.string().nonempty("Vui lòng nhập mã sản phẩm"), 
  attributes: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), 
  attributeValues: z
    .array(
      z.object({
        attribute: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), 
        price: z
          .string()
          .nonempty("Vui lòng nhập giá")
          .regex(/^\d+$/, "Giá phải là số dương"), 
        stock: z
          .string()
          .nonempty("Vui lòng nhập tồn kho")
          .regex(/^\d+$/, "Tồn kho phải là số dương"), 
      })
    )
    .min(1, "Cần ít nhất một giá trị thuộc tính"), 
});

export const productSchemaUpdate = z.object({
  name: z.string().nonempty("Vui lòng nhập tên sản phẩm"), 
  sort_title: z.string().nonempty("Vui lòng nhập mã sản phẩm"), 
  attributes: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), 
  attributeValues: z
    .array(
      z.object({
        attribute: z.string().nonempty("Vui lòng chọn giá trị thuộc tính"), 
        price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
        stock: z.coerce.number().min(0, "Tồn kho phải lớn hơn hoặc bằng 0"),
      })
    )
    .min(1, "Cần ít nhất một giá trị thuộc tính"), 
});
