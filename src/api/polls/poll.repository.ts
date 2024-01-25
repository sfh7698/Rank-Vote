import redisClient from '../../redis/redis';
import { UnknownException } from '../../utils/exceptions';
import { errorLogger, generalLogger } from '../../utils/loggers';
import { AddParticipantData, 
        CreatePollData, 
        Poll, 
        AddNominationData,
        AddParticipantRankingsData, 
        Results} from './poll.types';

export default class PollsRepository {
    private readonly ttl = process.env.POLL_DURATION;

    private getKey = (pollID: string) => {
        return `polls:${pollID}`
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

        // generalLogger.info(`Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${this.ttl}`);

        const key = this.getKey(pollID);

        try {
            await redisClient.multi([
                ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
                ['expire', key, this.ttl],
            ])
            .exec();
            return initialPoll;

        } catch (e) {
            errorLogger.error(e);
            // throw new Error();
            throw new UnknownException(`Failed to add poll ${JSON.stringify(initialPoll)}`);
        }
    }

    getPoll = async (pollID: string): Promise<Poll> => {
        // generalLogger.info(`Attempting to get poll with: ${pollID}`);

        const key = this.getKey(pollID);

        try {
            const currentPoll = await redisClient.call('JSON.GET', key, '.') as string;
            // generalLogger.verbose(currentPoll);

            // if (currentPoll?.hasStarted) {
            //     throw new Error;
            // }

            return JSON.parse(currentPoll);
        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to get pollID ${pollID}`);
        }
    }

    addParticipant = async({pollID, userID, name}: AddParticipantData): Promise<Poll> => {
        // generalLogger.info(`Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);

        const key = this.getKey(pollID);
        const participantPath = `.participants.${userID}`;

        try {
            await redisClient.call('JSON.SET', key, participantPath, JSON.stringify(name));

            const poll = await this.getPoll(pollID);

            // generalLogger.info( `Current Participants for pollID: ${pollID}: ${poll.participants}`);

            return poll;

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);
        }
    }

    removeParticipant = async(pollID: string, userID: string): Promise<Poll> => {
        // generalLogger.debug(`removing userID: ${userID} from poll: ${pollID}`);
        const key = this.getKey(pollID);
        const participantPath = `.participants.${userID}`;

        try {
            await redisClient.call('JSON.DEL', key, participantPath);
            return await this.getPoll(pollID);

        } catch (e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to remove userID: ${userID} from poll: ${pollID}`)

        }
    }

    addNomination = async({pollID, nominationID, nomination}: AddNominationData): Promise<Poll> => {
        generalLogger.info(`Attempting to add a nomination with nominationID/nomination: ${nominationID}/${nomination.text} to pollID: ${pollID}`);

        const key = this.getKey(pollID);
        const nominationPath = `.nominations.${nominationID}`;

        try {
            await redisClient.call('JSON.SET', key, nominationPath, JSON.stringify(nomination));
            return this.getPoll(pollID);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to add a nomination with nominationID/text: ${nominationID}/${nomination.text} to pollID: ${pollID}`);
        }
    }

    removeNomination = async(pollID: string, nominationID: string): Promise<Poll> => {
        generalLogger.info(`removing nominationID: ${nominationID} from poll: ${pollID}`);

        const key = this.getKey(pollID);
        const nominationPath = `.nominations.${nominationID}`;

        try {
            await redisClient.call('JSON.DEL', key, nominationPath);
            return this.getPoll(pollID);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to remove nominationID: ${nominationID} from poll: ${pollID}`);
        }
    }

    startPoll = async(pollID: string): Promise<Poll> => {
        generalLogger.info(`setting hasStarted for poll: ${pollID}`);

        const key = this.getKey(pollID);

        try {
            await redisClient.call('JSON.SET', key, '.hasStarted', JSON.stringify(true));

            return this.getPoll(pollID);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException('Error starting the poll');
        }
    }
    
    addParticipantRankings = async({ pollID, userID, rankings }: AddParticipantRankingsData): Promise<Poll> => {
        generalLogger.info(`Attempting to add rankings for userID/name: ${userID} to pollID: ${pollID}`, rankings);

        const key = this.getKey(pollID);
        const rankingsPath = `.rankings.${userID}`;

        try {
            await redisClient.call('JSON.SET', key, rankingsPath, JSON.stringify(rankings));

            return this.getPoll(pollID);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException('Error submitting rankings');

        }

    }

    addResults = async(pollID: string, results: Results): Promise<Poll> => {
        const resultsString = JSON.stringify(results);
        generalLogger.debug(`attempting to add results to pollID: ${pollID}`, resultsString);

        const key = this.getKey(pollID);
        const resultsPath = `.results`;

        try {
            await redisClient.call('JSON.SET', key, resultsPath, resultsString);

            return this.getPoll(pollID);

        } catch(e){
            errorLogger.error(e);
            throw new UnknownException(`Failed to add add results for pollID: ${pollID}`);
        }
    }

    deletePoll = async(pollID: string): Promise<void> => {
        const key = this.getKey(pollID);

        generalLogger.info(`deleting poll: ${pollID}`);

        try {
            await redisClient.call('JSON.DEL', key);

        } catch(e) {
            errorLogger.error(e);
            throw new UnknownException(`Failed to delete poll: ${pollID}`);
        }
    }
}