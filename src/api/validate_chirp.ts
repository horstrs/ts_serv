import { respondWithError, respondWithJSON } from "./json.js";
import type { Request, Response} from "express";

type Chirp = {
  body: String;
}

export async function hanlderValidate(req: Request, res: Response) {
  let body = "";
  
  req.on("data", (chunk) => {
    body += chunk;
  });
  let parsedBody:Chirp
  req.on("end", () => {
    try {
      parsedBody = JSON.parse(body);
    } catch(error){
      respondWithError(res, 500, "Something went wrong");
      return;
    }
    if (parsedBody.body.length > 140) {
      respondWithError(res, 400, "Chirp is too long");
      return;
    }
    respondWithJSON(res, 200, {valid: true})
  });
}