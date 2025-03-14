import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { IOrder } from "../../interface/IOrder";
import { fetchOrders, fetchOrderById } from "./orderAction";

interface OrderState {
  orders: IOrder[];
  order: IOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

const setLoading = (state: OrderState): void => {
  state.loading = true;
  state.error = null;
};

const setError = (
    state: OrderState,
    action: PayloadAction<unknown> & { error: SerializedError }
  ): void => {
    state.loading = false;
    state.error = action.error.message || "Đã có lỗi xảy ra!";
  };

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, setLoading)
      .addCase(
        fetchOrders.fulfilled,
        (state: OrderState, action: PayloadAction<IOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, setError)

      .addCase(fetchOrderById.pending, setLoading)
      .addCase(
        fetchOrderById.fulfilled,
        (state: OrderState, action: PayloadAction<IOrder>) => {
          state.loading = false;
          state.order = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, setError);
  },
});

export default orderSlice.reducer;
