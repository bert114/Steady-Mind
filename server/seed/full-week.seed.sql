-- Sample week dataset (2026-08-25 .. 2026-08-31) for user_3IjUd7RBYt8Wo5n6N98whHXxB05
-- Run the four statements in order. Each is safe to re-run.
-- Mood scale used: good=4, okay=3, low=2, overwhelmed=1

-- 1) Daily energy + mood

INSERT INTO daily_logs (user_id, log_date, battery_level, mood_score)
SELECT 'user_3IjUd7RBYt8Wo5n6N98whHXxB05', v.date, v.energy, v.mood
FROM (VALUES
  ('2026-08-25', 65, 4),  -- good
  ('2026-08-26', 52, 3),  -- okay
  ('2026-08-27', 38, 2),  -- low
  ('2026-08-28', 30, 1),  -- overwhelmed
  ('2026-08-29', 25, 1),  -- overwhelmed
  ('2026-08-30', 45, 3),  -- okay
  ('2026-08-31', 60, 4)   -- good
) AS v(date, energy, mood)
ON CONFLICT (user_id, log_date)
DO UPDATE SET battery_level = EXCLUDED.battery_level, mood_score = EXCLUDED.mood_score;

-- 2) Social interactions (one per day, linked to that day's daily_log)
INSERT INTO social_interactions (daily_log_id, relationship_type_id, custom_name, duration_minutes, drain_score, interaction_time)
SELECT dl.id, rt.id, NULL, v.duration_minutes, v.drain_score, v.date::timestamptz
FROM (VALUES
  ('2026-08-25', 'Friend',   60, 3),
  ('2026-08-26', 'Coworker', 90, 6),
  ('2026-08-27', 'Family',   120, 8),
  ('2026-08-28', 'Coworker', 180, 9),
  ('2026-08-29', 'Friend',   90, 7),
  ('2026-08-30', 'Family',   60, 4),
  ('2026-08-31', 'Friend',   45, 2)
) AS v(date, label, duration_minutes, drain_score)
JOIN daily_logs dl ON dl.user_id = 'user_3IjUd7RBYt8Wo5n6N98whHXxB05' AND dl.log_date = v.date
JOIN relationship_types rt ON LOWER(rt.name) = LOWER(v.label)
WHERE NOT EXISTS (
  SELECT 1 FROM social_interactions si
  WHERE si.daily_log_id = dl.id AND si.duration_minutes = v.duration_minutes
);

-- 3) Coping activities
 

-- 4) Recovery attempts (effectiveness -> rating; not_completed rows have is_complete = FALSE)
INSERT INTO recovery_sessions (interaction_id, activity_id, rating, is_complete, completed_at)
SELECT si.id, ca.id, v.effectiveness, v.is_complete, v.completed_at
FROM (VALUES
  ('2026-08-28', 'Take a 10-minute walk', TRUE,  5, '2026-08-28'),
  ('2026-08-29', 'Take a 10-minute walk', TRUE,  4, '2026-08-29'),
  ('2026-08-29', 'Listen to music',       TRUE,  3, '2026-08-29'),
  ('2026-08-30', 'Take a nap',            TRUE,  4, '2026-08-30'),
  ('2026-08-30', 'Listen to music',       FALSE, NULL, NULL)
) AS v(date, activity_name, is_complete, effectiveness, completed_at)
JOIN daily_logs dl ON dl.user_id = 'user_3IjUd7RBYt8Wo5n6N98whHXxB05' AND dl.log_date = v.date
JOIN social_interactions si ON si.daily_log_id = dl.id
JOIN coping_activities ca ON ca.user_id = 'user_3IjUd7RBYt8Wo5n6N98whHXxB05' AND ca.name = v.activity_name
WHERE NOT EXISTS (
  SELECT 1 FROM recovery_sessions rs
  WHERE rs.interaction_id = si.id AND rs.activity_id = ca.id
    AND rs.completed_at IS NOT DISTINCT FROM v.completed_at::timestamptz
);