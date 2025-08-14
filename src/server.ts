import express from 'express';
import helmet from "helmet";
import cors from "cors"
import healthRoutes from "./routes/health.routes.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet())
app.use(cors())

/* ---- ROUTES ---- */
app.use("/health", healthRoutes)


export {app}
export default app