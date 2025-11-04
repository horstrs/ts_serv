import { respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NewUser, users } from "../db/schema.js";
import type { Request, Response} from "express";

type UserReq = {
  email: string;
}

export async function hanlderCreateUser(req: Request, res: Response) {
  const parsedBody:UserReq = req.body;
  const newUser:NewUser = {email: parsedBody.email};
  try {
    const result = await createUser(newUser);
    respondWithJSON(res, 201, result);
  } catch (e) {
    throw new Error("Internal error");
  };
}