import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../service";
import { ICustomer } from "./../../interface/ICustom";
import {
  createCustomer,
  getCustomerById,
  removeCustomer,
  updateCustomer,
} from "./../../service/customer";

type Customer = {
  name: string;
  telephone: string;
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({
    page,
    limit,
    searchQuery,
    sort,
  }: {
    page: number;
    limit: number;
    searchQuery: string;
    sort: number;
  }) => {
    const query = searchQuery ? `&telephone=${searchQuery}` : "";
    let isDesc;
    switch (sort % 3) {
      case 0:
        isDesc = `&sort=0`;
        break;
      case 1:
        isDesc = `&sort=1`;
        break;
      case 2:
        isDesc = `&sort=-1`;
        break;
      default:
        break;
    }
    const response = await instance.get(
      `customers?skip=${(page - 1) * limit}&limit=${limit}${query}${isDesc}`
    );
    return response.data.data;
  }
);

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (data: Customer) => {
    return await createCustomer(data);
  }
);

export const updateNewCustomer = createAsyncThunk(
  "customers/updateNewCustomer",
  async ({ data, id }: { data: ICustomer; id: string }) => {
    return await updateCustomer(data, id);
  }
);

export const removeOneCustomer = createAsyncThunk(
  "customers/removeOneCustomer",
  async (id: string) => {
    await removeCustomer(id);
    return id;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "customers/fetchCustomerById",
  async (id: string) => {
    return await getCustomerById(id);
  }
);
