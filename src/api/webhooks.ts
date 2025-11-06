import type { Request, Response } from "express";

import { respondWithError } from "./json.js";
import { updateUserRedStatus } from "../db/queries/users.js";


type PolkaRequest = {
  data: {
    userId: string,
  },
  event: string,
  }

export async function hanlderPolkaWebhooks(req: Request, res: Response){
  const polkaRequest:PolkaRequest = req.body;
  if (polkaRequest.event !== "user.upgraded"){
    res.status(204).send();
    return;
  }
  const result = await updateUserRedStatus(polkaRequest.data.userId, true);
  if(result && result.isChirpyRed){
    res.status(204).send();
    return;
  }
  respondWithError(res, 404, "Couldn't find the user");
}