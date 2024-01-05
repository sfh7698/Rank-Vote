import { Request } from "express";

export interface Participants {
    [particpantID: string]: string
}

export interface Poll {
    id: string;
    topic: string;
    votesPerVoter: number,
    participants: Participants;
    adminID: string;
    // nominations: Nominations;
    // rankings; Rankings
    // results: Results;
    hasStarted: boolean;
}

//service types
// export type CreatePollFields = {
//     topic: string,
//     votesPerVoter: number,
//     name: string
// }
export type CreatePollFields = Pick<Poll, "topic" | "votesPerVoter"> & { name: string };

// export type JoinPollFields = {
//     pollID: string,
//     name: string
// }
export type JoinPollFields = Pick<CreatePollFields, "name"> & { pollID: string };

export type PollServiceFields = { 
    poll: Poll,
    accessToken: string
};

export type RejoinPollFields = JoinPollFields & { userID: string };

export type AddParticipantFields = RejoinPollFields;

export type RemoveParticipantFields = Pick<RejoinPollFields, "pollID" | "userID">;

// controller types
export type PollResponse = Omit<PollServiceFields, "accessToken">;

// repository types
// export type CreatePollData = Pick<CreatePollFields, "topic" | "votesPerVoter"> & {pollID: string, userID: string};
export type CreatePollData = Pick<CreatePollFields, "topic" | "votesPerVoter"> & Pick<RejoinPollFields, "pollID" | "userID">;
export type AddParticipantData = RejoinPollFields;

// middleware types
export interface RequestWithAuth extends Request{
    body: RejoinPollFields;
};
