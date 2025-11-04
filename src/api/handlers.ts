import { config } from "../config.js";
import { resetUsers } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import type { Request, Response } from "express";

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
        <p>Chirpy has been visited ${config.fileserverHits} times!</p>
      </body>
    </html>`
  );
}

export async function handlerReset(_: Request, res: Response) {
  const result = await resetUsers();
  respondWithJSON(res, 200, result)

  /*config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Server hits reset to ${config.fileserverHits}`);*/
}

export function handlerRerouteHome(_: Request, res: Response){
  res.redirect("/app/");
}