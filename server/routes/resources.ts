import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import {
  getOrCreateResourceAccount,
  getResourceAccount,
  listResourceAccountsForCampaign,
  createResourceTransaction,
  listTransactionsForUser,
  listTransactionsForCampaign,
} from "../services/resourceService";

const router = express.Router();

router.post("/campaigns/:campaignId/accounts", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const { userId, initialBalances } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const account = await getOrCreateResourceAccount(campaignId, userId, initialBalances);
    res.status(201).json(account);
  } catch (error) {
    console.error("[routes/resources] create account failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const account = await getResourceAccount(req.params.id);
    if (!account) return res.status(404).json({ error: "Not found" });
    res.json(account);
  } catch (error) {
    console.error("[routes/resources] get account failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/campaigns/:campaignId/accounts", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const accounts = await listResourceAccountsForCampaign(campaignId);
    res.json(accounts);
  } catch (error) {
    console.error("[routes/resources] list accounts failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/campaigns/:campaignId/transactions", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const { userId, type, amount, reason } = req.body;
    if (!userId || !type || amount === undefined || !reason) {
      return res.status(400).json({ error: "userId, type, amount, reason required" });
    }

    const transaction = await createResourceTransaction(campaignId, userId, type, amount, reason);
    res.status(201).json(transaction);
  } catch (error) {
    console.error("[routes/resources] create transaction failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/campaigns/:campaignId/transactions", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const transactions = await listTransactionsForCampaign(campaignId);
    res.json(transactions);
  } catch (error) {
    console.error("[routes/resources] list transactions failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/campaigns/:campaignId/users/:userId/transactions", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const userId = req.params.userId;
    const transactions = await listTransactionsForUser(campaignId, userId);
    res.json(transactions);
  } catch (error) {
    console.error("[routes/resources] list user transactions failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
