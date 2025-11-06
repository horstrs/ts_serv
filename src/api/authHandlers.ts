import { respondWithError, respondWithJSON } from "./json.js";
import { getUserByEmail } from "../db/queries/users.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { UserPreview } from "./usersCreate.js";
import { BadRequestError, UnauthorizedError } from "./errorClasses.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js"
import { config } from "../config.js";
import { NewRefreshToken } from "../db/schema.js";
import type { Request, Response } from "express";

type UserReq = {
  password: string;
  email: string;
}

type LoginResponse = UserPreview & {
  token: string;
  refreshToken: string;
};

const MAX_TIME_IN_SECONDS = 3600;

export async function hanlderUsersLogin(req: Request, res: Response) {
  const parsedBody: UserReq = req.body;
  if (!parsedBody.email || !parsedBody.password) {
    throw new BadRequestError("Missing required fields");
  }

  const user = await getUserByEmail(parsedBody.email);
  if (!user) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  if (!await checkPasswordHash(parsedBody.password, user.hashed_password)) {
    respondWithError(res, 401, "Incorrect email or password");
    return;
  }

  const jwt = makeJWT(user.id, MAX_TIME_IN_SECONDS, config.jwt.secret);
  const refreshToken = makeRefreshToken();

  const newRefreshTokenEntry: NewRefreshToken = {
    token: refreshToken,
    userId: user.id
  }

  const createdRefreshToken = await createRefreshToken(newRefreshTokenEntry);
  if (!createdRefreshToken) {
    respondWithError(res, 500, "Unable to create refresh token");
  }
  
  const result = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: jwt,
    refreshToken: refreshToken,
    isChirpyRed: user.isChirpyRed
  } satisfies LoginResponse;

  respondWithJSON(res, 200, result);
}

export async function hanlderRefreshAccess(req: Request, res: Response) {
  try{
    const refreshToken = getBearerToken(req);
  
    const dbToken = await getRefreshToken(refreshToken);
    if (new Date() > dbToken.expiresAt) {
      throw new UnauthorizedError("");
    }
    if (dbToken.revokedAt && new Date() > dbToken.revokedAt) {
      throw new UnauthorizedError("");
    }
    const jwt = makeJWT(dbToken.userId, MAX_TIME_IN_SECONDS, config.jwt.secret);
    respondWithJSON(res, 200, {token: jwt});
  } catch (err){
    throw new UnauthorizedError("User not authorized")
  }
}

export async function hanlderRevokeAccess(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  try {  
    await revokeRefreshToken(refreshToken)
    respondWithJSON(res, 204, "");
  } catch (err) {
    throw new UnauthorizedError("Unable to revoke token");
  }
}