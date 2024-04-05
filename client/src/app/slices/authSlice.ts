import { apiSlice } from "./apiSlice";
import { createSlice, PayloadAction, isAnyOf, createSelector } from "@reduxjs/toolkit/react";
import { getPayloadFromToken } from "../../utils";

type authState = {
    accessToken: string | null
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {accessToken: null} as authState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        }
    },
    selectors: {
        selectToken: (state) => state.accessToken

    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(apiSlice.endpoints.createPoll.matchFulfilled, apiSlice.endpoints.joinPoll.matchFulfilled),
            (state, {payload}) => {
                state.accessToken = payload.token as string;
            }
        )
    }
});

export const { setToken } = authSlice.actions;

export const selectPayloadFromToken = createSelector([authSlice.selectors.selectToken], (token) => {
    if (!token) {
        return token;
    }

    return getPayloadFromToken(token);
})

export default authSlice.reducer;