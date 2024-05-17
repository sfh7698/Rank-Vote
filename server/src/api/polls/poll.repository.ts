import redisClient from '../../redis.js';
import { UnknownException } from "../../utils/exceptions.js";
import { errorLogger, generalLogger } from '../../utils/loggers.js';
import { AddParticipantData, 
        CreatePollData,
        AddNominationData,
        AddParticipantRankingsData} from './types';
import { Poll, Results } from 'shared';

export default class PollsRepository {
    private readonly ttl = process.env.POLL_DURATION || "7200";

    private getKey = (pollID: string) => {
        return `polls:${pollID}`
    }

    private setPoll = async (poll: Poll) => {
        await redisClient.setex(this.getKey(poll.id), await this.getTTL(poll.id), JSON.stringify(poll));
    }

    private getTTL = async(pollID: string) => {
        return await redisClient.ttl(this.getKey(pollID));
    }

    createPoll = async ({votesPerVoter, topic, pollID, userID }: CreatePollData): Promise<Poll> => {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},
            nominations: {},
            rankings: {},
            results: [],
            adminID: userID,
            hasStarted: false
        }

        generalLogger.info(`Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${this.ttl}`);

        try {
            await redisClient.setex(this.getKey(pollID), this.ttl, JSON.stringify(initialPoll));
            return initialPoll;

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to add poll ${JSON.stringify(initialPoll)}`);
        }
    }

    getPoll = async (pollID: string): Promise<Poll | undefined> => {
        generalLogger.info(`Attempting to get poll with: ${pollID}`);

        const key = this.getKey(pollID);

        try {
            const currentPoll = await redisClient.get(key);
            generalLogger.verbose(currentPoll);
            
            if(currentPoll){
                return JSON.parse(currentPoll);
            }

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to get pollID ${pollID}`);
        }
    }

    addParticipant = async({pollID, userID, name}: AddParticipantData): Promise<Poll | undefined> => {
        generalLogger.info(`Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);

        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                poll.participants[userID] = name;
                await this.setPoll(poll);
    
                generalLogger.info( `Current Participants for pollID: ${pollID}: ${JSON.stringify(poll.participants)}`);
    
                return poll;
            }

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);
        }
    }

    removeParticipant = async(pollID: string, userID: string): Promise<Poll | undefined> => {
        generalLogger.debug(`removing userID: ${userID} from poll: ${pollID}`);

        try {
            const poll = await this.getPoll(pollID);

            if (poll) {
                delete poll.participants[userID];
                await this.setPoll(poll);
                return poll;
            } 

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to remove userID: ${userID} from poll: ${pollID}`)

        }
    }

    addNomination = async({pollID, nominationID, nomination}: AddNominationData): Promise<Poll | undefined> => {
        generalLogger.info(`Attempting to add a nomination with nominationID/nomination: ${nominationID}/${nomination.text} to pollID: ${pollID}`);

        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                poll.nominations[nominationID] = nomination;
                await this.setPoll(poll);
                return poll;
            }

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to add a nomination with nominationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`);
        }
    }

    removeNomination = async(pollID: string, nominationID: string): Promise<Poll | undefined> => {
        generalLogger.info(`removing nominationID: ${nominationID} from poll: ${pollID}`);

        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                delete poll.nominations[nominationID];
                await this.setPoll(poll);
                return poll;
            }

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to remove nominationID: ${nominationID} from poll: ${pollID}`);
        }
    }

    startPoll = async(pollID: string): Promise<Poll | undefined> => {
        generalLogger.info(`setting hasStarted for poll: ${pollID}`);


        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                poll.hasStarted = true;
                await this.setPoll(poll);
                return poll;
            }

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException('Error starting the poll');
        }
    }
    
    addParticipantRankings = async({ pollID, userID, rankings }: AddParticipantRankingsData): Promise<Poll | undefined> => {
        generalLogger.info(`Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`, rankings);

        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                poll.rankings[userID] = rankings;
                await this.setPoll(poll);
                return poll;
            }

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException('Error submitting rankings');

        }

    }

    addResults = async(pollID: string, results: Results): Promise<Poll | undefined> => {
        const resultsString = JSON.stringify(results);
        generalLogger.debug(`attempting to add results to pollID: ${pollID}`, resultsString);

        try {
            const poll = await this.getPoll(pollID);
            if(poll) {
                poll.results = results;
                await this.setPoll(poll);
                return poll;
            }

        } catch(e){
            errorLogger.error(e);
            throw new UnknownException(`Failed to add add results for pollID: ${pollID}`);
        }
    }

    deletePoll = async(pollID: string): Promise<void> => {
        const key = this.getKey(pollID);

        generalLogger.info(`deleting poll: ${pollID}`);

        try {
            await redisClient.del(key);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to delete poll: ${pollID}`);
        }
    }
}