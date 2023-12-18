import { Request, Response } from 'express';
import { CreatePollFields, JoinPollFields, CreatePollServiceFields, JoinPollServiceFields } from './poll.types';
import PollService from './poll.service';

export default class PollController {

    private readonly pollService: PollService;

    constructor() {
        this.pollService = new PollService();
    }

    createPoll = (req: Request<{}, {}, CreatePollFields>, res: Response<CreatePollServiceFields>) => {
        const fields = req.body;
        const result = this.pollService.createPoll(fields);

        res.status(201).json(result);
        
    };

    joinPoll = (req: Request<{}, {}, JoinPollFields>, res: Response<JoinPollServiceFields>) => {
        const fields = req.body;
        const result = this.pollService.joinPoll(fields);

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