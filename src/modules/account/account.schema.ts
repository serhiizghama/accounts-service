import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGES } from './account.messages';

const SCOPE_VALUES = ['account', 'prospect', 'child'] as const;

export const baseModelSchema = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const accountPayloadSchema = z.object({
    name: z.string().min(1, ERROR_MESSAGES.NAME_MIN_LENGTH),
    scope: z.enum(SCOPE_VALUES),
});

export const accountSchema = baseModelSchema
    .merge(accountPayloadSchema)
    .extend({
        _id: z.union([z.instanceof(ObjectId), z.string()]),
    });

export type BaseModel = z.infer<typeof baseModelSchema>;
export type AccountPayload = z.infer<typeof accountPayloadSchema>;
export type Account = z.infer<typeof accountSchema>;