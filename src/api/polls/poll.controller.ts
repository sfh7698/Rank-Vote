import { Request, Response } from 'express';
import { CreatePollData, JoinPollData } from './poll.types';


export const createPoll = (req: Request<{}, {}, CreatePollData>, res: Response<CreatePollData>) => {
    const data: CreatePollData = req.body;
    console.log("hit post create");
    return res.status(201).json(data);
};

export const joinPoll = (req: Request<{}, {}, JoinPollData>, res: Response<JoinPollData>) => {
    const data: JoinPollData = req.body;
    console.log("hit join")
    return res.status(201).json(data);
};

export const rejoinPoll = (_: Request, res: Response) => {
    return res.status(201).json('hit rejoin');
};