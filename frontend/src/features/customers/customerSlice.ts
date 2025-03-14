import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";

import { ICustomer } from "../../interface/ICustom";
import {
  addCustomer,
  fetchCustomerById,
  fetchCustomers,
  removeOneCustomer,
  updateNewCustomer
} from "./customerAction";

interface CustomerState {
  customers: ICustomer[];
  customer: ICustomer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  customer: null,
  loading: false,
  error: null,
};

const setLoading = (state: CustomerState): void => {
  state.loading = true;
  state.error = null;
};

const setError = (
  state: CustomerState,
  action: PayloadAction<unknown> & { error: SerializedError }
): void => {
  state.loading = false;
  state.error = action.error.message || "Đã có lỗi xảy ra!";
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, setLoading)
      .addCase(
        fetchCustomers.fulfilled,
        (state: CustomerState, action: PayloadAction<ICustomer[]>) => {
          state.loading = false;
          state.customers = action.payload;
        }
      )
      .addCase(fetchCustomers.rejected, setError)

      .addCase(
        removeOneCustomer.fulfilled,
        (state: CustomerState, action: PayloadAction<string | number>) => {
          state.loading = false;
          state.customers = state.customers.filter(
            (item: ICustomer) => item._id !== action.payload
          );
        }
      )
      .addCase(removeOneCustomer.rejected, setError)

      .addCase(
        updateNewCustomer.fulfilled,
        (state: CustomerState, action: PayloadAction<ICustomer>) => {
          state.loading = false;
          const index: number = state.customers.findIndex(
            (item: ICustomer) => item._id === action.payload._id
          );
          state.customers[index] = action.payload;
        }
      )
      .addCase(updateNewCustomer.rejected, setError)

      .addCase(
        addCustomer.fulfilled,
        (state: CustomerState, action: PayloadAction<ICustomer>) => {
          state.loading = false;
          state.customers = [action.payload, ...state.customers];
        }
      )
      .addCase(addCustomer.rejected, setError)

      .addCase(
        fetchCustomerById.fulfilled,
        (state: CustomerState, action: PayloadAction<ICustomer>) => {
          state.loading = false;
          state.customer = action.payload;
        }
      )
      .addCase(fetchCustomerById.rejected, setError);
  },
});

export default customerSlice.reducer;
