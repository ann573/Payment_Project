import { configureStore } from '@reduxjs/toolkit'
import productReducer from "./../src/features/products/productSlice"
import customerReducer from "../src/features/customers/customerSlice"
import orderReducer from "../src/features/orders/orderSlice"
import attributeReducer from "../src/features/variants/variantSlice"
import attributeValueReducer from "../src/features/attributeValue/attributeSlice"
import { useDispatch, useSelector, useStore } from 'react-redux'
export const store = configureStore({
  reducer: {
    products: productReducer,
    customers : customerReducer,
    orders : orderReducer,
    attributes: attributeReducer,
    attributesValue: attributeValueReducer
  },
})

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()