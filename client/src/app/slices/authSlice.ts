import { RootState } from "../store";
import { apiSlice } from "./apiSlice";
import { createSlice } from "@reduxjs/toolkit/react";
import { JwtPayload, jwtDecode } from "jwt-decode";

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
        builder.addMatcher(
            apiSlice.endpoints.joinPoll.matchFulfilled,
            (state, {payload}) => {
                state.accessToken = payload.token as string;
            }
        )
    }
});

export const selectUserFromToken = (state: RootState) => {
    const token = state.auth.accessToken;

    if (!token) {
        return null
    }

    interface JWTPayloadWithName extends JwtPayload {
        name: string
    }

    const payload = jwtDecode<JWTPayloadWithName>(token);
    return {
        id: payload.sub,
        name: payload.name
    }
}

export default authSlice.reducer;