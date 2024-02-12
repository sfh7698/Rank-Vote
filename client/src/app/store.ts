import { configureStore } from "@reduxjs/toolkit/react";
import pollReducer from "./slices/pollSlice";
import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        poll: pollReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;