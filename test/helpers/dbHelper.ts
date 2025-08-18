import {db} from "../../src/db/connection.ts"
import {users, type insertUser} from "../../src/db/schema.ts";
import {generateJwtToken} from "../../src/utils/tokens.ts";
import {hashPassword} from "../../src/utils/passwords.ts";

export const createTestUser = async (userData: Partial<insertUser> = {}) => {
    const defaultData = {
        email: `test${Date.now()}-${Math.random()}@example.com`,
        username: `testuser${Date.now()}${Math.random()}`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        ...userData
    }

    const hashedPassword = await hashPassword(defaultData.password)
    const [user] = await db
        .insert(users)
        .values({
            ...defaultData,
            password: hashedPassword,
        })
        .returning()

    const token = await generateJwtToken({
        id: user.id,
        email: user.email,
        username: user.username,
    })

    return {user, token, rawPassword: defaultData.password}
}


export async function cleanupDatabase() {
    await db.delete(users)
}