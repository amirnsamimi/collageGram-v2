import db from "../db/connection.js";
import type {Request} from "express";
import {type insertUserSession, userSession} from "../db/schema.js";

export class authRepo {


    static async insertOneUserSession(payload: insertUserSession) {
        await db.insert(userSession).values({
            ...payload
        })
    }

}