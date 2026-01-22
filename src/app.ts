import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ficará os arquivos de imagens
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(routes);

export default app;
