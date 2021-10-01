require("dotenv").config();

// To ensure that we do not mistype process.env variables, which are essentially "any" keys
const PROCESS_ENV = process.env as EnvironmentVariables;

import discord = require("discord.js");
import { discordMessageCommandHandler } from "./discord/command-handlers";

const { Client, Intents } = discord;
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("messageCreate", discordMessageCommandHandler);

client.login(PROCESS_ENV.BOT_TOKEN);

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
