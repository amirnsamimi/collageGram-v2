import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import {hashPassword} from "../utils/passwords.js";
import {db} from "../db/connection.js"
import {users} from "../db/schema.js";

export const register = async (req: Request, res: Response) => {
    try {
        const {email, username, password, firstName, lastName} = req.body
        const hashedPassword = await hashPassword(password)
        const [user] =
    } catch (err) {
        console.log('Registration error', err)
        res.status(500).json({error: 'failed to create user'})
    }
}