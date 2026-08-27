import { getAuth, clerkClient } from "@clerk/express";
import db from "../../config/db.js";

export const injectUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    const user = await clerkClient.users.getUser(userId);

    const email = user.emailAddresses[0].emailAddress;

    const query = `
      INSERT INTO users (clerk_id, email)
      VALUES ($1, $2)
      ON CONFLICT (clerk_id)
      DO UPDATE SET email = EXCLUDED.email
    `;

    await db.query(query, [userId, email]);

    req.userId = userId;
    req.userEmail = email;

    next();
  } catch (error) {
    next(error);
  }
};
