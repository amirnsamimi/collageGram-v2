import {defineConfig} from "vitest/config"

export default defineConfig({
    test: {
        globals: true,
        globalSetup: ['./tests/setup/globalSetup.ts'],

        clearMocks: true,
        restoreMocks: true,

        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true
            }
        }
    },
    plugins:[]
})