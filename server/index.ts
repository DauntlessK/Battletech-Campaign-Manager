import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import unitsRouter from "./routes/units";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import campaignsRouter from "./routes/campaigns";
import forcesRouter from "./routes/forces";
import battlesRouter from "./routes/battles";
import objectivesRouter from "./routes/objectives";
import resourcesRouter from "./routes/resources";
import adminRouter from "./routes/admin";
import settingsRouter from "./routes/settings";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Battletech Campaign Manager API",
  });
});

app.use("/api/units", unitsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/forces", forcesRouter);
app.use("/api/battles", battlesRouter);
app.use("/api/objectives", objectivesRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/settings", settingsRouter);

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});