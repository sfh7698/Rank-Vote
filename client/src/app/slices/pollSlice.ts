import { createSlice } from "@reduxjs/toolkit/react";
import { PayloadAction } from "@reduxjs/toolkit/react";
import { Poll } from "shared";
import { RootState } from "../store";
import { apiSlice } from "./apiSlice";

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
    extraReducers: (builder) => {
        builder.addMatcher(
            apiSlice.endpoints.createPoll.matchFulfilled,
            (state, {payload}) => {
                state.poll = payload.poll
            }
        ),
        builder.addMatcher(
            apiSlice.endpoints.joinPoll.matchFulfilled,
            (state, {payload}) => {
                state.poll = payload.poll;
            }
        )
    }
});

export const { setPoll } = pollSlice.actions;

export const selectPoll = (state: RootState) => state.poll.poll;

export default pollSlice.reducer;
