import { getAuth } from "@clerk/express";
import throwError from "../../utils/throwError.js";
import {
  generateBoundaryMessage,
  listSavedBoundaryMessages,
  saveBoundaryMessage,
} from "./boundary.service.js";

export const handleGenerateBoundary = async (req, res, next) => {
  try {
    const { situation, tone } = req.body;
    console.log(req.body);

    const result = await generateBoundaryMessage(situation, tone);

    return res.status(200).json({
      status: "success",
      data: {
        boundaryMessage: result.message,
        source: result.source,
        tone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleSaveBoundary = async (req, res, next) => {
  try {
    const { userId } = req.auth ?? getAuth(req) ?? {};

    if (!userId) {
      throwError("Sign in to save a boundary message.", 401);
    }

    const { situation, message, tone, source } = req.body;

    const saved = await saveBoundaryMessage({
      userId,
      situation,
      message,
      tone,
      source,
    });

    return res.status(201).json({
      status: "success",
      data: saved,
    });
  } catch (error) {
    next(error);
  }
};

export const handleListBoundaries = async (req, res, next) => {
  try {
    const { userId } = req.auth ?? getAuth(req) ?? {};

    if (!userId) {
      throwError("Sign in to view your boundaries.", 401);
    }

    const messages = await listSavedBoundaryMessages(userId);

    return res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
