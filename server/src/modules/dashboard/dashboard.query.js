export const FETCH_HISTORY = `SELECT log_date, mood_score, battery_level FROM daily_logs WHERE user_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '7 days' ORDER BY log_date DESC;`;

export const FETCH_WEEKLY_SOCIAL_INTERACTION = `
  SELECT si.id, si.duration_minutes, si.drain_score, si.interaction_time, si.custom_name, rt.name as relationship_type
  FROM social_interactions si
  LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
  JOIN daily_logs dl ON si.daily_log_id = dl.id
  WHERE dl.user_id = $1
  ORDER BY si.interaction_time DESC
  LIMIT 10;
`;

export function fetchDynamicColumns(
  tableName,
  fields,
  userId,
  additionalClause,
) {
  if (!fields || fields.length === 0) {
    throw new Error("At least one field must be specified.");
  }

  const selectedColumns = fields.map((field) => `"${field}"`).join(", ");

  const query = `
    SELECT ${selectedColumns} 
    FROM "${tableName}" 
    WHERE user_id = $1 
    ${additionalClause ? additionalClause : ""};
  `;

  return query;
}
