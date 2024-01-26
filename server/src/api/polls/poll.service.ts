import { createPollID, createUserID, createNominationID } from "../../utils/ids";
import { 
    CreatePollFields, 
    JoinPollFields, 
    RejoinPollFields, 
    PollServiceFields,
    AddParticipantFields,
    AddNominationFields,
    SubmitRankingsFields} from "./types";
import { Poll, Rankings, Nominations, Results } from "shared";
import PollsRepository from "./poll.repository";
import { generalLogger } from "../../utils/loggers";
import generateToken  from "../../utils/generateToken"
import { UnauthorizedException } from "../../utils/exceptions";

export default class PollService {
    private readonly pollRepository: PollsRepository;

    constructor(){
        this.pollRepository = new PollsRepository();
    }

    private getResults = (rankings: Rankings, nominations: Nominations, votesPerVoter: number): Results => {
        const scores: { [nominationID: string]: number } = {};

        Object.values(rankings).forEach((userRankings) => {
            userRankings.forEach((nominationID, n) => {
                const voteValue = Math.pow(
                    (votesPerVoter - 0.5 * n) / votesPerVoter,
                    n + 1
                );

                scores[nominationID] = (scores[nominationID] ?? 0) + voteValue;
            });
        });

        const results = Object.entries(scores).map(([nominationID, score]) => ({
            nominationID,
            nominationText: nominations[nominationID].text,
            score
        }));

        results.sort((res1, res2) => res2.score - res1.score);

        return results;
    }

    createPoll = async (fields: CreatePollFields): Promise<PollServiceFields> => {
        const pollID = createPollID();
        const userID = createUserID();

        const createdPoll = await this.pollRepository.createPoll({...fields, pollID, userID});

        // generalLogger.info( `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, createdPoll.id, fields.name);

        return {
            poll: createdPoll,
            accessToken: signedString
        };
    };

    joinPoll = async (fields: JoinPollFields): Promise<PollServiceFields> => {
        const userID = createUserID();

        // generalLogger.info(`Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`);

        const joinedPoll = await this.pollRepository.getPoll(fields.pollID);

        // generalLogger.info(`Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`);

        const signedString = generateToken(userID, joinedPoll.id, fields.name);

        return {
            poll: joinedPoll,
            accessToken: signedString
        }
    };

    rejoinPoll = async (fields: RejoinPollFields) : Promise<Poll> => {
        // generalLogger.info(`Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`);

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

    getPoll = async(pollID: string): Promise<Poll> => {
        return await this.pollRepository.getPoll(pollID);
    }
    
    addNomination = async({pollID, userID, text}: AddNominationFields): Promise<Poll> => {
        return this.pollRepository.addNomination({
            pollID,
            nominationID: createNominationID(),
            nomination: {
                userID,
                text
            }
        });
    }

    removeNomination = async(pollID: string, nominationID: string): Promise<Poll> => {
        return await this.pollRepository.removeNomination(pollID, nominationID);
    }

    startPoll = async (pollID: string): Promise<Poll> => {
        return await this.pollRepository.startPoll(pollID);
    }

    submitRankings = async(rankingsData: SubmitRankingsFields): Promise<Poll> => {
        const poll = await this.pollRepository.getPoll(rankingsData.pollID);

        if(!poll.hasStarted) {
            throw new UnauthorizedException(403, 'Participants cannot rank until the poll has started');
        }

        return await this.pollRepository.addParticipantRankings(rankingsData);
    }

    computeResults = async(pollID: string): Promise<Poll> => {
        const poll = await this.pollRepository.getPoll(pollID);

        const results = this.getResults(poll.rankings, poll.nominations, poll.votesPerVoter);

        return this.pollRepository.addResults(pollID, results);
    }

    cancelPoll = async(pollID: string): Promise<void> => {
        await this.pollRepository.deletePoll(pollID);
    }
}