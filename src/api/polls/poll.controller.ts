import { Request, Response } from 'express';
import { CreatePollFields, JoinPollFields, PollServiceFields } from './poll.types';
import PollService from './poll.service';

export default class PollController {

    private readonly pollService: PollService;

    constructor() {
        this.pollService = new PollService();
    }

    createPoll = async (req: Request<{}, {}, CreatePollFields>, res: Response<PollServiceFields>) => {
        const fields = req.body;
        const result = await this.pollService.createPoll(fields);

        res.status(201).json(result);
        
    };

    joinPoll = async (req: Request<{}, {}, JoinPollFields>, res: Response<PollServiceFields>) => {
        const fields = req.body;
        const result = await this.pollService.joinPoll(fields);

        res.status(201).json(result);
    };

    rejoinPoll = (_: Request, res: Response) => {
        const result = this.pollService.rejoinPoll({
            name: 'From token',
            pollID: 'Also from token',
            userID: 'Guess where this comes from?'
        });

        res.status(201).json(result);
    };


}