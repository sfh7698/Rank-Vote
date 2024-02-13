import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Poll } from "shared";

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
            transformResponse: (response: {poll: Poll}, meta, _) => {
                const token = meta?.response?.headers.get("Authorization");
                return {
                    poll: response.poll,
                    token
                }
            }
        }),
        joinPoll: builder.mutation<PollResponse, joinPollValues>({
            query: (values) => ({
                url: '/join',
                method: 'POST',
                body: values
            }),
            transformResponse: (response: {poll: Poll}, meta, _) => {
                const token = meta?.response?.headers.get("Authorization");
                return {
                    poll: response.poll,
                    token
                }
            }
        })
    })

})

export const {useCreatePollMutation, useJoinPollMutation} = apiSlice;