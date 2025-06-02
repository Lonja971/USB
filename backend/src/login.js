import express from "express";
import { PlayerRepository } from "./repositories/playerRepository.js";

export function initLogin(app) {
   app.use(express.json());

   app.post("/login", (req, res) => {
      const { playerName, password } = req.body;

      if (!playerName || !password) {
         return res.status(400).json({ message: "Всі поля обов'язкові!" });
      }

      const playerIp = getDeviceId(req);

      const loginIntoAccount = async () => {
         try {
            const playerLogin = await PlayerRepository.loginIntoPlayerAccount(playerName, password, playerIp);

            return res.status(playerLogin.success ? 201 : 400).json({
               token: playerLogin.token || "",
               message: playerLogin.message
            });
         } catch (error) {
            console.error('Error fetching player data:', error);
         }
      };
      loginIntoAccount();

   });
}