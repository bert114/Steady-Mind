export const UPSERT_DAILY_LOG_QUERY = `
  INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
  VALUES ($1, $2, 100, 3)
  ON CONFLICT (user_id, log_date) 
  DO UPDATE SET log_date = EXCLUDED.log_date
  RETURNING id;
`;

export const INSERT_INTERACTION_QUERY = `
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

export const FETCH_ALL_USER_INTERACTIONS_QUERY = `
  SELECT 
    si.id,
    si.daily_log_id,
    si.relationship_type_id,
    rt.name AS relationship_type_name,
    si.custom_name,
    si.duration_minutes,
    si.drain_score,
    si.interaction_time,
    dl.log_date
  FROM social_interactions si
  INNER JOIN daily_logs dl ON si.daily_log_id = dl.id
  LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
  WHERE dl.user_id = $1
  ORDER BY si.interaction_time DESC;
`;
