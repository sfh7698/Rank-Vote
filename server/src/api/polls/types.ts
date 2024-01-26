import { Request } from "express";
import { Poll, Nomination } from "shared";

/*
service types
*/
export type CreatePollFields = Pick<Poll, "topic" | "votesPerVoter"> & { name: string };

export type JoinPollFields = { pollID: string } & Pick<CreatePollFields, "name">;

export type PollServiceFields = { 
    poll: Poll,
    accessToken: string
};

export type RejoinPollFields = JoinPollFields & Pick<Nomination, "userID">;

export type AddParticipantFields = RejoinPollFields;

export type AddNominationFields = Pick<JoinPollFields, "pollID"> & Nomination;

export type SubmitRankingsFields = Pick<RejoinPollFields, "pollID" | "userID"> & { rankings: string[] };

/*
controller types
*/
export type PollResponse = Omit<PollServiceFields, "accessToken">;

/*
repository types
*/
export type CreatePollData = Pick<CreatePollFields, "topic" | "votesPerVoter"> & Pick<RejoinPollFields, "pollID" | "userID">;

export type AddParticipantData = RejoinPollFields;

export type AddNominationData = Pick<JoinPollFields, "pollID"> & {
    nominationID: string,
    nomination: Nomination
};

export type AddParticipantRankingsData = SubmitRankingsFields;

/*
middleware types
*/
export interface RequestWithAuth extends Request{
    body: RejoinPollFields;
};
