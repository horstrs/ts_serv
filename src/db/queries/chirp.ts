import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function postChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getAllChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt);
  return result;
}