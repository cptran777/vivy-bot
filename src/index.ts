require("dotenv").config();

// To ensure that we do not mistype process.env variables, which are essentially "any" keys
const PROCESS_ENV = process.env as EnvironmentVariables;

// We are creating an express server to stop heroku from killing the app
// Can remove once we change to a worker dyno
// Or maybe we'll just keep this and have a web interface too
const express = require("express");
const app = express();

const http = require("http").createServer(app);

const port = PROCESS_ENV.PORT || 3005;
http.listen(port, () => {
  console.log("Listening on port", port);
});
