import { apiSlice } from "./apiSlice";
import { createSlice, PayloadAction, isAnyOf, createSelector } from "@reduxjs/toolkit/react";
import { JwtPayload, jwtDecode } from "jwt-decode";

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

export interface JWTPayloadWithName extends JwtPayload {
    name: string
}

export const selectPayloadFromToken = createSelector([authSlice.selectors.selectToken], (token) => {
    if (!token) {
        return token;
    }

    const payload = jwtDecode<JWTPayloadWithName>(token);
    return {
        id: payload.sub,
        ...payload
    }
})

export default authSlice.reducer;