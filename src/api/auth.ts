import { respondWithError, respondWithJSON } from "./json.js";
import { getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import type { Request, Response} from "express";
import { BadRequestError } from "./errorClasses.js";
import { checkPasswordHash, hashPassword } from "../auth.js"

type UserReq = {
  password: string;
  email: string;
}

type UserPreview = Omit<NewUser, "hashedPassword">;

export async function hanlderUsersLogin(req: Request, res: Response) {
  const parsedBody:UserReq = req.body;
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

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserPreview);
}