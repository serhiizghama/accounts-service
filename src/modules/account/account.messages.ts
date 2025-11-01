export const ERROR_MESSAGES = {
    // General error messages
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    VALIDATION_FAILED: 'Validation Failed',

    // Account-specific errors
    ACCOUNT_NOT_FOUND: 'Account not found',

    // Validation errors
    INVALID_OBJECT_ID_FORMAT: 'Invalid ObjectId format',

    // Forbidden field errors
    FORBIDDEN_FIELD_UPDATED_AT_ON_CREATE: 'Forbidden field: updatedAt cannot be set on create',
    FORBIDDEN_FIELD_CREATED_AT_ON_UPDATE: 'Forbidden field: createdAt cannot be set on update',

    // Field validation messages (for Zod schemas)
    NAME_MIN_LENGTH: 'String must contain at least 1 character(s)',
} as const;
