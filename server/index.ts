import express from "express";
import cors from "cors";
import path from "path";
import uploadRoutes from "./src/routes/uploadRoutes";
import { ensureDir } from "./src/utils/fileUtils";

const app = express();
const PORT = process.env.PORT || 3001;

const OUTPUT_DIR = path.resolve("output");
ensureDir(OUTPUT_DIR);

app.use(
  cors({
    origin: "https://xeno-client.onrender.com",
  }),
);
app.use(express.json());

app.use("/output", express.static(OUTPUT_DIR));

app.use("/api", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
