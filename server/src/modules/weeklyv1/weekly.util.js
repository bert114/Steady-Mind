function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfWeekKey(date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = today.getDay();
  const offset = day === 0 ? 6 : day - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - offset);
  return toDateKey(monday);
}
