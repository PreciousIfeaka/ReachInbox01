const app = require("./app");
const http = require("http");
require('dotenv').config();
scheduleJob = require("./scheduler/scheduler");

const port = process.env.PORT_NO;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Starting server on port ${port} ...`);
})