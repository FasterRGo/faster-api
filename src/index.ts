import express from "express";
import { router } from "./server/routes/";
import cors from "cors";
import { webSocket } from "./server/socket";
import { createServer } from "http";
import {
  cancelOlderThan7MinutesRide,
  offerRides,
} from "./database/repositories/rideRepository";
const app = express();
const cron = require("node-cron");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(router);
const httpServer = createServer(app);

const io = webSocket(httpServer);

cron.schedule("* * * * *", async () => {
  console.log("Running cron");
  await cancelOlderThan7MinutesRide(io);
});

cron.schedule("*/20 * * * * *", async () => {
  console.log("Running RIDE cron every 20 seconds");
  await offerRides(io);
});
