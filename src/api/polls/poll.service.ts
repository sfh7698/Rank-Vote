import { createPollID, createUserID } from "../../utils/ids";
import { 
    CreatePollFields, 
    JoinPollFields, 
    RejoinPollFields, 
    PollServiceFields,
    Poll} from "./poll.types";
import PollsRepository from "./poll.repository";
import { generalLogger } from "../../utils/loggers";
import generateToken  from "../../utils/generateToken"

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
        generalLogger.debug( `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, createdPoll.id, fields.name);

        return {
            poll: createdPoll,
            accessToken: signedString
        };
    };

    joinPoll = async (fields: JoinPollFields): Promise<PollServiceFields> => {
        const userID = createUserID();

        generalLogger.debug(`Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`);

        const joinedPoll = await this.pollRepository.getPoll(fields.pollID);

        // TODO - create access Token
        generalLogger.debug(`Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, joinedPoll.id, fields.name);

        return {
            poll: joinedPoll,
            accessToken: signedString
        }
    };

    rejoinPoll = async (fields: RejoinPollFields) : Promise<Poll> => {
        generalLogger.debug(`Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`);

        const joinedPoll = await this.pollRepository.addParticipant(fields);

        return joinedPoll;
    }
}