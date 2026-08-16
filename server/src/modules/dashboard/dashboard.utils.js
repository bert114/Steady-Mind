function formatWeeklyMood(historyData) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const moodMap = {};
  historyData.forEach((item) => {
    const d = new Date(item.log_date);
    const key = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
    moodMap[key] = item.mood_score;
  });

  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDateOnly);
    d.setDate(todayDateOnly.getDate() - i);

    const key = d.toISOString().split("T")[0];
    const isToday = i === 0;

    result.push({
      day: isToday ? "Today" : daysOfWeek[d.getDay()],
      moodScore: moodMap[key] ?? 0, // Defaults to 0 if no log exists for that day
      isToday: isToday,
    });
  }

  return result;
}
export function formatWeeklyData(historyData) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  // Map database entries by date key for direct lookup
  const dataMap = {};

  // Ensure historyData is an array before iterating
  const rows = historyData?.rows || historyData || [];

  rows.forEach((item) => {
    if (!item.log_date) return; // Skip if log_date is missing

    const d = new Date(item.log_date);

    // Check if date is valid before calling toISOString
    if (isNaN(d.getTime())) return;

    const key = d.toISOString().split("T")[0];
    dataMap[key] = {
      mood_score: item.mood_score,
      battery_level: item.battery_level,
    };
  });

  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDateOnly);
    d.setDate(todayDateOnly.getDate() - i);

    const key = d.toISOString().split("T")[0];
    const isToday = i === 0;
    const entry = dataMap[key];

    result.push({
      day: isToday ? "Today" : daysOfWeek[d.getDay()],
      moodScore: entry?.mood_score ?? 0,
      batteryLevel: entry?.battery_level ?? 0,
      isToday: isToday,
    });
  }

  return result;
}

export function buildQuerySelect({
  tableName,
  userId,
  arrayOfFields,
  additionalClause,
}) {
  if (!arrayOfFields || arrayOfFields.length === 0) {
    throw new Error("At least one field must be specified.");
  }

  const selectedColumns = arrayOfFields.map((field) => `"${field}"`).join(", ");

  const query = `
    SELECT ${selectedColumns} 
    FROM "${tableName}" 
    WHERE user_id = $1 
    ${additionalClause ? additionalClause : ""};
  `;

  return query;
}

export function buildCustomQuery({
  selectFields,
  fromTable,
  joins = [],
  whereClause = "",
  orderBy = "",
  limit = null,
}) {
  if (!selectFields || selectFields.length === 0) {
    throw new Error("At least one field must be specified.");
  }

  const columns = selectFields.join(", ");
  const joinStatements =
    joins.length > 0 ? `\n    ${joins.join("\n    ")}` : "";
  const where = whereClause ? `\n    WHERE ${whereClause}` : "";
  const sorting = orderBy ? `\n    ORDER BY ${orderBy}` : "";
  const capping = limit !== null ? `\n    LIMIT ${limit}` : "";

  return `
    SELECT ${columns}
    FROM ${fromTable}${joinStatements}${where}${sorting}${capping};
  `;
}

export { formatWeeklyMood };
