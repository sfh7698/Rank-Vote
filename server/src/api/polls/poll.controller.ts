import { NextFunction, Request, Response } from 'express';
import { CreatePollFields, JoinPollFields, PollResponse, RequestWithAuth } from './types';
import { Poll } from 'shared';
import PollService from './poll.service';
import { BadRequestException } from "../../utils/exceptions";

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

    joinPoll = async (req: Request<{}, {}, JoinPollFields>, res: Response<PollResponse>, next: NextFunction) => {
        const fields = req.body;
        const result = await this.pollService.joinPoll(fields);

        if(result === null) {
            next(new BadRequestException("Invalid Poll ID"));
            return
        }

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