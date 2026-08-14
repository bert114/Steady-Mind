import express from "express";
import cors from "cors";
import helmet from "helmet";
import { clerkMiddleware } from "@clerk/express";

import dashboardRoutes from "./modules/dashboard/dashboard.route.js";
import logsRoutes from "./modules/logs/routes.js";
import errorHandler from "./middleware/errorHandler.js";
import interactionRoutes from "./modules/logs/interactions/interaction.route.js";
import AppError from "./utils/AppError.js";
import burnOutRoute from "./modules/burnout/burnout.route.js";

import energyRoute from "./modules/logs/energy/energy.route.js";
import requestLogger from "./middleware/reqLogger.js";

const app = express();

//app.use(requestLogger);

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.CLERK_ENABLED === "true") {
  app.use(clerkMiddleware());
}

app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/logs/energy", energyRoute);
app.use("/api/v1/logs/interactions", interactionRoutes);
app.use("/api/v1/burnout", burnOutRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
