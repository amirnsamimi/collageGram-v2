import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {hashPassword} from "../utils/passwords.js";
import {db} from "../db/connection.js"
import {users} from "../db/schema.js";
import type {insertUser} from "../db/schema.js";
import {generateJwtToken} from "../utils/jwt.js";

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
        const token = generateJwtToken({id: user.id, email: user.email, username: user.username})
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