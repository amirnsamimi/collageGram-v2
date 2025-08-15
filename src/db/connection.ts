import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'
import * as schema from './schema.ts'
import {env, isProd} from "../../env.ts"
import {remember} from "@epic-web/remember"

const createPool = () => {
    return new Pool({
        connectionString: env.DATABASE_URL,
        max: env.DATABASE_POOL_MAX,
        min: env.DATABASE_POOL_MIN,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 2000
    })
}

let client: Pool;
if (isProd()) {
    client = createPool()
} else {
    client = remember('dbPool', () => createPool())
}
export const db = drizzle({client, schema})
export default db