import { createSlice } from "@reduxjs/toolkit/react";
import { PayloadAction } from "@reduxjs/toolkit/react";
import { Poll } from "shared";
import { apiSlice } from "./apiSlice";
import { isAnyOf } from "@reduxjs/toolkit/react";

type pollState = {
    poll: Poll | null
}

const initialState: pollState = {
    poll: null
}

export const pollSlice = createSlice({
    name: 'poll',
    initialState,
    reducers: {
        setPoll: (state, action: PayloadAction<Poll>) => {
            state.poll = action.payload;
        }
    },
    selectors: {
        selectPoll: (state) => state.poll
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(apiSlice.endpoints.createPoll.matchFulfilled, apiSlice.endpoints.joinPoll.matchFulfilled),
            (state, {payload}) => {
                state.poll = payload.poll
            }
        )
    }
});

export const { setPoll } = pollSlice.actions;

export const { selectPoll } = pollSlice.selectors;

export default pollSlice.reducer;
