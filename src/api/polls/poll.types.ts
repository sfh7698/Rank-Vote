export type CreatePollFields = {
    topic: String,
    votesPerVoter: Number,
    name: String
}

export type JoinPollFields = {
    pollID: String,
    name:String
}

export type RejoinPollFields = {
    pollID: String,
    userID: String,
    name: String
}

export type CreatePollServiceFields = CreatePollFields & {userID: String, pollID: String}

export type JoinPollServiceFields = JoinPollFields & {userID: String}