import express from "express";
import cors from "cors";
import path from "path";
import uploadRoutes from "./src/routes/uploadRoutes";
import { ensureDir } from "./src/utils/fileUtils";

const app = express();
const PORT = process.env.PORT || 3001;

const OUTPUT_DIR = path.resolve("output");
ensureDir(OUTPUT_DIR);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:3001",
      "https://xeno-client.onrender.com",
    ];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
