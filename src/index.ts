import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.get("/", (req, res) => {
    res.set({
            "Content-type": "text/plain",
            "charset": "utf-8"
        });
    res.redirect(302, "/app/");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});