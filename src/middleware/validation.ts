import {type ZodSchema, ZodError} from "zod"
import type {Request, Response, NextFunction} from "express";


export const bodyValidation = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body)

            next()
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                        error: 'invalid parameters', details: err.issues.map((err) => ({
                                field: err.path.join('.'),
                                message: err.message

                            })
                        )
                    }
                )
            }
        }
    }
}
export const queryValidation = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: 'invalid parameters', details: err.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
        }
    }
}

export const paramsValidation = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params)
            next()
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: 'invalid parameters', details: err.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                })
            }
        }
    }
}

