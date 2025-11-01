import { ObjectId } from 'mongodb';
import { getDb } from '../../server';
import { AccountPayload } from './account.schema';

const COLLECTION_NAME = 'accounts';

export async function createAccount(payload: AccountPayload) {
    const db = getDb();
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const document = {
        ...payload,
        createdAt: now,
        updatedAt: now,
    };

    const result = await collection.insertOne(document);

    return {
        _id: result.insertedId,
        ...document,
    };
}

export async function updateAccount(id: string, payload: Partial<AccountPayload>) {
    const db = getDb();
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const updateData = {
        ...payload,
        updatedAt: now,
    };

    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
    );

    return result?.value ?? null;
}

export async function getAccountStats() {
    const db = getDb();
    const collection = db.collection(COLLECTION_NAME);

    const pipeline = [
        {
            $group: {
                _id: '$scope',
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                accounts: {
                    $sum: { $cond: [{ $eq: ['$_id', 'account'] }, '$count', 0] }
                },
                prospects: {
                    $sum: { $cond: [{ $eq: ['$_id', 'prospect'] }, '$count', 0] }
                },
                children: {
                    $sum: { $cond: [{ $eq: ['$_id', 'child'] }, '$count', 0] }
                }
            }
        },
        {
            $project: {
                _id: 0,
                accounts: { $ifNull: ['$accounts', 0] },
                prospects: { $ifNull: ['$prospects', 0] },
                children: { $ifNull: ['$children', 0] }
            }
        }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results[0] || { accounts: 0, prospects: 0, children: 0 };
}
