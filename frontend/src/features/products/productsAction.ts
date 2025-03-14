import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProductBefore } from "../../interface/IProduct";
import { instance } from "../../service";
import {
  createProducts,
  getProductById,
  removeProduct,
  updateProducts,
} from "../../service/product";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, searchQuery }: { page: number; limit: number; searchQuery: string }) => {
    const query = searchQuery ? `&sort_title=${searchQuery}` : ""; 
    const response = await instance.get(
      `products?skip=${(page-1)*limit}&limit=${limit}${query}`
    );
    return response.data.data; 
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({searchQuery }: {searchQuery: string }) => {
    const response = await instance.get(
      `products/products/search?sort_title=${searchQuery}`
    );
    return response.data.data;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: IProductBefore) => {
    return await createProducts(product);
  }
);

export const updateNewProduct = createAsyncThunk(
  "products/updateNewProduct",
  async ({ data, id }: { data: IProductBefore; id: string }) => {
    return await updateProducts(data, id);
  }
);

export const removeOneProduct = createAsyncThunk(
  "products/removeOneProduct",
  async (id: string) => {
    await removeProduct(id);
    return id;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string) => {
    return await getProductById(id);
  }
);


