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

type NewUserPreview = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
}

export async function hanlderUsersCreate(req: Request, res: Response) {
  const parsedBody:UserReq = req.body;
  if (!parsedBody.email || !parsedBody.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(parsedBody.password);
  const newUser:NewUser = {email: parsedBody.email, hashed_password: hashedPassword};
  
  const result = await createUser(newUser);
  if (!result) {
    throw new Error("Could not create user");
  }
  const userPreview:NewUserPreview = { 
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    email: result.email,
  }
  respondWithJSON(res, 201, userPreview);
}
