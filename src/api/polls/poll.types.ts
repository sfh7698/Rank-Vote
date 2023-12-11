export type CreatePollData = {
    topic: String,
    votesPerVoter: Number,
    name: String
}

export type JoinPollData = {
    pollID: String,
    name:String
}