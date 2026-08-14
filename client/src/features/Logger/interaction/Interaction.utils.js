import { id } from "../../test/id.js";

export const socialService = {
  logInteraction: async (interactionPayload) => {
    try {
      console.log("Service: Sending payload to backend...", interactionPayload);
      return { success: true, data: interactionPayload };
    } catch (error) {
      console.error("Service Error: Failed to log interaction", error);
      throw error;
    }
  },
};

export const INITIAL_FORM_STATE = {
  relationship: "",
  personName: "",
  duration: "",
  drainScore: 0,
};

export const validateInteractionForm = (formData) => {
  if (!formData.relationship) {
    return "Please select a relationship category.";
  }
  if (!formData.duration) {
    return "Please select a duration chip.";
  }
  return null;
};

export const buildInteractionPayload = (formData, userId) => ({
  user_id: id || userId || "primary_user",
  relationship_type: formData.relationship,
  custom_name: formData.personName.trim() || null,
  duration_minutes: Number(formData.duration),
  drain_score: Number(formData.drainScore),
  timestamp: new Date().toISOString(),
});
