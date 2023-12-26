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
    // hasStarted: boolean;
}

//service types
export type CreatePollFields = {
    topic: string,
    votesPerVoter: number,
    name: string
}

export type JoinPollFields = {
    pollID: string,
    name: string
}

export type PollServiceFields = { 
    poll: Poll,
    accessToken: string
};

export type RejoinPollFields = JoinPollFields & { userID: string };

// export type JoinPollServiceFields = CreatePollServiceFields

// repository types
export type CreatePollData = Pick<CreatePollFields, 'topic' | "votesPerVoter"> & {pollID: string, userID: string};

export type AddParticipantData = RejoinPollFields;
