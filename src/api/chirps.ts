import { respondWithJSON } from "./json.js";
import type { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errorClasses.js"
import { NewChirp } from "../db/schema.js";
import { postChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type Chirp = {
  body: string;
}

export async function handlerChirpsCreate(req: Request, res: Response) {
  const parsedBody: Chirp = req.body;
  
  const token = getBearerToken(req);
  const userFromToken = validateJWT(token, config.jwt.secret);
  const validatedChirp = validateChirp(parsedBody.body);

  const newChirp: NewChirp = {
    body: validatedChirp,
    userId: userFromToken
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

export async function handlerGetAllChirps(_: Request, res: Response) {
  const result = await getChirps();
  respondWithJSON(res, 200, result);
}

export async function handlerGetChirps(req: Request, res: Response) {
  const chirpId = req.params.chirpID;
  const result = await getChirps(chirpId);
  if (!result){
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`)
  }
  respondWithJSON(res, 200, result);
}