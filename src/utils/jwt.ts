import {SignJWT} from "jose";
import {createSecretKey} from "node:crypto";
import env from "../../env.js"

export interface JwtPayload {
    id: string;
    email: string;
    username: string;
}


export const generateJwtToken = (payload: JwtPayload) => {
    const secret = env.JWT_SECRET
    const secretKey = createSecretKey(secret, "utf-8")

    return new SignJWT()
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN)
        .sign(secretKey)
}