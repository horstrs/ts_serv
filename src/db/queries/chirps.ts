import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { and, eq } from "drizzle-orm";

export async function postChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getChirps() {
  return await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt);
}

export async function getChirpById(chirpId: string) {
  const [result] = await db
  .select()
  .from(chirps)
  .where(eq(chirps.id, chirpId))
  return result;
}

export async function deleteChirps(chirpId: string, userId: string) {
  await db
  .delete(chirps)
  .where(and(eq(chirps.id, chirpId), eq(chirps.userId, userId)))
  .returning();
}