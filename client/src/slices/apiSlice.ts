import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { Poll } from "shared";

type createPollValues = {
    topic: string,
    votesPerVoter: number,
    name: string
}

type createResponse = {
    poll: Poll,
    token: string | null | undefined
}

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8080/api/polls',
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
        
    }),
    endpoints: (builder) => ({
        createPoll: builder.mutation<createResponse, createPollValues>({
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
        })
    })

})

export const {useCreatePollMutation} = apiSlice;