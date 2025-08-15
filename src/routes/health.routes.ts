import {Router} from 'express'
import db from "../db/connection.ts";
import {redis} from "../db/redis.ts";


const router = Router()


router.get("/", async (req, res) => {

    try {
        await db.execute('SELECT 1')
        await redis.ping()

        res.status(200).json({
            status: "ok",
            message: "Server is running",
            timestamp: new Date(),
            service: "collagegram-v2"
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({
            status: "error",
            message: "Service unhealthy",
            timestamp: new Date(),
            service: 'collagegram-v2'
        })
    }
})


export default router