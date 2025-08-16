import type {Request, Response} from "express";
import {type selectUser, users} from "../db/schema.ts";
import db from "../db/connection.ts";
import {eq} from "drizzle-orm"

export const getAllUsers = async (_, res: Response) => {
    try {
        const [users] = await db.query.users.findMany({})
        return res.status(200).json(users)
    } catch (err) {
        console.log("Get User by Username", err)
        res.status(500).json({error: 'failed to get users'})
    }
}


export const getUsersByUserName = async (req: Request<any, any, selectUser>, res: Response) => {
    try {
        const user = await db.query.users.findFirst({
                where: eq(users.username, req.params.username)
            }
        )
        return res.status(200).json(user)
    } catch
        (err) {
        console.log("Get User by Username", err)
        res.status(500).json({error: 'failed to get users'})
    }

}