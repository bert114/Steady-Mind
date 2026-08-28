import "dotenv/config";
import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend server is up and running!",
  });
});

//await checkDatabaseConnection();

const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION!  Shutting down...", err);
  server.close(() => {
    process.exit(1);
  });
});
