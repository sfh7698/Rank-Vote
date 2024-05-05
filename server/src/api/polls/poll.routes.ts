import { Router } from 'express';
import PollController from './poll.controller.js';
import { validate } from 'express-validation';
import { authRejoin } from './middlewares/auth.js';
import { validateCreatePoll, validateJoinPoll } from './middlewares/validate.js';

const router: Router = Router();

const pollController = new PollController();

router.post('/', validate(validateCreatePoll, {keyByField: true}), pollController.createPoll);

router.post('/join', validate(validateJoinPoll, {keyByField: true}), pollController.joinPoll);

router.post('/rejoin', authRejoin, pollController.rejoinPoll)

export default router;