const Weekly = {
  battery: `
    SELECT 
    SUM(battery_level) AS total,
    COUNT(battery_level) AS log_count
    FROM 
        daily_logs
    WHERE 
        user_id = $1
        AND log_date >= CURRENT_DATE - INTERVAL '7 days';
    `,

  mood: `
    SELECT 
    SUM(dl.mood_score) AS total,
    COUNT(dl.mood_score) AS log_count
    FROM daily_logs dl
    WHERE dl.user_id = $1
    AND dl.log_date >= DATE_TRUNC('week', CURRENT_DATE)
    AND dl.log_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days';
    `,

  drain_score: `
    SELECT 
    SUM(si.drain_score) as total, 
    COUNT(si.drain_score) as log_count
    FROM social_interactions si
    JOIN daily_logs dl ON si.daily_log_id = dl.id
    WHERE dl.user_id = $1
    AND dl.log_date >= CURRENT_DATE - INTERVAL '7 days'
    `,

  social_interactions_count: `
    SELECT 
    COUNT(*) AS total
    FROM social_interactions si
    JOIN daily_logs dl ON si.daily_log_id = dl.id
    WHERE dl.user_id = $1
    AND dl.log_date >= CURRENT_DATE - INTERVAL '7 days'
  `,

  burnout_score: `
  
    SELECT drain_score, log_date
    FROM USERS u
    left join daily_logs dl on u.clerk_id = dl.user_id
    left join social_interactions si on dl.id = si.daily_log_id
    WHERE u.clerk_id = $1
    AND dl.log_date >= CURRENT_DATE - INTERVAL '7 days'

  
  
  `,
};

export const WeeklyEnergy = {
  getWeeklyEnergy: `
    SELECT log_date, battery_level
    FROM USERS u
    left join daily_logs dl on u.clerk_id = dl.user_id
    WHERE u.clerk_id = $1
    AND dl.log_date >= CURRENT_DATE - INTERVAL '7 days'
  `,
};

export default Weekly;
