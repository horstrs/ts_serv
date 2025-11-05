import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [newRefreshToken] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return newRefreshToken;
}

export async function getRefreshToken(token:string) {
  const [refreshToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
    return refreshToken;
}

export async function revokeRefreshToken(tokenToRevoke: string) {
  const [revokedToken] = await db
    .update(refreshTokens)
    .set( {revokedAt: sql`NOW()` })
    .where(eq(refreshTokens.token, tokenToRevoke))

  return revokedToken;
}