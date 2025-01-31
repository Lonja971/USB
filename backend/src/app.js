import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initSocketServer } from "../src/socketServer.js";

const app = express();
const port = process.env.PORT || 3002;

app.use(cors({
   origin: "*",
   methods: ["GET", "POST"],
   allowedHeaders: ['Content-Type']
}));

const server = createServer(app);
initSocketServer(server);

server.listen(port, () => {
   console.log(`[ :3 ] Server started: http://localhost:${port}`);
});