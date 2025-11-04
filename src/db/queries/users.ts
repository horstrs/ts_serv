import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { config } from "../../config.js";
import { ForbiddenError } from "../../api/errorClasses.js";


export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function resetUsers() {
  if (config.platform !== "dev"){
    throw new ForbiddenError("Incorrect platform");
  }
  const [result] = await db.delete(users);
    
  return result;
}