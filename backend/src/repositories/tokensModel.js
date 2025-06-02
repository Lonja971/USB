import pool from "../../db.js";

export const getPlayerId = async (identifier) => {
   try {
      const [rows] = await pool.query('SELECT * FROM tokens WHERE identifier = ?', [identifier]);

      if (rows.length === 0) {
         return {isSuccess: false, message: `No player found for identifier: ${identifier}`};
      }

      return {isSuccess: true, id: rows[0].player_id};
   } catch (error) {
      console.error('Error fetching player ID:', error);
      throw error;
   }
};
