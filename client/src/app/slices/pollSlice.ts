import { createSelector, createSlice } from "@reduxjs/toolkit/react";
import { PayloadAction } from "@reduxjs/toolkit/react";
import { Poll } from "shared";
import { apiSlice } from "./apiSlice";
import { isAnyOf } from "@reduxjs/toolkit/react";
import { RootState } from "../store";
import { selectPayloadFromToken } from "./authSlice";
import { isJwtPayload } from "../../utils";

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

export const selectIsAdmin = (state: RootState) => {
    const payload = selectPayloadFromToken(state);

    const poll = state.poll.poll

    return isJwtPayload(payload) ? payload?.id === poll?.adminID : false;
}

export const selectRankingsCount = createSelector(pollSlice.selectors.selectPoll, (poll) => {
    return Object.keys(poll?.rankings ?? {}).length;
});

export const selectNumUsersNominated = createSelector(pollSlice.selectors.selectPoll, (poll) => {
    const usersNominated: string[] = [];

    Object.values(poll?.nominations ?? {}).forEach(({userID}) => {
        if(!usersNominated.includes(userID)) {
            usersNominated.push(userID);
        }
    });
    return usersNominated.length;
})

export default pollSlice.reducer;
