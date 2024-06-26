import { Router } from 'express';
import polls from './polls/poll.routes.js';

const router: Router = Router();

router.use('/polls', polls);

export default router;