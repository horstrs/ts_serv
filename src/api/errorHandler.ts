import { Request, Response, NextFunction } from "express";
import { respondWithError } from "./json.js";

export function errorHandler(
  err: Error, _: Request, res: Response, __:NextFunction) {
  console.error(err.message);
  const statusCode = 500;
  const message = "Something went wrong on our end";
  respondWithError(res, statusCode, message);
}