import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq } from "drizzle-orm";

export async function postChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getChirps(chirpId?:string) {
  if(!chirpId){
  return await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt);
  } else {
    const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId))
    return result;
  };
}