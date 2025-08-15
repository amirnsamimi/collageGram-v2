import {type JWTPayload, SignJWT} from "jose";
import {createHash, createSecretKey, randomBytes} from "node:crypto";
import env from "../../env.ts"

export interface JwtPayload extends JWTPayload {
    id: string;
    email: string;
    username: string;
}

export const generateJwtToken = async (payload: JwtPayload): Promise<string> => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set')
    }

    const secretKey = createSecretKey(secret, "utf-8")
    return await new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
        .sign(secretKey)
}

// hash functions
export const hashSha256Token = (token: string) => {
    return createHash("sha256").update(token).digest("hex");
}

export const createBase64urlToken = () => {
    return randomBytes(32).toString('base64url')
}

// Refresh Token
export const generateRefreshToken = (): string => {
    return hashSha256Token(createBase64urlToken())
}

// Session
export const generateSessionSecret = (): string => {
    return hashSha256Token(createBase64urlToken())
}