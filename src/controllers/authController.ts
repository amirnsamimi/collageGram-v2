import type {Request, Response} from 'express';
import {comparePassword, hashPassword} from "../utils/passwords.ts";
import {db} from "../db/connection.ts"
import {type selectUser, sessionTokens, users} from "../db/schema.ts";
import type {insertUser} from "../db/schema.ts";
import {generateJwtToken, generateRefreshToken, generateSessionSecret} from "../utils/tokens.ts";
import {eq} from "drizzle-orm";
import {stringToExpirationDate} from "../utils/datetime.ts";
import env from "../../env.ts";
import {redis} from "../db/redis.ts";
import {isTypedArray} from "node:util/types";

export const register = async (req: Request<any, any, insertUser>, res: Response) => {
    try {
        const userAgent = req.headers["user-agent"] || "unknown"
        const userIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]
            || req.socket.remoteAddress
            || "unknown";
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
        const refreshToken = generateRefreshToken()
        await redis.set(
            `refresh:${refreshToken}`,
            JSON.stringify({userId: user.id}),
            "EX", env.REFRESH_EXPIRES_IN
        );

        const sessionId = generateSessionSecret()
        await db.insert(sessionTokens).values({
            deviceInfo: userAgent,
            expiresAt: stringToExpirationDate(env.SESSION_EXPIRES_IN),
            ip: userIp,
            loginTime: new Date(),
            refreshTokenHash: refreshToken,
            sessionId: sessionId,
            userId: user.id
        })
        const token = await generateJwtToken({id: user.id, email: user.email, username: user.username})
        return res.status(201).json({
            message: 'User created successfully.',
            user,
            accessToken: token,
            refreshToken: refreshToken,
        })

    } catch (err) {
        console.log('Registration error', err)
        res.status(500).json({error: 'failed to create user'})
    }
}


export const login = async (req: Request<any, any, selectUser>, res: Response) => {

    try {
        const userAgent = req.headers["user-agent"] || "unknown"
        const userIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]
            || req.socket.remoteAddress
            || "unknown";

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

        const refreshToken = generateRefreshToken()
        await redis.set(
            `refresh:${refreshToken}`,
            JSON.stringify({userId: user.id}),
            "EX", env.REFRESH_EXPIRES_IN
        );

        const sessionId = generateSessionSecret()
        await db.insert(sessionTokens).values({
            deviceInfo: userAgent,
            expiresAt: stringToExpirationDate(env.SESSION_EXPIRES_IN),
            ip: userIp,
            loginTime: new Date(),
            refreshTokenHash: refreshToken,
            sessionId: sessionId,
            userId: user.id
        })


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
                accessToken: token,
                refreshToken: refreshToken,
            }
        )
    } catch (err) {
        console.log('Login error', err)
        res.status(500).json({error: 'failed to login'})
    }

}

export const refreshToken = async (req: Request, res: Response) => {
    //
    // try {
    //     const refreshToken = req.body.refreshToken;
    //     if (!refreshToken) {
    //         return res.status(401).json({error: 'Refresh token is required'});
    //     }
    //
    //     const userData = await redis.get(`refresh:${refreshToken}`);
    //     if (!userData) {
    //         return res.status(401).json({error: 'Invalid refresh token'});
    //     }
    //
    //     const {userId} = JSON.parse(userData);
    //     const user = await db.query.users.findFirst({
    //         where: eq(users.id, userId),
    //     });
    //
    //     if (!user) {
    //         return res.status(401).json({error: 'User not found'});
    //     }
    //
    //     const userAgent = req.headers["user-agent"] || "unknown";
    //     const userIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]
    //         || req.socket.remoteAddress
    //         || "unknown";
    //
    //     const newRefreshToken = generateRefreshToken();
    //     await redis.set(
    //         `refresh:${newRefreshToken}`,
    //         JSON.stringify({userId: user.id}),
    //         "EX", env.REFRESH_EXPIRES_IN
    //     );
    //
    //     const sessionId = generateSessionSecret();
    //     await db.insert(sessionTokens).values({
    //         deviceInfo: userAgent,
    //         expiresAt: stringToExpirationDate(env.SESSION_EXPIRES_IN),
    //         ip: userIp,
    //         loginTime: new Date(),
    //         refreshTokenHash: newRefreshToken,
    //         sessionId: sessionId,
    //         userId: user.id
    //     });
    //
    //     await redis.del(`refresh:${refreshToken}`);
    //
    //     const accessToken = await generateJwtToken({
    //         id: user.id,
    //         email: user.email,
    //         username: user.username
    //     });
    //
    //     return res.status(200).json({
    //         message: 'Tokens refreshed successfully',
    //         accessToken,
    //         refreshToken: newRefreshToken
    //     });
    // } catch (err) {
    //     console.log('Refresh token error', err)
    //     res.status(500).json({error: 'failed to create refresh token'})
    // }

    res.status(200).json({message: 'tokens refreshed'})

}

export const logout = async (req: Request<any, any, selectUser>, res: Response) => {
    // try {
    //
    //
    //
    // } catch (err) {
    //     console.log('Logout error', err)
    //     res.status(500).json({error: 'failed to logout'})
    // }
    res.status(200).json({message: 'logged out'})
}




