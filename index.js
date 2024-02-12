const express = require("express");
const app = express();

app.use(express.json());

async function start(app) {
  app.listen(process.env.PORT, () => {
    console.log("server is running (express)");
  });
}

start(app)
  .then(() => console.log("start routine complete"))
  .catch((err) => console.log("star routine error: ", err));
