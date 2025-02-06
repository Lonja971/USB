import express from "express";
import { createPlayerAccount } from "./models/playerModel.js";

export function initRegister(app) {
   app.use(express.json());

   app.post("/register", (req, res) => {
      const { playerName, password, passwordConfirmation } = req.body;

      if (!playerName || !passwordConfirmation || !password) {
         return res.status(400).json({ message: "Всі поля обов'язкові!" });
      }
      if (password !== passwordConfirmation){
         return res.status(400).json({ message: "Паролі не сходяться!" });
      }
      
      const createNewAccount = async (playerName, password) => {
         try {
            const playerAccount = await createPlayerAccount(playerName, password);
            
            return res.status(playerAccount.success ? 201 : 400).json({ message: playerAccount.message });
         } catch (error) {
            console.error('Error fetching player data:', error);
         }
      };
      createNewAccount(playerName, password);
   });
}