import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { createAccount, updateAccount, getAccountStats } from './account.service';
import { ERROR_MESSAGES } from './account.messages';

export async function createAccountHandler(req: Request, res: Response): Promise<void> {
    try {
        const account = await createAccount(req.body);
        res.status(201).json(account);
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}

export async function updateAccountHandler(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                issues: { id: [ERROR_MESSAGES.INVALID_OBJECT_ID_FORMAT] }
            });
            return;
        }

        const account = await updateAccount(id, req.body);

        if (!account) {
            res.status(404).json({ message: ERROR_MESSAGES.ACCOUNT_NOT_FOUND });
            return;
        }

        res.status(200).json(account);
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}

export async function getAccountStatsHandler(req: Request, res: Response): Promise<void> {
    try {
        const stats = await getAccountStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching account statistics:', error);
        res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
}