const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1";

export async function postEnergyLog(payload) {
  const res = await fetch(`${API_BASE}/logs/energy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save energy log");
  return res.json();
}

export async function postInteraction(payload) {
  const res = await fetch(`${API_BASE}/logs/interactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to save interaction");
  return res.json();
}

export async function getCoping() {
  const res = await fetch(`${API_BASE}/logs/coping`);
  if (!res.ok) throw new Error("Failed to fetch coping activities");
  return res.json();
}
