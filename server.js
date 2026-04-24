// server.js

const express = require("express");
const { exec } = require("child_process"); // To run the Python script
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files (generated HTML articles)
app.use("/articles", express.static(path.join(__dirname, "generated_articles")));

// Route for homepage
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Article Generator Service</h1>");
});

// Route to manually trigger article generation
app.get("/generate-articles", (req, res) => {
  exec("python3 article-generator.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send("Error generating articles.");
      return;
    }
    console.log(`stdout: ${stdout}`);
    res.send("<h1>Articles Generated!</h1><p>Check your generated_articles folder.</p>");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
