import db from "../../config/db.js";

let tableEnsured = false;

const ensureBoundaryMessagesTable = async () => {
  if (tableEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS boundary_messages (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      situation TEXT NOT NULL,
      message TEXT NOT NULL,
      tone TEXT NOT NULL DEFAULT 'soft',
      source TEXT NOT NULL DEFAULT 'ai',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  tableEnsured = true;
};

export async function insertBoundaryMessage({
  userId,
  situation,
  message,
  tone,
  source,
}) {
  await ensureBoundaryMessagesTable();

  const result = await db.query(
    `INSERT INTO boundary_messages (user_id, situation, message, tone, source)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, situation, message, tone, source, created_at`,
    [userId, situation, message, tone, source],
  );

  return result[0];
}

export async function fetchBoundaryMessages(userId, limit = 100) {
  await ensureBoundaryMessagesTable();

  return await db.query(
    `SELECT id, situation, message, tone, source, created_at
     FROM boundary_messages
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT $2`,
    [userId, limit],
  );
}