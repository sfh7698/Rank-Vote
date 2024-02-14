import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Poll } from "shared";
import { FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";

type createPollValues = {
    topic: string,
    votesPerVoter: number,
    name: string
}

type PollResponse = {
    poll: Poll,
    token: string | null | undefined
}

type joinPollValues = {
    pollID: string,
    name: string
}

function getAuthHeader(response: {poll: Poll}, meta: FetchBaseQueryMeta, _: createPollValues | joinPollValues) {
    const token = meta?.response?.headers.get("Authorization");
        return {
            poll: response.poll,
            token
        }
}

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/polls',
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
        
    }),
    endpoints: (builder) => ({
        createPoll: builder.mutation<PollResponse, createPollValues>({
            query: (values) => ({
                url: '',
                method: 'POST',
                body: values,
                
            }),
            transformResponse: getAuthHeader
        }),
        joinPoll: builder.mutation<PollResponse, joinPollValues>({
            query: (values) => ({
                url: '/join',
                method: 'POST',
                body: values
            }),
            transformResponse: getAuthHeader
        })
    })

})

export const {useCreatePollMutation, useJoinPollMutation} = apiSlice;