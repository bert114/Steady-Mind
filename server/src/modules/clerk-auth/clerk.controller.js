import { getAuth } from "@clerk/express";
import { getUserData, createUserData, syncUser } from "./clerk.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const data = await getUserData(userId);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createData = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { content, email } = req.body;

    if (email) {
      await syncUser(userId, email);
    }

    const newData = await createUserData(userId, content);
    res.status(201).json({ data: newData });
  } catch (error) {
    next(error);
  }
};
