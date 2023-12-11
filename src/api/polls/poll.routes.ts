import { Router } from 'express';
import { createPoll, joinPoll, rejoinPoll } from './poll.controller';
import { validate } from 'express-validation';
import { validateCreatePoll, validateJoinPoll } from './poll.middleware';

const router: Router = Router();

router.post('/', validate(validateCreatePoll, {keyByField: true}), createPoll);

router.post('/join', validate(validateJoinPoll, {keyByField: true}), joinPoll);

router.post('/rejoin', rejoinPoll)

export default router;