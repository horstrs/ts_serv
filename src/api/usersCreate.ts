import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NewUser, users } from "../db/schema.js";
import type { Request, Response} from "express";
import { BadRequestError } from "./errorClasses.js";
import { hashPassword } from "../auth.js"

type UserReq = {
  password: string;
  email: string;
}

type UserPreview = Omit<NewUser, "hashedPassword">;

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
  } satisfies UserPreview);

}
