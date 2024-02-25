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

export const selectPayloadFromToken = createSelector([(state) => state.auth.accessToken], (token) => {
    if (!token) {
        return token;
    }

    interface JWTPayloadWithName extends JwtPayload {
        name: string
    }

    const payload = jwtDecode<JWTPayloadWithName>(token);
    return {
        id: payload.sub,
        ...payload
    }
})

export default authSlice.reducer;