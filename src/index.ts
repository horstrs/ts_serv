import express from "express";

import { handlerMetrics, handlerReadiness, handlerRerouteHome, handlerReset } from "./api/handlers.js";
import { middlewareLogResponse, middlewareMetricsInc, middlewareErrorHandler } from "./api/middleware.js";
import { handlerChirpsCreate, handlerGetAllChirps, handlerGetChirps } from "./api/chirps.js";
import { hanlderUsersCreate, hanlderUsersUpdate } from "./api/usersCreate.js"
import { hanlderUsersLogin, hanlderRefreshAccess, hanlderRevokeAccess } from "./api/authHandlers.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});

app.get("/api/chirps/:chirpID", (req, res, next) => {
  Promise.resolve(handlerGetChirps(req, res)).catch(next);
});

app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});

app.get("/", (req, res, next) => {
  Promise.resolve(handlerRerouteHome(req, res)).catch(next);
});

app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsCreate(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(hanlderUsersCreate(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
  Promise.resolve(hanlderUsersLogin(req, res)).catch(next);
});

app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(hanlderRefreshAccess(req, res)).catch(next);
});

app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(hanlderRevokeAccess(req, res)).catch(next);
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(hanlderUsersUpdate(req, res)).catch(next);
});

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});