import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import product from './slices/productSlice'
const store = configureStore({
    reducer: {
        auth: authSlice,
        product:product
    },
})

export default store