import { Client } from "pg";
import { SPECIAL_COMMAND_TARGETS_TABLE } from "../../constants";

const lotrQuotes = require("../../../../../db/quotes.json");

async function getLOTRQuotes(): Promise<Array<string>> {
  // Simulate async-ness for consistency. Probably should add this to a real DB at some point
  const quotes = await lotrQuotes.quotes;
  return quotes;
}

export class SpecialCommandsDAO {
  private client: Client;

  getLOTRQuotes = getLOTRQuotes;

  async getGondorMemberIDs(serverID: string): Promise<Array<string>> {
    const response = await this.client.query(
      `SELECT * from ${SPECIAL_COMMAND_TARGETS_TABLE} where server_id = $1 and command_key = $2`,
      [serverID, "lightthefires"]
    );

    const targets = response.rows[0]?.targets;

    if (targets) {
      return targets.split(",");
    }

    return [];
  }

  constructor(client: Client) {
    this.client = client;
  }
}
