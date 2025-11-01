import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { accountPayloadSchema } from './account.schema';
import { ERROR_MESSAGES } from './account.messages';

function formatZodErrors(error: ZodError): Record<string, string[]> {
    const issues: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const field = issue.path.join('.');
        if (!issues[field]) {
            issues[field] = [];
        }
        issues[field].push(issue.message);
    });

    return issues;
}

export function validateCreate(req: Request, res: Response, next: NextFunction): void {
    try {
        const issues: Record<string, string[]> = {};

        if ('updatedAt' in req.body) {
            issues.updatedAt = [ERROR_MESSAGES.FORBIDDEN_FIELD_UPDATED_AT_ON_CREATE];
        }

        accountPayloadSchema.parse(req.body);

        if (Object.keys(issues).length > 0) {
            res.status(400).json({
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                issues,
            });
            return;
        }

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const zodIssues = formatZodErrors(error);
            res.status(400).json({
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                issues: {
                    ...zodIssues,
                    ...('updatedAt' in req.body
                        ? { updatedAt: [ERROR_MESSAGES.FORBIDDEN_FIELD_UPDATED_AT_ON_CREATE] }
                        : {}
                    ),
                },
            });
            return;
        }

        next(error);
    }
}

export function validateUpdate(req: Request, res: Response, next: NextFunction): void {
    try {
        const issues: Record<string, string[]> = {};

        if ('createdAt' in req.body) {
            issues.createdAt = [ERROR_MESSAGES.FORBIDDEN_FIELD_CREATED_AT_ON_UPDATE];
        }

        accountPayloadSchema.partial().parse(req.body);

        if (Object.keys(issues).length > 0) {
            res.status(400).json({
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                issues,
            });
            return;
        }

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const zodIssues = formatZodErrors(error);
            res.status(400).json({
                message: ERROR_MESSAGES.VALIDATION_FAILED,
                issues: {
                    ...zodIssues,
                    ...('createdAt' in req.body
                        ? { createdAt: [ERROR_MESSAGES.FORBIDDEN_FIELD_CREATED_AT_ON_UPDATE] }
                        : {}
                    ),
                },
            });
            return;
        }

        next(error);
    }
}
