import {db} from "./connection.ts"
import {users} from "./schema.ts";
import {hashPassword} from "../utils/passwords.ts";

async function seed(): Promise<void> {
    console.log('🌱 Starting database seed...')
    try {
        console.log('Clearing existing data...')
        await db.delete(users)

        const hashedPassword = await hashPassword('amir1995@!')
        await db
            .insert(users)
            .values({
                email: 'amrinsamimi@gmail.com',
                username: 'amirns',
                password: hashedPassword
            })
            .returning()

        console.log('✅ Database seeded successfully!')
        console.log('\n📊 Seed Summary:')
        console.log('- 1 demo users created')
    } catch (err) {
        console.error('❌ Seed failed:', err)
        throw err
    }
}

// RUN DIRECTLY
if (import.meta.url === `file://${process.argv[1]}`) {
    seed()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error)
            process.exit(1)
        })
}