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
  const cleanedBody = cleanMessages(parsedBody.body)
  respondWithJSON(res, 200, {cleanedBody: cleanedBody});
}

function cleanMessages(message: String): String {
  const improperWords = ["kerfuffle", "sharbert", "fornax"];
  let cleanedMessage = message;
  const inputArray = message.split(" ");
  for (const word of inputArray){
    if (improperWords.includes(word.toLowerCase())) {
      const split = cleanedMessage.split(word);
      cleanedMessage = split.join("****");
    }
  }
  return cleanedMessage
}