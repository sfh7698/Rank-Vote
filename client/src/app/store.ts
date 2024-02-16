import { configureStore } from "@reduxjs/toolkit/react";
import pollReducer from "./slices/pollSlice";
import { apiSlice } from "./slices/apiSlice";
import authReducer from "./slices/authSlice";
import authMiddleware from "./authMiddleware";

export const store = configureStore({
    reducer: {
        poll: pollReducer,
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(authMiddleware.middleware).concat(apiSlice.middleware),
    devTools: true,
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
