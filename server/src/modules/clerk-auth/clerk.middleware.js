import { verifyToken } from "@clerk/backend";

export const clerkAuthMiddleware = () => {
  return {
    before: async (request) => {
      const authHeader =
        request.event.headers.authorization ||
        request.event.headers.Authorization;
      const token = authHeader?.replace("Bearer ", "");

      if (!token) throw new Error("Unauthorized");

      try {
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });

        request.event.auth = { userId: decoded.sub };
      } catch (error) {
        throw new Error("Unauthorized");
      }
    },
  };
};
