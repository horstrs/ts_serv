import { describe, it, expect, beforeAll, assert } from "vitest";
import { hashPassword, checkPasswordHash, makeJWT, validateJWT } from "../src/auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for different hashes", async () => {
    const result = await checkPasswordHash(password1, hash2);
    expect(result).toBe(false);
  });
});

describe("JWT signing", () => {
  it("should return user id for valid JWT", () => {
    const secretTest = "secretTest"
    const userId = "user1"
    try {
      const jwt = makeJWT(userId, 50, secretTest);
      const result = validateJWT(jwt, secretTest);
      expect(result).toBe(userId)
    } catch (err) {
      assert.fail("JWT should be created and valid")
    }
  });

  it("should throw error for expired JWT", async () => {
    const secretTest = "secretTest"
    const userId = "user1"
    const jwt = makeJWT(userId, 1, secretTest);
    await sleep(1001);
    try {
      validateJWT(jwt, secretTest);
      assert.fail();
    } catch (err){
      assert.ok(err);
    }
  });

  it("should throw error for invalid JWT", () => {
    const secretTest = "secretTest"
    const userId = "user1"
    const jwt = makeJWT(userId, 1, secretTest);
    try {
      validateJWT(jwt, "incorrectSecret");
      assert.fail();
    } catch (err){
      assert.ok(err);
    }
  });

});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}