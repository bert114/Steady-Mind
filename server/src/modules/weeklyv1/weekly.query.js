const weeklyBattery_Mood = `
  SELECT * FROM daily_logs
  where user_id = $1
  and created_at >= current_date - interval '7 days'
`;

export const TOTAL_INTERACTIONS = `
  SELECT COUNT(*) FROM social_interactions si
  JOIN daily_logs dl on dl.id = si.daily_log_id
  where dl.user_id = $1
  


`;

export const GET_WEEKLYINTERACTIONS = `
  SELECT si.drain_score, dl.log_date, rt.name as relationship  FROM social_interactions si
  JOIN daily_logs dl on dl.id = si.daily_log_id
  JOIN relationship_types rt on si.relationship_type_id = rt.id
  where dl.user_id = $1
  and created_at >= current_date - interval '7 days'
`;

export { weeklyBattery_Mood };
