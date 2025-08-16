import {authRepo} from "../repository/authRepo.js";
import type {insertUserSession} from "../db/schema.js";
import type {Request} from "express";

export class authService {
    private repo: authRepo

    constructor() {
        this.repo = new authRepo()
    }

    private getUserDeviceInfo(req: Request) {
        return req.headers["user-agent"] || "unknown"
    }

    private getUserIp(req: Request) {
        return (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown"
    }


    static async generateSession(payload: insertUserSession) {

        try {
            await authRepo.insertOneUserSession({
                ...payload
            })

        } catch (err) {
            console.log('Session Generating Error', err)
            throw new Error('Session Generating Error')
        }


    }

}