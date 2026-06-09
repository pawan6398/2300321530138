 const express = require("express");
const Log = require("./logger");

const app = express();

app.use(express.json());

// Logging Middleware
app.use(async (req, res, next) => {
  console.log("Time:", new Date());
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  await Log(
    "backend",
    "info",
    "handler",
    `${req.method} request received on ${req.url}`
  );

  next();
});

app.get("/", async (req, res) => {

  await Log(
    "backend",
    "info",
    "route",
    "Root endpoint executed"
  );

  res.json({
    message: "Logging middleware working"
  });
});

app.listen(3000, async () => {

  await Log(
    "backend",
    "info",
    "handler",
    "Server started on port 3000"
  );

  console.log("Server running at port 3000");
});