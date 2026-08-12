import throwError from "../../../utils/throwError.js";
import {
  isIntegerInRange,
  isPositiveInteger,
  isValidIsoTimestamp,
  isValidNonEmptyString,
} from "./interaction.helper.js";
import { RELATIONSHIP_ID_MAP } from "./interaction.utils.js";

export const validateSocialInteraction = (req, res, next) => {
  const {
    user_id,
    custom_name,
    relationship_type,
    duration_minutes,
    drain_score,
    timestamp,
  } = req.body;

  if (!isValidNonEmptyString(user_id)) {
    throwError(
      "Validation Error: user_id is required and must be a non-empty string.",
    );
  }

  const convertToId = RELATIONSHIP_ID_MAP[relationship_type];
  const hasRelationshipType = isPositiveInteger(convertToId);
  const hasCustomName = isValidNonEmptyString(custom_name);

  if (!hasRelationshipType && !hasCustomName) {
    throwError(
      "Validation Error: Either relationship_type_id or custom_name must be provided.",
    );
  }

  if (hasCustomName && custom_name.trim().length > 100) {
    throwError("Validation Error: custom_name must not exceed 100 characters.");
  }

  if (!isPositiveInteger(duration_minutes)) {
    throwError(
      "Validation Error: duration_minutes must be a positive integer greater than 0.",
    );
  }

  if (!isIntegerInRange(drain_score, -5, 5)) {
    throwError(
      "Validation Error: drain_score must be an integer between -5 and 5.",
    );
  }

  if (
    timestamp !== undefined &&
    timestamp !== null &&
    !isValidIsoTimestamp(timestamp)
  ) {
    throwError(
      "Validation Error: timestamp must be a valid ISO date string if provided.",
    );
  }

  console.log(convertToId);

  req.body.user_id = user_id.trim();
  req.body.custom_name = hasCustomName ? custom_name.trim() : null;
  req.body.relationship_type_id = hasRelationshipType ? convertToId : null;
  req.body.duration_minutes = Number(duration_minutes);
  req.body.drain_score = Number(drain_score);

  next();
};
