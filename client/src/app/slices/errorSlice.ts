import { PayloadAction, createSlice } from "@reduxjs/toolkit/react";

export enum errorResponses {
    TOKEN_ERROR = "Failed to connect to poll",
    REMOVED_ERROR = "You have been removed from the poll",
    CANCELLED_ERROR = "Poll Cancelled"
}

type initialState = {
    error: errorResponses | string
}
const state: initialState = {
    error: ""
}

const errorSlice = createSlice({
    name: 'errors',
    initialState: state,
    reducers: {
        setError: (state, action: PayloadAction<errorResponses | string>) => {
            console.log(action.payload);
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