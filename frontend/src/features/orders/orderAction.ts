import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrder, getOrderById } from "../../service/order";

export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async ({ page, limit }: { page: number ; limit: number }) => {
        const data = await fetchOrder(`orders?skip=${(page-1)*limit}&limit=${limit}`)
        return data
    } 
  );

  export const fetchOrderById = createAsyncThunk(
    "order/fetchOrderById",
    async (id: string) => {
        const data = await getOrderById(id)
        return data.data
    }
  )