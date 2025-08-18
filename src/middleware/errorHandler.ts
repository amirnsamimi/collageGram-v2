import type {Request, Response, NextFunction} from 'express';
import env from "../../env.ts";

/**
 * Error handling utilities for the CollageGram application.
 * 
 * This module provides:
 * 1. A custom error class (APIError) for throwing application-specific errors
 * 2. A global error handling middleware for Express
 * 
 * @module errorHandler
 */

/**
 * Custom API Error class for throwing application-specific errors with status codes.
 * 
 * @example
 * // Throwing a validation error
 * throw new APIError('Invalid email format', 400, 'ValidationError');
 * 
 * @example
 * // Throwing an unauthorized error
 * throw new APIError('Invalid token', 401, 'UnauthorizedError');
 * 
 * @example
 * // Throwing a custom error
 * throw new APIError('Resource not found', 404, 'NotFoundError');
 */
export class APIError extends Error {
    status: number;
    name: string;
    message: string;

    /**
     * Creates a new APIError instance
     * 
     * @param message - Error message to display
     * @param status - HTTP status code (e.g., 400, 401, 404, 500)
     * @param name - Error type name (e.g., 'ValidationError', 'UnauthorizedError')
     */
    constructor(message: string, status: number, name: string) {
        super();
        this.message = message;
        this.status = status;
        this.name = name;
    }
}

/**
 * Express middleware for handling errors in a consistent way across the application.
 * 
 * This middleware:
 * - Logs error stack traces to the console
 * - Sets appropriate HTTP status codes based on error types
 * - Returns JSON responses with error messages
 * - Includes stack traces and detailed error information in development mode
 * 
 * Special error types handled:
 * - ValidationError: Returns 400 Bad Request
 * - UnauthorizedError: Returns 401 Unauthorized
 * - All other errors: Returns the status from the error or 500 Internal Server Error
 * 
 * @example
 * // In your Express app setup (typically in server.ts):
 * import { errorHandler } from './middleware/errorHandler';
 * 
 * // Register routes first
 * app.use('/api/users', userRoutes);
 * 
 * // Register error handler last
 * app.use(errorHandler);
 * 
 * @example
 * // In your route handlers or controllers:
 * try {
 *   // Some operation that might fail
 *   if (!user) {
 *     throw new APIError('User not found', 404, 'NotFoundError');
 *   }
 * } catch (error) {
 *   next(error); // Pass to error handler
 * }
 * 
 * @param err - The error object thrown in the application
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    // Log error stack trace
    console.log(err.stack)
    
    // Set default status and message
    let status = err.status || 500
    let message = err.message || 'Internal Server Error'

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400
        message = err.message
    }

    if (err.name === 'UnauthorizedError') {
        status = 401
        message = err.message
    }

    // Send JSON response with appropriate status code
    // Include stack trace and details only in development mode
    res.status(status).json({
        error: message,
        ...(env.APP_STAGE === 'dev' && {stack: err.stack, details: err.message})
    })
}