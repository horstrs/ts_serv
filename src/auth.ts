import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./api/errorClasses";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return (await argon2.verify(hash, password)) ? true : false;
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string){
  
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const payload:Payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: currentTimeInSeconds,
    exp: currentTimeInSeconds + expiresIn
  }
  return jwt.sign(payload, secret, { algorithm: "HS256" } );
}

export function validateJWT(tokenString: string, secret: string){
  let decoded: Payload
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload; 
  } catch (err) {
    throw new UnauthorizedError("Invalid Token");
  }

  if (decoded.iss !== TOKEN_ISSUER){
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}