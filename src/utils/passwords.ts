import bcrypt from "bcrypt";
import env from '../../env.ts'

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword)
}