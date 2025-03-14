import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service";

interface IAttributeValue {
    name: string
}
export const fetchSingleAttributeValue= createAsyncThunk(
  "attributes/fetchSingleAttributeValue",
  async (id:string) => {
    const response = await instance.get(
      `/attribute_value/${id}`
    );
    return response.data.data; 
  }
);

export const createAttribute = createAsyncThunk(
  "attributes/createAttribute",
  async (attribute: IAttributeValue) => {
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

// export const fetchAttributeById = createAsyncThunk(
//   "attributes/fetchAttributeById",
//   async (id: string) => {
//     return await getProductById(id);
//   }
// );


