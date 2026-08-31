import logger from "../../utils/logger.js";
import {
  fetchBoundaryMessages,
  insertBoundaryMessage,
} from "./boundary.query.js";

const AI_MESSAGES = {
  soft: "Hey, thanks for thinking of me. I'm running on empty right now and need to rest. I'll reach out once I'm back at full strength.",
  direct:
    "I appreciate you, but I'm at my limit today. I won't be able to take this on — I'll circle back when I have the energy to show up properly.",
  firm: "I'm at capacity and can't take this on. That's firm. Please don't keep this on my plate — I'll bring it back only if something changes.",
};

const FALLBACK_MESSAGES = {
  soft: "Hey — thanks for thinking of me. I'm at my limit right now and need quiet time to recharge. I'll reach out when I have more to give.",
  direct:
    "I value you, and right now I have to say no. I'm at capacity, so I can't take this on today.",
  firm: "I'm not able to take this on. That's a firm no from me — I'll let you know if it changes.",
};

const fetchAiGeneratedText = async (situation, tone) => {
  const isAiServiceAvailable = Boolean(process.env.OPENAI_API_KEY);

  if (!isAiServiceAvailable) {
    throw new Error("AI API key missing or service unavailable.");
  }

  return AI_MESSAGES[tone] ?? AI_MESSAGES.soft;
};

export const generateBoundaryMessage = async (situation, tone = "soft") => {
  try {
    const aiMessage = await fetchAiGeneratedText(situation, tone);
    return {
      message: aiMessage,
      source: "ai",
    };
  } catch (error) {
    logger.warn(
      `AI Generation failed (${error.message}). Returning static fallback boundary.`,
    );
    return {
      message: FALLBACK_MESSAGES[tone] ?? FALLBACK_MESSAGES.soft,
      source: "fallback",
    };
  }
};

export const saveBoundaryMessage = async ({
  userId,
  situation,
  message,
  tone,
  source,
}) => {
  return await insertBoundaryMessage({
    userId,
    situation,
    message,
    tone,
    source,
  });
};

export const listSavedBoundaryMessages = async (userId) => {
  return await fetchBoundaryMessages(userId);
};