import pool from "../../db.js";

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
