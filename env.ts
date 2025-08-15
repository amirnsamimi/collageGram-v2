import {env as loadEnv} from 'custom-env'
import {z} from "zod"


process.env.APP_STAGE = process.env.APP_STAGE || "dev"


const isProduction = process.env.APP_STAGE === 'production'
const isDevelopment = process.env.APP_STAGE === 'dev'
const isTest = process.env.APP_STAGE === 'test'

if (isDevelopment) {
    loadEnv(".env.dev")
} else if (isProduction) {
    loadEnv(".env")
} else if (isTest) {
    loadEnv(".env.test")
}


const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
    APP_STAGE: z.enum(['dev', 'production', 'test']).default('dev'),
    PORT: z.coerce.number().positive().default(3001),

    BCRYPT_ROUNDS: z.coerce.number().default(12),
    JWT_SECRET: z.string().default('secret'),
    JWT_EXPIRES_IN: z.string().default('24h'),

    DATABASE_URL: z.string().startsWith('postgresql://'),
    DATABASE_POOL_MIN: z.coerce.number().default(2),
    DATABASE_POOL_MAX: z.coerce.number().default(20)
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
    env = envSchema.parse(process.env)
} catch (err) {
    if (err instanceof z.ZodError) {
        console.log('Invalid environment variables')
        console.log(JSON.stringify(z.treeifyError(err), null, 2))

        err.issues.forEach(e => {
            const path = e.path.join('.')
            console.log(`${path}: ${e.message}`)
        })
        process.exit(1)
    }
    throw err
}
export const isProd = () => env.NODE_ENV === 'production'
export const isDev = () => env.NODE_ENV === 'development'
export const isTestEnv = () => env.NODE_ENV === 'test'

export {env}
export default env



