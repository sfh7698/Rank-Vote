import { NextFunction, Request, Response } from 'express';
import { CreatePollFields, JoinPollFields, PollResponse } from './types.js';
import PollService from './poll.service.js';
import { BadRequestException } from "../../utils/exceptions.js";

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
        try {
            const result = await this.pollService.createPoll(fields);
            this.setAuthHeader(res, result.accessToken);
    
            res.status(201).json({poll: result.poll});

        } catch(e) {
            throw e;
        }
        
    };

    joinPoll = async (req: Request<{}, {}, JoinPollFields>, res: Response<PollResponse>, next: NextFunction) => {
        const fields = req.body;

        try {
            const result = await this.pollService.joinPoll(fields);
    
            if(result === null) {
                next(new BadRequestException("Invalid Poll ID"));
                return
            }
    
            this.setAuthHeader(res, result.accessToken);
    
            res.status(201).json({poll: result.poll});

        } catch(e) {
            throw e;
        }
    };
}