import { createPollID, createUserID } from "../../utils/ids";
import { 
    CreatePollFields, 
    JoinPollFields, 
    RejoinPollFields, 
    PollServiceFields,
    Poll,
    AddParticipantFields} from "./poll.types";
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

        generalLogger.info( `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, createdPoll.id, fields.name);

        return {
            poll: createdPoll,
            accessToken: signedString
        };
    };

    joinPoll = async (fields: JoinPollFields): Promise<PollServiceFields> => {
        const userID = createUserID();

        generalLogger.info(`Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`);

        const joinedPoll = await this.pollRepository.getPoll(fields.pollID);

        generalLogger.info(`Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, joinedPoll.id, fields.name);

        return {
            poll: joinedPoll,
            accessToken: signedString
        }
    };

    rejoinPoll = async (fields: RejoinPollFields) : Promise<Poll> => {
        generalLogger.info(`Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`);

        return await this.pollRepository.addParticipant(fields);
    }

    addParticipant = async(addParticipant: AddParticipantFields): Promise<Poll> => {
        return await this.pollRepository.addParticipant(addParticipant);
    }

    removeParticipant = async(pollID: string, userID: string): Promise<Poll | void> => {
        const poll = await this.pollRepository.getPoll(pollID);

        if(!poll.hasStarted) {
            return await this.pollRepository.removeParticipant(pollID, userID);
        }
    }
}