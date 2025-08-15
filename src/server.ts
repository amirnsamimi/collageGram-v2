import express from 'express';
import helmet from "helmet";
import cors from "cors"
import healthRoutes from "./routes/health.routes.ts";
import authRoutes from "./routes/v1/auth.routes.ts";
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet())
app.use(cors())

/* ---- DOCS ---- */
const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

/* ---- ROUTES ---- */
app.use("/health", healthRoutes)
app.use("/api/auth", authRoutes)

export {app}
export default app