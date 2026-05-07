import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import unitsRouter from "./routes/units";

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

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});