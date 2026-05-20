import express from "express";
import {
  authenticateUser,
  createUserAccount,
  invalidateToken,
  sanitizeUser,
} from "../services/authService";
import type { RequestWithUser } from "../middleware/authMiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { user, token } = await createUserAccount(email, displayName ?? email, password);
    res.status(201).json({ user: sanitizeUser(user), token: token.token });
  } catch (error) {
    console.error("[routes/auth] Register failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const { user, token } = await authenticateUser(email, password);
    res.json({ user: sanitizeUser(user), token: token.token });
  } catch (error) {
    console.error("[routes/auth] Login failed:", error);
    res.status(401).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/logout", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const authHeader = req.header("authorization") || req.header("Authorization");
    const token = authHeader?.slice("Bearer ".length).trim();
    if (token) {
      await invalidateToken(token);
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("[routes/auth] Logout failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
