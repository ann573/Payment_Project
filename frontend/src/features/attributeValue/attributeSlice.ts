import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { fetchSingleAttributeValue } from "./attributeAction";

interface IAttributeValue {
  name: string;
  _id: string;
}

interface AttributeState {
  attributesValue: IAttributeValue[];
  loading: boolean;
  error: string | null;
}

const initialState: AttributeState = {
  attributesValue: [],
  loading: false,
  error: null,
};

const setLoading = (state: AttributeState): void => {
  state.loading = true;
  state.error = null;
};

const setError = (
  state: AttributeState,
  action: PayloadAction<unknown> & { error: SerializedError }
): void => {
  state.loading = false;
  state.error = action.error.message || "Đã có lỗi xảy ra!";
};

const attributeSlice = createSlice({
  name: "attributesValue",
  initialState,
  reducers: {
    removeAttributeValue: (state, action: PayloadAction<string>) => {
      state.attributesValue = state.attributesValue.filter(
        (item) => item._id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleAttributeValue.pending, setLoading)
      .addCase(
        fetchSingleAttributeValue.fulfilled,
        (state: AttributeState, action: PayloadAction<IAttributeValue[]>) => {
          state.loading = false;
          state.attributesValue = action.payload;
        }
      )
      .addCase(fetchSingleAttributeValue.rejected, setError);

    //   .addCase(
    //     searchProducts.fulfilled,
    //     (state: ProductState, action: PayloadAction<IProduct[]>) => {
    //       state.loading = false;
    //       state.productSearch = action.payload;
    //     }
    //   )
    //   .addCase(searchProducts.rejected, setError)

    //   .addCase(
    //     removeOneProduct.fulfilled,
    //     (state: ProductState, action: PayloadAction<string | number>) => {
    //       state.loading = false;
    //       state.products = state.products.filter(
    //         (item: IProduct) => item._id !== action.payload
    //       );
    //     }
    //   )
    //   .addCase(removeOneProduct.rejected, setError)

    //   .addCase(
    //     updateNewProduct.fulfilled,
    //     (state: ProductState, action: PayloadAction<IProduct>) => {
    //       state.loading = false;
    //       const index: number = state.products.findIndex(
    //         (item: IProduct) => item._id === action.payload._id
    //       );
    //       state.products[index] = action.payload;
    //     }
    //   )
    //   .addCase(updateNewProduct.rejected, setError)

    //   .addCase(
    //     createProduct.fulfilled,
    //     (state: ProductState, action: PayloadAction<IProduct>) => {
    //       state.loading = false;
    //       state.products = [action.payload, ...state.products];
    //     }
    //   )
    //   .addCase(createProduct.rejected, setError)

    //   .addCase(
    //     fetchProductById.fulfilled,
    //     (state: ProductState, action: PayloadAction<IProduct>) => {
    //       state.loading = false;
    //       state.product = action.payload;
    //     }
    //   )
    //   .addCase(fetchProductById.rejected, setError);
  },
});

export const { removeAttributeValue } = attributeSlice.actions;

export default attributeSlice.reducer;
