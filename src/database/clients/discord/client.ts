import { Client } from "pg";
import { AssignDAO } from "./assign/assign-dao";
import { CampaignDAO } from "./campaign/campaign-dao";
import { SpecialCommandsDAO } from "./special/special-dao";

export class DiscordDAO {
  special: SpecialCommandsDAO;
  campaign: CampaignDAO;
  assign: AssignDAO;

  constructor(client: Client) {
    this.special = new SpecialCommandsDAO(client);
    this.campaign = new CampaignDAO(client);
    this.assign = new AssignDAO(client);
  }
}
