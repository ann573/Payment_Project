import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { IProduct } from "./../../interface/IProduct";
import {
  createProduct,
  fetchProductById,
  fetchProducts,
  removeOneProduct,
  searchProducts,
  updateNewProduct
} from "./productsAction";

interface ProductState {
  products: IProduct[];
  product: IProduct | null;
  productSearch: IProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  productSearch:[],
  loading: false,
  error: null,
};

const setLoading = (state: ProductState): void => {
  state.loading = true;
  state.error = null;
};

const setError = (
  state: ProductState,
  action: PayloadAction<unknown> & { error: SerializedError }
): void => {
  state.loading = false;
  state.error = action.error.message || "Đã có lỗi xảy ra!";
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, setLoading)
      .addCase(
        fetchProducts.fulfilled,
        (state: ProductState, action: PayloadAction<IProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
          state.product = action.payload[0] || null;
        }
      )
      .addCase(fetchProducts.rejected, setError)

      .addCase(searchProducts.fulfilled,(state: ProductState, action: PayloadAction<IProduct[]>) => {
        state.loading = false;
        state.productSearch = action.payload;
      })
      .addCase(searchProducts.rejected, setError)

      .addCase(
        removeOneProduct.fulfilled,
        (state: ProductState, action: PayloadAction<string | number>) => {
          state.loading = false;
          state.products = state.products.filter(
            (item: IProduct) => item._id !== action.payload
          );
        }
      )
      .addCase(removeOneProduct.rejected, setError)

      .addCase(
        updateNewProduct.fulfilled,
        (state: ProductState, action: PayloadAction<IProduct>) => {
          state.loading = false;
          const index: number = state.products.findIndex(
            (item: IProduct) => item._id === action.payload._id
          );
          state.products[index] = action.payload;
        }
      )
      .addCase(updateNewProduct.rejected, setError)

      .addCase(
        createProduct.fulfilled,
        (state: ProductState, action: PayloadAction<IProduct>) => {
          state.loading = false;
          state.products = [action.payload, ...state.products];
        }
      )
      .addCase(createProduct.rejected, setError)

      .addCase(
        fetchProductById.fulfilled,
        (state: ProductState, action: PayloadAction<IProduct>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, setError);
  },
});

export default productSlice.reducer;
