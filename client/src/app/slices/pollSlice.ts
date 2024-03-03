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
        selectPoll: (state) => state.poll,
        selectParticipantCount: (state) => Object.keys(state.poll?.participants || {}).length,
        selectNominationCount: (state) => Object.keys(state.poll?.nominations || {}).length,
        selectCanStartVote: (state): boolean => {
            const votesPerVoter = state.poll?.votesPerVoter;
            const nominationCount = pollSlice.getSelectors().selectNominationCount(state);
            return votesPerVoter !== undefined ? nominationCount >= votesPerVoter : false
        }
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

export const { selectPoll, selectParticipantCount, selectNominationCount, selectCanStartVote } = pollSlice.selectors;

export default pollSlice.reducer;
