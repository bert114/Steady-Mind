const UPSERT_DAILY_LOG_QUERY = `
  INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
  VALUES ($1, $2, 100, 3)
  ON CONFLICT (user_id, log_date) 
  DO UPDATE SET log_date = EXCLUDED.log_date
  RETURNING id;
`;

const INSERT_INTERACTION_QUERY = `
  INSERT INTO social_interactions (
    daily_log_id, 
    relationship_type_id, 
    custom_name, 
    duration_minutes, 
    drain_score, 
    interaction_time
  ) 
  VALUES ($1, $2, $3, $4, $5, $6) 
  RETURNING *;
`;

export { INSERT_INTERACTION_QUERY, UPSERT_DAILY_LOG_QUERY };
