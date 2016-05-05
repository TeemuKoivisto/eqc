const fs = require("fs");

fs
.readdirSync("./gulp")
.filter(file =>
  (/\.(js)$/i).test(file)
)
.map(file =>
  require("./gulp/" + file)
);
