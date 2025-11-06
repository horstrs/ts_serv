import { respondWithJSON } from "./json.js";
import { createUser, getUserByEmail, getUserById, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import type { Request, Response} from "express";
import { BadRequestError, UnauthorizedError } from "./errorClasses.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js"
import { config } from "../config.js";


type UserReq = {
  password: string;
  email: string;
}

export type UserPreview = Omit<NewUser, "hashedPassword">;

export async function hanlderUsersCreate(req: Request, res: Response) {
  const parsedBody:UserReq = req.body;
  if (!parsedBody.email || !parsedBody.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(parsedBody.password);
  const newUser:NewUser = {email: parsedBody.email, hashed_password: hashedPassword};
  
  const user = await createUser(newUser);
  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, { 
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserPreview);

}

export async function hanlderUsersUpdate(req: Request, res: Response) {
    const headerToken = getBearerToken(req);
    const userId = validateJWT(headerToken, config.jwt.secret);
    
    const parsedBody:UserReq = req.body;
    if (!parsedBody.email || !parsedBody.password) {
      throw new BadRequestError("Missing required fields");
    }
    
    const hashedPassword = await hashPassword(parsedBody.password);
    await updateUser(userId, parsedBody.email, hashedPassword);
  
  const updatedUser = await getUserByEmail(parsedBody.email)
  if (!updatedUser) {
    throw new Error("Could not update user");
  }

  respondWithJSON(res, 200, { 
    id: updatedUser.id,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    isChirpyRed: updatedUser.isChirpyRed,
  } satisfies UserPreview);
}
