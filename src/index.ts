import express from "express";
import { router } from "./server/routes/";
import cors from "cors";
import { webSocket } from "./server/socket";
import { createServer } from "http";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(router);
const httpServer = createServer(app);

webSocket(httpServer);
