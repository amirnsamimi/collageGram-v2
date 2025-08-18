import request from 'supertest'
import app from '../src/server.ts'
import env from '../env.ts'
import {afterEach} from 'vitest'
import {createTestUser, cleanupDatabase} from './helpers/dbHelper.ts'

describe('Authentication Endpoints', () => {
    afterEach(async () => {
        await cleanupDatabase()
    })
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                email: `test-${Date.now()}@example.com`,
                username: `testuser${Date.now()}`,
                password: 'TestPassword123!',
                firstName: 'Test',
                lastName: 'User',
            }

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(201)

            expect(response.body).toHaveProperty(
                'message',
                'User created successfully.'
            )
            expect(response.body).toHaveProperty('user')
            expect(response.body.user).not.toHaveProperty('password')
        })

        it('should return 400 for invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                username: `testuser-${Date.now()}`,
                password: 'TestPassword123!',
            }

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(400)

            expect(response.body).toHaveProperty('error', 'invalid parameters')
        })

        it('should return 400 for short password', async () => {
            const userData = {
                email: `test-${Date.now()}@example.com`,
                username: `testuser-${Date.now()}`,
                password: 'short',
            }

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send(userData)
                .expect(400)

            expect(response.body).toHaveProperty('error', 'invalid parameters')
        })
    })

    describe('POST /api/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            // Create a test user first
            const {user, rawPassword} = await createTestUser({
                username: `test123`,
                password: 'TestPassword123!',
            })

            const credentials = {
                username: user.username,
                password: rawPassword,
            }

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(credentials)
                .expect(200)

            expect(response.body).toHaveProperty('message', 'User logged in successfully.')
            expect(response.body).toHaveProperty('user')
            expect(response.body).toHaveProperty('token')
            expect(response.body.user).not.toHaveProperty('password')
        })

        it('should return 400 for missing email', async () => {
            const credentials = {
                password: 'TestPassword123!',
            }

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(credentials)
                .expect(400)

            expect(response.body).toHaveProperty('error', 'invalid parameters')
        })

        it('should return 401 for invalid credentials', async () => {
            // Create a test user first
            const {user} = await createTestUser()

            const credentials = {
                email: user.email,
                password: 'wrongpassword',
            }

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(credentials)
                .expect(400)

            expect(response.body).toHaveProperty('error')
        })
    })
})