import express from "express";
import { router } from "./server/routes/";
import cors from "cors";
import { webSocket } from "./server/socket";
import { createServer } from "http";
import path from "path";
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

// Servir arquivos estáticos (imagens) - antes do json para não interferir
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Body parser para JSON (não interfere com multipart/form-data)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
const httpServer = createServer(app);

const io = webSocket(httpServer);

// Exportar io para uso nos controllers
export { io };

cron.schedule("* * * * *", async () => {
  // console.log("Running cron");
  await cancelOlderThan7MinutesRide(io);
});

cron.schedule("*/05 * * * * *", async () => {
  // console.log("Running RIDE cron every 20 seconds");
  await offerRides(io);
});
