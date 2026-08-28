import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import errorHandler from "./middleware/errorHandler.js";
import burnOutRoute from "./modules/burnout/burnout.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import interactionRoutes from "./modules/logs/interactions/interaction.route.js";
import AppError from "./utils/AppError.js";

import analyticsRoutes from "./modules/analytics/analytics.route.js";
import { boundaryRoutes } from "./modules/boundary_support/boundary.route.js";
import clerk from "./modules/clerk-auth/clerk.route.js";
import energyRoute from "./modules/logs/energy/energy.route.js";
import recoveryRouter from "./modules/recovery/recovery.route.js";
const app = express();

//app.use(requestLogger);

app.use(helmet());
app.use(
  cors({
    origin: [
      "https://bert114.github.io/Steady-Mind/",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

if (process.env.CLERK_ENABLED === "true") {
  app.use(clerkMiddleware());
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is working",
  });
});

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/logs/energy", energyRoute);
app.use("/api/v1/logs/interactions", interactionRoutes);
app.use("/api/v1/burnout", burnOutRoute);
app.use("/api/v1/recovery", recoveryRouter);
app.use("/api/v1/analytics", analyticsRoutes);

app.use("/api/v1", clerk);

app.use("/api/v1/boundary", boundaryRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
