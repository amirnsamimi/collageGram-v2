import {authRepo} from "../repository/authRepo.ts";

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


}