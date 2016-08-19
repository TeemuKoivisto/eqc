const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/dist"));
app.use(express.static(__dirname + "/lib"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App listening on port", port);
  }
});
