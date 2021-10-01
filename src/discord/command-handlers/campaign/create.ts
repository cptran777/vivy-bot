import { Message } from "discord.js";
import { Arguments } from "yargs";
import { dbClient } from "../../../database/clients";
import { createLog, LogType } from "../../../database/utils/logger";
import {
  BotCommand,
  CampaignCommand,
} from "../../../types/discord/constants/commands";
import { getMentionedUser, USER_MENTION_GLOBAL_REGEX } from "../../utils/user";

const CAMPAIGN_NAME_FLAG = "name";
const CAMPAIGN_CURRENCY_FLAG = "currency";
const CAMPAIGN_CHARACTERS_FLAG = "characters";
const CAMPAIGN_MEMBERS_FLAG = "players";

/**
 * Creates a new campaign in the expected format that we can modify based on the user's flags set
 * Example: !vivy campaign create --name sexything --currency credits
 * @param name - name of the campaign to be created
 * @param ownerID - person creating the campaign
 * @returns a blank campaign canvas to work with
 */
function createEmptyCampaign(name: string, ownerID: string): ICampaign {
  return {
    name,
    ownerID,
    adminIDs: [ownerID],
    memberIDs: [],
    currency: "gold",
    money: {},
    characters: [],
    characterOwnership: {},
    groupFunds: 0,
  };
}

export async function handleCampaignCreateCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  const requesterID = message.author.id;

  const isRequesterAllowedCommand =
    (await dbClient.discord.assign.isUserAssignedCommand(
      requesterID,
      `${BotCommand.Campaign}#${CampaignCommand.Create}`
    )) ||
    (await dbClient.discord.assign.isUserAssignedCommand(
      requesterID,
      BotCommand.Campaign
    ));

  if (!isRequesterAllowedCommand) {
    message.reply(
      `Sorry, ${message.author.username}, you can't use the ${CampaignCommand.Create} command.`
    );
    return;
  }

  const campaignName = args[CAMPAIGN_NAME_FLAG] as string;

  if (!campaignName || typeof campaignName !== "string") {
    message.reply("Your campaign needs a valid name...");
    return;
  }

  const existingCampaign = await dbClient.discord.campaign.getCampaignByName(
    campaignName
  );

  if (existingCampaign) {
    message.reply(`A campaign with the name ${campaignName} already exists.`);
    return;
  }

  const campaign = createEmptyCampaign(campaignName, requesterID);

  const currency = args[CAMPAIGN_CURRENCY_FLAG] as string;
  const characters = args[CAMPAIGN_CHARACTERS_FLAG] as string;
  const members = args[CAMPAIGN_MEMBERS_FLAG] as string;

  if (currency) {
    campaign.currency = currency;
  }

  if (typeof characters === "string") {
    const listOfCharacters = characters.split(",");
    campaign.characters = listOfCharacters;
  }

  if (typeof members === "string") {
    // Expected is something like "<@memberID> <@memberID>"
    const rawMentionStrings = members.match(USER_MENTION_GLOBAL_REGEX);
    const mentionedIDs = message.mentions.users.map((user) => user.id);
    // With these checks in place, only members who were properly mentioned can be added to the
    // campaign
    if (rawMentionStrings && rawMentionStrings.length > 0) {
      const membersToAdd = rawMentionStrings
        .map((item) => getMentionedUser(item))
        .filter((item) => mentionedIDs.includes(item));
      campaign.memberIDs = membersToAdd;
    }
  }

  try {
    await dbClient.discord.campaign.saveCampaign(campaign);
    message.reply(
      `Your campaign ${campaignName} should have been created successfully.`
    );
  } catch (error) {
    createLog(LogType.error, "Error creating a campaign");
    console.log(error);
    message.reply("I couldn't create your campaign...");
  }
}
