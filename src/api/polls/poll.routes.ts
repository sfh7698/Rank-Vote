import { Router } from 'express';
import PollController from './poll.controller';
import { validate } from 'express-validation';
import { authRejoin } from './middlewares/auth';
import { validateCreatePoll, validateJoinPoll } from './middlewares/validate';

const router: Router = Router();

const pollController = new PollController();

router.post('/', validate(validateCreatePoll, {keyByField: true}), pollController.createPoll);

router.post('/join', validate(validateJoinPoll, {keyByField: true}), pollController.joinPoll);

router.post('/rejoin', authRejoin, pollController.rejoinPoll)

export default router;