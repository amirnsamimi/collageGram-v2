import {z} from "zod";

export const expirationSchema = z.string().regex(/^(\d+([hd])?)$/);
export type Expiration = z.infer<typeof expirationSchema>;

export const stringToExpirationDate = (ahead: Expiration) => {
    const today = new Date();
    let resultDate: Date;

    if (ahead.endsWith('h')) {
        const time = parseInt(ahead.slice(0, -1));
        resultDate = new Date(today.getTime() + time * 60 * 60 * 1000);
    } else if (ahead.endsWith('d')) {
        const time = parseInt(ahead.slice(0, -1));
        resultDate = new Date(today.getTime() + time * 24 * 60 * 60 * 1000);
    } else {
        const time = parseInt(ahead);
        resultDate = new Date(today.getTime() + time * 1000);
    }

    return resultDate;
};