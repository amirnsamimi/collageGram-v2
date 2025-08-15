import type {Request, Response} from 'express';
import {comparePassword, hashPassword} from "../utils/passwords.ts";
import {db} from "../db/connection.ts"
import {type selectUser, users} from "../db/schema.ts";
import type {insertUser} from "../db/schema.ts";
import {generateJwtToken} from "../utils/jwt.ts";
import {eq} from "drizzle-orm";

export const register = async (req: Request<any, any, insertUser>, res: Response) => {
    try {

        const hashedPassword = await hashPassword(req.body.password);

        const [user] = await db.insert(users).values({
            ...req.body,
            password: hashedPassword
        }).returning({
            id: users.id,
            email: users.email,
            username: users.username,
            createdAt: users.createdAt
        })


        //signing in
        const token = await generateJwtToken({id: user.id, email: user.email, username: user.username})
        return res.status(201).json({
            message: 'User created successfully.',
            user,
            token
        })

    } catch (err) {
        console.log('Registration error', err)
        res.status(500).json({error: 'failed to create user'})
    }
}


export const login = async (req: Request<any, any, selectUser>, res: Response) => {

    try {
        const [user] = await db.query.users.findMany({
            where: eq(users.username, req.body.username),
        })

        if (!user) {
            return res.status(401).json({error: 'invalid credentials'})
        }

        const isValidatedPassword = await comparePassword(req.body.password, user.password)

        if (!isValidatedPassword) {
            return res.status(401).json({error: 'invalid credentials'})
        }

        const token = await generateJwtToken({id: user.id, email: user.email, username: user.username})
        return res.status(200).json(
            {
                message: 'User logged in successfully.',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                },
                token
            }
        )
    } catch (err) {
        console.log('Login error', err)
        res.status(500).json({error: 'failed to login'})
    }

}