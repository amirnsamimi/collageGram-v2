import express from 'express';
import helmet from "helmet";
import cors from "cors"
import healthRoutes from "./routes/health.routes.ts";
import authRoutes from "./routes/v1/auth.routes.ts";
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import userRoutes from "./routes/v1/user.routes.ts";
import {APIError, errorHandler} from "./middleware/errorHandler.ts";
import env from "../env.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet())
app.use(cors({
    origin: env.NODE_ENV,
    credentials: true
}))


/* ---- DOCS ---- */
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/* ---- ROUTES ---- */
app.use("/api/health", healthRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

/* ---- ERROR HANDLING --- */
app.use(errorHandler)

export {app}
export default app