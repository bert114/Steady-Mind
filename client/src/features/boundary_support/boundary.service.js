import { apiClient } from "../api/axiosClient";

async function generate(situation) {
  const response = await apiClient.post("/boundary/generate", {
    situation,
  });

  const { boundaryMessage: message, source } = response.data.data;

  return { message, source };
}

export { generate };
