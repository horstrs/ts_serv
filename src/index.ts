import express from "express";

import { handlerMetrics, handlerReadiness, handlerRerouteHome, handlerReset } from "./api/handlers.js";
import { hanlderValidate } from "./api/validate_chirp.js"
import { errorHandler } from "./api/errorHandler.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req,res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
   Promise.resolve(handlerMetrics(req,res)).catch(next);
  });

app.get("/", (req, res, next) => {
  Promise.resolve(handlerRerouteHome(req,res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req,res)).catch(next);
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(hanlderValidate(req,res)).catch(next);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});