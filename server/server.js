const app = require("./app");
const http = require("http");
require('dotenv').config({path: "../.env"});

const port = process.env.PORT_NO 

const server = http.createServer(app);
console.log(port);

server.listen(port, () => {
  console.log(`Starting server on port ${port} ...`)
})