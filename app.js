const express = require("express");
const path = require("node:path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(`Listening to port ${PORT}...`);
});
