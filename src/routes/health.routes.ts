import {Router} from 'express'


const router = Router()

router.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date(),
        service: "collagegram-v2"
    })
})

router.get('/detailed', async (req, res) => {
    try {
        // Check database connection
        // await db.raw('SELECT 1')

        // Check external services
        // const redisStatus = await redis.ping()

        // res.status(200).json({
        //     status: 'OK',
        //     timestamp: new Date().toISOString(),
        //     services: {
        //         database: 'connected',
        //         redis: redisStatus === 'PONG' ? 'connected' : 'disconnected',
        //     },
        //     version: process.env.APP_VERSION,
        //     uptime: process.uptime(),
        // })
    } catch (error) {
        // res.status(503).json({
        //     status: 'ERROR',
        //     message: 'Service unhealthy',
        //     error: error.message,
        // })
    }
})


export default router