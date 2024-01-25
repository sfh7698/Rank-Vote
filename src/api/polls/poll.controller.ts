import { Request, Response } from 'express';
import { CreatePollFields, JoinPollFields, PollResponse, RequestWithAuth, Poll } from './poll.types';
import PollService from './poll.service';

export default class PollController {

    private readonly pollService: PollService;

    constructor() {
        this.pollService = new PollService();
    }
    
    private setAuthHeader = (res: Response, accessToken: string): void => {
        res.setHeader('Authorization', accessToken);
    }

    createPoll = async (req: Request<{}, {}, CreatePollFields>, res: Response<PollResponse>) => {
        const fields = req.body;
        const result = await this.pollService.createPoll(fields);
        this.setAuthHeader(res, result.accessToken);

        res.status(201).json({poll: result.poll});
        
    };

    joinPoll = async (req: Request<{}, {}, JoinPollFields>, res: Response<PollResponse>) => {
        const fields = req.body;
        const result = await this.pollService.joinPoll(fields);
        this.setAuthHeader(res, result.accessToken);

        res.status(201).json({poll: result.poll});
    };

    rejoinPoll = async (req: RequestWithAuth, res: Response<Poll>) => {
        const { userID, pollID, name } = req.body;

        const result = await this.pollService.rejoinPoll({
            name,
            pollID,
            userID,
        });

        res.status(201).json(result);
    };


}