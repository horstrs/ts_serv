import { respondWithError, respondWithJSON } from "./json.js";
import { getUser } from "../db/queries/users.js";
import { UserPreview } from "./usersCreate.js";
import type { Request, Response } from "express";
import { BadRequestError } from "./errorClasses.js";
import { checkPasswordHash, makeJWT } from "../auth.js"
import { config } from "../config.js";

type UserReq = {
  password: string;
  email: string;
  expiresInSeconds?: number;
}

type LoginResponse = UserPreview & {
  token: string;
};

const MAX_TIME_IN_SECONDS = 3600;

export async function hanlderUsersLogin(req: Request, res: Response) {
  const parsedBody: UserReq = req.body;
  if (!parsedBody.email || !parsedBody.password) {
    throw new BadRequestError("Missing required fields");
  }
  
  const user = await getUser(parsedBody.email);
  if (!user) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  if (!await checkPasswordHash(parsedBody.password, user.hashed_password)) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  let expiresIn = MAX_TIME_IN_SECONDS;
  if (parsedBody.expiresInSeconds){
    expiresIn = Math.min(MAX_TIME_IN_SECONDS, parsedBody.expiresInSeconds)
  }
  
  const token = makeJWT(user.id, expiresIn, config.jwt.secret);

  const result = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token
  } satisfies LoginResponse;

  respondWithJSON(res, 200, result);
}