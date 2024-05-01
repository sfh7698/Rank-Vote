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

        try {
            const createdPoll = await this.pollRepository.createPoll({...fields, pollID, userID});
    
            // generalLogger.info( `Creating token string for pollID: ${createdPoll.id} and userID: ${userID}`);
    
            const signedString = generateToken(userID, createdPoll.id, fields.name);
    
            return {
                poll: createdPoll,
                accessToken: signedString
            };
        } catch(e) {
            throw e;
        }

    };

    joinPoll = async (fields: JoinPollFields): Promise<PollServiceFields | null> => {
        const userID = createUserID();

        // generalLogger.info(`Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`);

        try {
            const joinedPoll = await this.pollRepository.getPoll(fields.pollID);
    
            if(joinedPoll === null) {
                return null;
            }
    
            // generalLogger.info(`Creating token string for pollID: ${joinedPoll.id} and userID: ${userID}`);
    
            const signedString = generateToken(userID, joinedPoll.id, fields.name);
    
            return {
                poll: joinedPoll,
                accessToken: signedString
            }
        } catch(e) {
            throw e;
        }

    };

    rejoinPoll = async (fields: RejoinPollFields) : Promise<Poll> => {
        // generalLogger.info(`Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`);
        try {
            return await this.pollRepository.addParticipant(fields);
        } catch(e) {
            throw e;
        }
    }

    addParticipant = async(addParticipant: AddParticipantFields): Promise<Poll> => {
        try {
            return await this.pollRepository.addParticipant(addParticipant);

        } catch(e) {
            throw e;
        }
    }

    removeParticipant = async(pollID: string, userID: string): Promise<Poll | void> => {
        try {
    
            const poll = await this.pollRepository.removeParticipant(pollID, userID);

            if (Object.keys(poll.participants).length === 0) {
                this.pollRepository.deletePoll(pollID);
            }

            return poll;

        } catch(e) {
            throw e;
        }
    }

    getPoll = async(pollID: string): Promise<Poll> => {
        try {
            return await this.pollRepository.getPoll(pollID);

        } catch(e) {
            throw e;
        }
    }
    
    addNomination = async({pollID, userID, text}: AddNominationFields): Promise<Poll> => {
        try {
            return this.pollRepository.addNomination({
                pollID,
                nominationID: createNominationID(),
                nomination: {
                    userID,
                    text
                }
            });

        } catch(e) {
            throw e;
        }
    }

    removeNomination = async(pollID: string, nominationID: string): Promise<Poll> => {
        try {
            return await this.pollRepository.removeNomination(pollID, nominationID);

        } catch(e) {
            throw e;
        }
    }

    startPoll = async (pollID: string): Promise<Poll> => {
        try {
            return await this.pollRepository.startPoll(pollID);

        } catch(e) {
            throw e;
        }
    }

    submitRankings = async(rankingsData: SubmitRankingsFields): Promise<Poll> => {
        try {
            const poll = await this.pollRepository.getPoll(rankingsData.pollID);
    
            if(!poll.hasStarted) {
                throw new UnauthorizedException(403, 'Participants cannot rank until the poll has started');
            }
    
            return await this.pollRepository.addParticipantRankings(rankingsData);

        } catch(e) {
            throw e;
        }
    }

    computeResults = async(pollID: string): Promise<Poll> => {
        try {
            const poll = await this.pollRepository.getPoll(pollID);
    
            const results = this.getResults(poll.rankings, poll.nominations, poll.votesPerVoter);
    
            return this.pollRepository.addResults(pollID, results);

        } catch(e) {
            throw e;
        }
    }

    cancelPoll = async(pollID: string): Promise<void> => {
        try {
            await this.pollRepository.deletePoll(pollID);

        } catch(e) {
            throw e;
        }
    }
}