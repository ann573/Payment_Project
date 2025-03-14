import { createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { fetchAttribute, fetchAttributeById } from "./variantAction";

interface IAttribute {
  name: string;
  _id: string;
}

interface AttributeState {
  attributes: IAttribute[];
  attribute: IAttribute;
  loading: boolean;
  error: string | null;
}

const initialState: AttributeState = {
  attributes: [],
  attribute: {
    name: "",
    _id: "",
  },
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
  name: "attributes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttribute.pending, setLoading)
      .addCase(
        fetchAttribute.fulfilled,
        (state: AttributeState, action: PayloadAction<IAttribute[]>) => {
          state.loading = false;
          state.attributes = action.payload;
        }
      )
      .addCase(fetchAttribute.rejected, setError)

      .addCase(fetchAttributeById.pending, setLoading)
      .addCase(
        fetchAttributeById.fulfilled,
        (state: AttributeState, action: PayloadAction<IAttribute>) => {
          state.loading = false;
          state.attribute = action.payload;
        }
      )
      .addCase(fetchAttributeById.rejected, setError);
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
  },
});

export default attributeSlice.reducer;
