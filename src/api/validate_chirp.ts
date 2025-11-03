import { respondWithError, respondWithJSON } from "./json.js";
import type { Request, Response} from "express";

type Chirp = {
  body: String;
}

export async function hanlderValidate(req: Request, res: Response) {
  const parsedBody:Chirp = req.body;
  const maxChirpLength = 140;

  if (parsedBody.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }
  respondWithJSON(res, 200, {valid: true});
}