import { config } from "../config.js";
import { resetUsers } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import type { Request, Response } from "express";
import { ForbiddenError } from "../api/errorClasses.js";

export async function handlerReadiness(_: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}

export function handlerMetrics(_: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
      </body>
    </html>`
  );
}

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev"){
    console.log(config.api.platform)
      throw new ForbiddenError("Incorrect platform");
  }

  config.api.fileserverHits = 0;
  await resetUsers();
  respondWithJSON(res, 200, "Hits reset to 0")
  //res.write("Hits reset to 0");
}

export function handlerRerouteHome(_: Request, res: Response){
  res.redirect("/app/");
}