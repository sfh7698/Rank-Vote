import { createPollID, createUserID } from "../../utils/ids";
import { 
    CreatePollFields, 
    JoinPollFields, 
    RejoinPollFields, 
    CreatePollServiceFields, 
    JoinPollServiceFields } from "./poll.types";

export default class PollService {
    createPoll = (fields: CreatePollFields): CreatePollServiceFields => {
        const pollID = createPollID();
        const userID = createUserID();

        return {
            ...fields,
            userID,
            pollID,
        };      
    };

    joinPoll = (fields: JoinPollFields): JoinPollServiceFields => {
        const userID = createUserID();

        return {
            ...fields,
            userID,
        };
    };

    rejoinPoll = (fields: RejoinPollFields) => {
        return fields;
    }
}