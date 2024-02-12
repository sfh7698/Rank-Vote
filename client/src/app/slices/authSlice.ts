import { apiSlice } from "./apiSlice";
import { createSlice } from "@reduxjs/toolkit/react";

type authState = {
    accessToken: string | null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {accessToken: null} as authState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.createPoll.matchFulfilled,
            (state, {payload}) => {
                state.accessToken = payload.token as string;
            }
        )
    }
})

export default authSlice.reducer;