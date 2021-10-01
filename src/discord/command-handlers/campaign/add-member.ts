import { Message } from "discord.js";
import { Arguments } from "yargs";
import { dbClient } from "../../../database/clients";

const CHARACTER_NAME_FLAG = "character";
const CAMPAIGN_NAME_FLAG = "campaign";

/**
 * Handles the add player to campaign command. Format of the command message should be:
 * !vivy campaign addplayer @PlayerName --campaign campaignName --character characterName
 * @param args - expected arguments object for this command
 * @param message - message that triggered the command
 * @returns
 */
export async function handleCampaignAddMemberCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  const requesterID = message.author.id;
  const campaignName = args[CAMPAIGN_NAME_FLAG];

  if (!campaignName || typeof campaignName !== "string") {
    message.reply("I can't tell which campaign you want to add a player to...");
    return;
  }

  const existingCampaign = await dbClient.discord.campaign.getCampaignByName(
    campaignName
  );

  if (!existingCampaign) {
    message.reply(`I couldn't find a campaign by the name ${campaignName}.`);
    return;
  }

  const isRequesterAllowedCommand =
    existingCampaign.adminIDs.includes(requesterID);

  if (!isRequesterAllowedCommand) {
    message.reply(
      `Sorry, ${message.author.username}, you have to be an admin of the campiagn to use that command.`
    );
    return;
  }

  const member = message.mentions.users.first();

  if (!member) {
    message.reply("I can't tell who you want to add to your campaign...");
    return;
  }

  const memberID = member.id;

  if (existingCampaign.memberIDs.includes(memberID)) {
    message.reply(`${member.username} is already in your campaign.`);
    return;
  }

  const characterName = args[CHARACTER_NAME_FLAG] as string;

  // Need to also guard against blank strings so
  if (characterName && typeof characterName === "string") {
    if (existingCampaign.characters.includes(characterName)) {
      message.reply(
        `There's already a character named ${characterName} in your campaign.`
      );
      return;
    }

    existingCampaign.characters.push(characterName);
    existingCampaign.characterOwnership[memberID] = characterName;
  }

  existingCampaign.memberIDs.push(memberID);

  try {
    await dbClient.discord.campaign.saveCampaign(existingCampaign);
    message.reply(`${member.username} has been added to ${campaignName}`);
  } catch (error) {
    console.log(error);
    message.reply(
      "I failed to add a player... I just wanted to make people happy with my singing."
    );
  }
}
