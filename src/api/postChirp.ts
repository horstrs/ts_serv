import { respondWithJSON } from "./json.js";
import type { Request, Response } from "express";
import { BadRequestError } from "./errorClasses.js"
import { NewChirp } from "../db/schema.js";
import { postChirp } from "../db/queries/chirp.js";

type Chirp = {
  body: string;
  userId: string;
}

export async function handlerPostChirp(req: Request, res: Response) {
  const parsedBody: Chirp = req.body;
  const validatedChirp = validateChirp(parsedBody.body);

  const newChirp: NewChirp = {
    body: validatedChirp,
    userId: parsedBody.userId
  }

  const result = await postChirp(newChirp);
  if (!result) {
    throw new Error("Could not post chirp");
  }
  respondWithJSON(res, 201, result);
}

function validateChirp(chirp: string): string {
  if (chirp.length === 0) {
    throw new BadRequestError("Chirp can't be blank");
  }

  const maxChirpLength = 140;
  if (chirp.length > maxChirpLength) {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
  return cleanMessages(chirp);
}

function cleanMessages(message: string): string {
  const improperWords = ["kerfuffle", "sharbert", "fornax"];
  let cleanedMessage = message;
  const inputArray = message.split(" ");
  for (const word of inputArray) {
    if (improperWords.includes(word.toLowerCase())) {
      const split = cleanedMessage.split(word);
      cleanedMessage = split.join("****");
    }
  }
  return cleanedMessage
}