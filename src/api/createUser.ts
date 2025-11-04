import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NewUser, users } from "../db/schema.js";
import type { Request, Response} from "express";
import { BadRequestError } from "./errorClasses.js";

type UserReq = {
  email: string;
}

export async function hanlderUsersCreate(req: Request, res: Response) {
  const parsedBody:UserReq = req.body;
  if (!parsedBody.email) {
    throw new BadRequestError("Missing required fields");
  }
  const newUser:NewUser = {email: parsedBody.email};
  
  const result = await createUser(newUser);
  if (!result) {
    throw new Error("Could not create user");
  }
  respondWithJSON(res, 201, result);
}