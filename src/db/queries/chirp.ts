import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function postChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}
