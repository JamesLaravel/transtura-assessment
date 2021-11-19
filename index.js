const express = require("express");
const app = express();
let port = process.env.PORT || 7000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Server started on port`);
});