import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initSocketHandler } from "./socketHandler.js";
import { initRegister } from "./register.js";
import { initLogin } from "./login.js";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3002;

app.use(cors({
   origin: "*",
   methods: ["GET", "POST"],
   allowedHeaders: ['Content-Type']
}));

const server = createServer(app);
initSocketHandler(server);
initRegister(app);
initLogin(app);

server.listen(port, () => {
   console.log(`[ :3 ] Server started: http://localhost:${port}`);
});