import express from "express";

import { handlerMetrics, handlerReadiness, handlerRerouteHome, handlerReset } from "./api/handlers.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";


const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.get("/admin/reset", handlerReset);
app.get("/", handlerRerouteHome);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});