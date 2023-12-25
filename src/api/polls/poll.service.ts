import { createPollID, createUserID } from "../../utils/ids";
import { 
    CreatePollFields, 
    JoinPollFields, 
    RejoinPollFields, 
    PollServiceFields,
    Poll} from "./poll.types";
import PollsRepository from "./poll.repository";
import { generalLogger } from "../../utils/loggers";

export default class PollService {
    private readonly pollRepository: PollsRepository;

    constructor(){
        this.pollRepository = new PollsRepository();
    }

    createPoll = async (fields: CreatePollFields): Promise<PollServiceFields> => {
        const pollID = createPollID();
        const userID = createUserID();

        const createdPoll = await this.pollRepository.createPoll({...fields, pollID, userID});

        // TODO - create an accessToken based off of pollID and userID

        return {
            poll: createdPoll,
            // access token
        };
    };

    joinPoll = async (fields: JoinPollFields): Promise<PollServiceFields> => {
        const userID = createUserID();

        generalLogger.debug(`Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`);

        const joinedPoll = await this.pollRepository.getPoll(fields.pollID);

        // TODO - create access Token

        return {
            poll: joinedPoll,
            // accessToken: signedString
        }
    };

    rejoinPoll = async (fields: RejoinPollFields) : Promise<Poll> => {
        generalLogger.debug(`Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`);

        const joinedPoll = await this.pollRepository.addParticipant(fields);

        return joinedPoll;
    }
}