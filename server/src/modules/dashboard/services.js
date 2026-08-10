import db from "../../config/db.js";

export const getUserData = async (userId) => {
  const dailyLogsQuery = `
      SELECT id, log_date, battery_level, mood_score 
      FROM daily_logs 
      WHERE user_id = $1 
      ORDER BY log_date DESC 
      LIMIT 7
    `;

  const dailyLogs = await db.query(dailyLogsQuery, [userId]);

  const interactionsQuery = `
      SELECT 
        si.id, 
        si.duration_minutes, 
        si.drain_score, 
        si.custom_name, 
        rt.name AS relationship_type,
        dl.log_date
      FROM social_interactions si
      JOIN daily_logs dl ON si.daily_log_id = dl.id
      LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id
      WHERE dl.user_id = $1
      ORDER BY si.interaction_time DESC
      LIMIT 5
    `;
  const recentInteractions = await db.query(interactionsQuery, [userId]);

  const copingQuery = `
      SELECT id, name, effort_level, success_score, usage_count
      FROM coping_activities
      WHERE user_id = $1
      ORDER BY success_score DESC
      LIMIT 3
    `;

  const topCopingActivities = await db.query(copingQuery, [userId]);

  return { topCopingActivities, recentInteractions, dailyLogs };
};
