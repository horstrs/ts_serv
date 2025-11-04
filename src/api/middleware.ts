import type { Request, Response, NextFunction } from "express";
import { respondWithError } from "./json.js";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./errorClasses.js";

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  _: Request, 
  __: Response,
  next: NextFunction,
) {
  config.api.fileserverHits++;
  next();
}

export function middlewareErrorHandler(
  err: Error, _: Request, res: Response, __:NextFunction) {
    if (err instanceof BadRequestError){
      respondWithError(res, 400, err.message);
      return;
    };
    if (err instanceof UnauthorizedError){
      respondWithError(res, 401, err.message);
      return;
    };
    if (err instanceof ForbiddenError){
      respondWithError(res, 403, err.message);
      return;
    };
    if (err instanceof NotFoundError){
      respondWithError(res, 404, err.message);
      return;
    };
    
    console.error(err.message);
    respondWithError(res, 500, err.message);
    
}