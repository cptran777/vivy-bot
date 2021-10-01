import pg = require("pg");
import { DiscordDAO } from "./discord/client";

// To ensure that we do not mistype process.env variables, which are essentially "any" keys
const PROCESS_ENV = process.env as EnvironmentVariables;
const { Client } = pg;

const client = new Client({
  connectionString: PROCESS_ENV.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Activate on deployment
client.connect();

export const dbClient = {
  discord: new DiscordDAO(client),
};
