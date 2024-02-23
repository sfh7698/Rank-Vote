import { PayloadAction, createSlice } from "@reduxjs/toolkit/react";

type initialState = {
    error: string
}
const state: initialState = {
    error: ""
}

const errorSlice = createSlice({
    name: 'errors',
    initialState: state,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        }
    },
    selectors: {
        selectError: (state) => state.error
    }

});

export const { setError } = errorSlice.actions;

export const { selectError } = errorSlice.selectors;

export default errorSlice.reducer;