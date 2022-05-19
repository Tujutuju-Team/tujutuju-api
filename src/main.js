const express = require("express");
const routers = require("./routers");

const app = express();
app.use(routers);

async function main() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
}

main();
