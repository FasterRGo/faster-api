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

app.listen(3030, () => {
  console.log("🔥 Running on Port 3030! 🔥");
  console.log("http://localhost:3030");
  console.log("wss://localhost:3030");
});
