const express = require("express");

const app = express();

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log("Time:", new Date());
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Logging middleware working"
  });
});

app.listen(3000, () => {
  console.log("Server running at port 3000");
});