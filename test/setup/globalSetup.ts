import {db} from "../../src/db/connection.ts"
import {users} from "../../src/db/schema.js"
import {sql} from "drizzle-orm"
import {execSync} from 'node:child_process' //running bash commands

export default async function setup() {
    console.log('Setting up database...')
    try {
        await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
        console.log('Pushing schema using drizzle-kit ...')
        execSync(`npx drizzle-kit push --url=${process.env.DATABASE_URL} --schema="./src/db/schema.ts" --dialect="postgresql"`, {
            stdio: "inherit",
            cwd: process.cwd()
        })
        console.log(' Test DB Created.')
    } catch (err) {
        console.error('Faild Setting up test db.', err)
        throw err
    }

    return async () => {
        try {
            await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
            process.exit(0)
        } catch (err) {
            console.error("Fail to setup test db", err)
            throw err
        }
    }
}