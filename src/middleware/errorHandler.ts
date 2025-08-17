import type {Request, Response, NextFunction} from 'express';
import env from "../../env.ts";

//idea 1
// for throwing errors
export class APIError extends Error {
    status: number;
    name: string;
    message: string;

    constructor(message: string, status: number, name: string) {
        super();
        this.message = message;
        this.status = status;
        this.name = name;
    }
}

// idea 2
// for middlewares
//sentery, bugsnack, pino ,... no wrong answer ( check ErrorRequestHandler )
export const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {

    console.log(err.stack)
    let status = err.status || 500
    let message = err.message || 'Internal Server Error'


    if (err.name === 'ValidationError') {
        status = 400
        message = err.message
    }

    if (err.name === 'UnauthorizedError') {
        status = 401
        message = err.message
    }

    res.status(status).json({
        error: message,
        ...(env.APP_STAGE === 'dev' && {stack: err.stack, details: err.message})
    })


}