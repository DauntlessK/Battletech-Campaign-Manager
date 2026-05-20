import type { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../services/authService";
import type { UserAccount } from "../types/models";

export interface RequestWithUser extends Request {
  user?: UserAccount;
}

export async function requireAuth(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization") || req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid." });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const user = await getUserByToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }

  req.user = user;
  next();
}
