import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import logger from "../utils/logger.js";

const sql = neon(process.env.DATABASE_URL);

export const checkDatabaseConnection = async () => {
  try {
    console.log("Attempting to connect to Neon database...");
    await sql`SELECT 1`;
    console.log("Query executed successfully.");
    return true;
  } catch (error) {
    logger.error("Database connection check failed:", error.message);
    return false;
  }
};

export default {
  query: async (text, params) => {
    return await sql.query(text, params);
  },
};
