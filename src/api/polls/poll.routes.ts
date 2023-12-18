import { Router } from 'express';
import PollController from './poll.controller';
import { validate } from 'express-validation';
import { validateCreatePoll, validateJoinPoll } from './poll.middleware';

const router: Router = Router();

const pollController = new PollController();

router.post('/', validate(validateCreatePoll, {keyByField: true}), pollController.createPoll);

router.post('/join', validate(validateJoinPoll, {keyByField: true}), pollController.joinPoll);

router.post('/rejoin', pollController.rejoinPoll)

export default router;