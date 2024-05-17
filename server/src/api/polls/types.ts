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

export type AddParticipantFields = JoinPollFields & Pick<Nomination, "userID">;;

export type AddNominationFields = Pick<JoinPollFields, "pollID"> & Nomination;

export type SubmitRankingsFields = Pick<AddParticipantFields, "pollID" | "userID"> & { rankings: string[] };

/*
controller types
*/
export type PollResponse = Omit<PollServiceFields, "accessToken">;

/*
repository types
*/
export type CreatePollData = Pick<CreatePollFields, "topic" | "votesPerVoter"> & Pick<AddParticipantFields, "pollID" | "userID">;

export type AddParticipantData = AddParticipantFields;

export type AddNominationData = Pick<JoinPollFields, "pollID"> & {
    nominationID: string,
    nomination: Nomination
};

export type AddParticipantRankingsData = SubmitRankingsFields;

/*
middleware types
*/
export interface RequestWithAuth extends Request{
    body: AddParticipantFields;
};
