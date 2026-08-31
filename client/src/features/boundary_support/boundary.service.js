import { apiClient } from "../api/axiosClient";

async function generate(situation, tone) {
  const response = await apiClient.post("/boundary/generate", {
    situation,
    tone,
  });

  const { boundaryMessage: message, source } = response.data.data;

  return { message, source };
}

async function saveMessage({ situation, message, tone, source }) {
  const response = await apiClient.post("/boundary/messages", {
    situation,
    message,
    tone,
    source,
  });

  return response.data.data;
}

async function getMessages() {
  const response = await apiClient.get("/boundary/messages");

  return response.data.data;
}

export { generate, getMessages, saveMessage };
