import { randomUUID } from "crypto";
import db from "../../config/db.js";

export const syncUser = async (clerkId, email) => {
  const query = `
    INSERT INTO users (id, email) 
    VALUES ($1, $2) 
    ON CONFLICT (id) DO NOTHING
  `;
  await db.query(query, [clerkId, email]);
};

export const getUserData = async (clerkId) => {
  const query = `
    SELECT id, content, created_at 
    FROM aura_data 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await db.query(query, [clerkId]);
  return result.rows;
};

export const createUserData = async (clerkId, content) => {
  const id = randomUUID();
  const query = `
    INSERT INTO aura_data (id, user_id, content) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const result = await db.query(query, [id, clerkId, content]);
  return result.rows[0];
};
