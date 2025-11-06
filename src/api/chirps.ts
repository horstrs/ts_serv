import { respondWithError, respondWithJSON } from "./json.js";
import type { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errorClasses.js"
import { NewChirp } from "../db/schema.js";
import { postChirp, getChirps, getChirpById, deleteChirps, getChirpsByAuthor } from "../db/queries/chirps.js";
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

export async function handlerGetAllChirps(req: Request, res: Response) {
  let authorId = "";
  let result = [];
  const authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
    result = await getChirpsByAuthor(authorId);
    if (!result) {
      respondWithError(res, 404, `No chirps found for author ${authorId}`)
    }
  } else {
    result = await getChirps();
    if (!result) {
      respondWithError(res, 500, "Couldn't retrieve chirps")
    }
  }

  respondWithJSON(res, 200, result);
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const chirpId = req.params.chirpID;
  const result = await getChirpById(chirpId);
  if (!result) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`)
  }
  respondWithJSON(res, 200, result);
}

export async function hanlderChirpsDelete(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userFromToken = validateJWT(token, config.jwt.secret);
  const chirpId = req.params.chirpID;
  if (!chirpId) {
    throw new BadRequestError("Chirp ID missing")
  }
  const chirpToBeDeleted = await getChirpById(chirpId);
  if (!chirpToBeDeleted) {
    throw new NotFoundError(`Could not find chirp with ID: ${chirpId}`)
  }
  if (chirpToBeDeleted.userId !== userFromToken) {
    throw new ForbiddenError(`Not possible to delete: ${chirpId}`)
  }
  await deleteChirps(chirpId, userFromToken);
  const result = await getChirpById(chirpId);
  if (result) {
    throw new Error(`Could note delete: ${chirpId}`)
  }
  res.status(204).send();
}