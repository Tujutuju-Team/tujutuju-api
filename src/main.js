const express = require("express");
const routers = require("./routers");
const { init } = require("./config/init");

async function main() {
  init();
  const app = express();
  app.use(routers);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

main();
