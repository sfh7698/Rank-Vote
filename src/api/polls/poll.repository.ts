import redisClient from '../../redis/redis';
import { errorLogger, generalLogger } from '../../utils/loggers';
import { AddParticipantData, CreatePollData, Poll } from './poll.types';

export default class PollsRepository {
    private readonly ttl = process.env.POLL_DURATION;

    createPoll = async ({votesPerVoter, topic, pollID, userID }: CreatePollData): Promise<Poll> => {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},
            adminID: userID,
        }

        generalLogger.info(`Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${this.ttl}`);

        const key = `polls:${pollID}`;

        try {
            await redisClient.multi([
                ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
                ['expire', key, this.ttl],
            ])
            .exec();
            return initialPoll;

        } catch(e) {
            errorLogger.error(e);
            throw e;
        }
    }

    getPoll = async (pollID: string): Promise<Poll> => {
        generalLogger.info(`Attempting to get poll with: ${pollID}`);

        const key = `polls:${pollID}`;

        try {
            const currentPoll = await redisClient.call('JSON.GET', key, '.') as string;
            generalLogger.verbose(currentPoll);

            // if (currentPoll?.hasStarted) {
            //     throw new Error;
            // }

            return JSON.parse(currentPoll);
        } catch (e) {
            errorLogger.error(`Failed to get pollID ${pollID}`);
            throw e;
        }
    }

    addParticipant = async({pollID, userID, name}: AddParticipantData): Promise<Poll> => {
        generalLogger.info(`Attempting to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);

        const key = `polls:${pollID}`;
        const participantPath = `.participants.${userID}`;

        try {
            await redisClient.call('JSON.SET', key, participantPath, JSON.stringify(name));

            const poll = await this.getPoll(pollID);

            generalLogger.info( `Current Participants for pollID: ${pollID}: ${poll.participants}`);

            return poll;

        } catch (e) {
            errorLogger.error(`Failed to add a participant with userID/name: ${userID}/${name} to pollID: ${pollID}`);
            throw e;
        }
    }
}