import pool from "../../db.js";
import bcrypt from 'bcrypt';

const generateComplexToken = (length = 64) => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
   let token = '';
   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
   }
   return token;
};

export const getPlayerData = async (playerId) => {
   try {
      const [rows] = await pool.query('SELECT * FROM players WHERE id = ?', [playerId]);
      return rows[0];
   } catch (error) {
      console.error('Error fetching player data:', error);
      throw error;
   }
};

export const updatePlayerCurrentBattle = async (playerId, battleData) => {
   try {
      const [result] = await pool.query('UPDATE players SET current_battle_id = ? WHERE id = ?', [battleData, playerId]);
      
      if (result.affectedRows === 0) {
         console.error(`Player with id ${playerId} not found or battle not updated.`);
         return null;
      }
      return result;
   } catch (error) {
      console.error('Error updating player battle:', error);
      throw error;
   }
};

export const createPlayerAccount = async (playerName, password) => {
   try {
      if (playerName.length > 15) {
         return { success: false, message: "Ім'я має бути не більше 15 символів." };
      }

      const [existingPlayer] = await pool.query(
         `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`, [playerName]
      );

      if (existingPlayer.length > 0) {
         return { success: false, message: "Гравець з таким ім'ям вже існує." };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query(
         `INSERT INTO players (name, password, gold, silver, current_battle_id) 
          VALUES (?, ?, ?, ?, ?)`,
         [playerName, hashedPassword, 0, 0, null]
      );

      if (result) {
         return { success: true, message: "Акаунт створено!" };
      } else {
         return { success: false, message: "Помилка при створенні акаунту." };
      }
   } catch (error) {
      console.error("Помилка при створенні акаунту:", error);
      throw error;
   }
};

export const loginIntoPlayerAccount = async (playerName, password, playerIp) => {
   try {
      const [playerResult] = await pool.query(
         'SELECT * FROM players WHERE LOWER(name) = LOWER(?)', 
         [playerName]
      );

      if (playerResult.length === 0) {
         return { success: false, message: 'Пароль або користувач неправильний!' };
      }

      const player = playerResult[0];
      const isPasswordCorrect = await bcrypt.compare(password, player.password);

      if (!isPasswordCorrect) {
         return { success: false, message: 'Пароль або користувач неправильний!' };
      }

      const token = generateComplexToken();
      const identifier = token;
      const createdAt = Math.floor(Date.now() / 1000);

      const [existingTokenResult] = await pool.query(
         'SELECT * FROM tokens WHERE player_id = ? AND device = ?', 
         [player.id, playerIp]
      );
      
      if (existingTokenResult.length > 0) {
         await pool.query(
            'UPDATE tokens SET identifier = ?, created_at = ? WHERE player_id = ? AND device = ?',
            [identifier, createdAt, player.id, playerIp]
         );
         return { success: true, message: 'Вхід успішний! Токен оновлено.', token };
      } else {
         await pool.query(
            'INSERT INTO tokens (identifier, player_id, device, created_at) VALUES (?, ?, ?, ?)',
            [identifier, player.id, playerIp, createdAt]
         );
         return { success: true, message: 'Вхід успішний!', token };
      }
   } catch (error) {
      console.error('Помилка при вході:', error);
      return { success: false, message: 'Сталася помилка при вході.' };
   }
}