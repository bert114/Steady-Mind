import logger from "../../utils/logger.js";

const FALLBACK_BOUNDARY_MESSAGE =
  "Hey, I’ve been feeling pretty drained lately, so I need some time to recharge. I’ll let you know when I’m up for hanging out.";

const fetchAiGeneratedText = async (situation) => {
  const isAiServiceAvailable = Boolean(process.env.OPENAI_API_KEY);

  if (!isAiServiceAvailable) {
    throw new Error("AI API key missing or service unavailable.");
  }

  return `Hey, I really value our time, but I'm currently running on low energy and need to rest. I'll reach out when I'm feeling back to full strength!`;
};

export const generateBoundaryMessage = async (situation) => {
  try {
    const aiMessage = await fetchAiGeneratedText(situation);
    return {
      message: aiMessage,
      source: "ai",
    };
  } catch (error) {
    logger.warn(
      `AI Generation failed (${error.message}). Returning static fallback boundary.`,
    );
    return {
      message: FALLBACK_BOUNDARY_MESSAGE,
      source: "fallback",
    };
  }
};
