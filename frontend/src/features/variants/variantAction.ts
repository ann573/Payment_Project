import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service";

interface IAttribute {
  name: string;
}
export const fetchAttribute = createAsyncThunk(
  "attributes/fetchVariant",
  async () => {
    const response = await instance.get(`/attributes`);
    return response.data.data;
  }
);

export const createAttribute = createAsyncThunk(
  "attributes/createAttribute",
  async (attribute: IAttribute) => {
    return await instance.post("/attributes", attribute);
  }
);

// export const updateNewProduct = createAsyncThunk(
//   "attributes/updateNewProduct",
//   async ({ data, id }: { data: IProductBefore; id: string }) => {
//     return await updateProducts(data, id);
//   }
// );

export const removeOneAttribute = createAsyncThunk(
  "attributes/removeOneAttribute",
  async (id: string) => {
    await instance.delete(`/attributes/${id}`);
    return id;
  }
);

export const fetchAttributeById = createAsyncThunk(
  "attributes/fetchAttributeById",
  async (id: string) => {
    const response = await instance.get(`/attributes/${id}`);
    return response.data.data;
  }
);
