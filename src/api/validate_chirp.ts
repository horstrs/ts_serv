import { respondWithJSON } from "./json.js";
import type { Request, Response} from "express";
import { BadRequestError } from "./errorClasses.js"

type Chirp = {
  body: String;
}

export async function hanlderValidate(req: Request, res: Response) {
  const parsedBody:Chirp = req.body;
  const maxChirpLength = 140;

  if (parsedBody.body.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
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