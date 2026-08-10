import logger from "../utils/logger.js";

const SENSITIVE_FIELDS = [
  "password",
  "passwordConfirm",
  "token",
  "accessToken",
  "refreshToken",
  "secret",
];

const sanitizePayload = (payload) => {
  if (!payload || typeof payload !== "object") return payload;
  if (Array.isArray(payload)) return payload.map(sanitizePayload);

  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizePayload(sanitized[key]);
    }
  }
  return sanitized;
};

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  if (req.method === "OPTIONS") {
    return next();
  }

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    const logPayload = {
      type: "HTTP_REQUEST",
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      //duration: `${duration}ms`,
      //   client: {
      //     ip: req.ip || req.socket?.remoteAddress || "unknown",
      //     origin: req.get("origin") || req.get("referer") || undefined,
      //     userAgent: req.get("user-agent") || undefined,
      //   },
      actor: {
        userId:
          req.user?.id || req.user?._id || req.body?.userId || "anonymous",
        role: req.user?.role || "guest",
      },
      headers: {
        contentType: req.get("content-type") || undefined,
        authorization: req.get("authorization") ? "[PRESENT]" : "[NONE]",
      },
      query: Object.keys(req.query || {}).length ? req.query : undefined,
      body: Object.keys(req.body || {}).length
        ? sanitizePayload(req.body)
        : undefined,
    };

    logger.info(JSON.stringify(logPayload, null, 2));
  });

  next();
};

export default requestLogger;
