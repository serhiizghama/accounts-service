import { Router } from 'express';
import { createAccountHandler, updateAccountHandler, getAccountStatsHandler } from './account.controller';
import { validateCreate, validateUpdate } from './account.middleware';

const router = Router();

router.post('/accounts', validateCreate, createAccountHandler);
router.get('/accounts/stats', getAccountStatsHandler);
router.patch('/accounts/:id', validateUpdate, updateAccountHandler);

export default router;
