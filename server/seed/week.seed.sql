-- Seed: current week (Mon-Sun) energy + mood for user_3IjUd7RBYt8Wo5n6N98whHXxB05

INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
SELECT 'user_3IjUd7RBYt8Wo5n6N98whHXxB05', DATE_TRUNC('week', CURRENT_DATE)::date + day_offset, battery, mood
FROM (VALUES
  (0, 70, 4),  -- Mon - Good
  (1, 65, 4),  -- Tue - Good
  (2, 60, 3),  -- Wed - Okay
  (3, 55, 3),  -- Thu - Okay
  (4, 70, 4),  -- Fri - Good
  (5, 75, 5),  -- Sat - Great
  (6, 80, 5)   -- Sun - Great
) AS v(day_offset, battery, mood)
ON CONFLICT (user_id, log_date)
DO UPDATE SET battery_level = EXCLUDED.battery_level, mood_score = EXCLUDED.mood_score;