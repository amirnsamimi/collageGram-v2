import {app} from "./server.ts"
import env from "../env.ts";

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(env.PORT, () => {
    console.log(`server is running on port: ${env.PORT} `);
});

