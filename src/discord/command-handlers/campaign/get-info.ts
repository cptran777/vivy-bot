import { Message } from "discord.js";
import { Arguments } from "yargs";
import pluralize = require("pluralize");
import { dbClient } from "../../../database/clients";
import {
  BotCommand,
  CampaignCommand,
} from "../../../types/discord/constants/commands";

/**
 * Handles the add group funds to campaign command. The format of the command message should be:
 * !vivy campaign getgroupfunds campaignName
 * @param args - expected arguments object for this command
 * @param message - message that triggered the command
 */
export async function handleGetGroupFundsCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  const requesterID = message.author.id;
  // For getters, let's let anyone be able to do that if they at least have access to the campaign
  // command OR are part of the compaign
  const isRequesterAllowedCommand =
    await dbClient.discord.assign.isUserAssignedCommand(
      requesterID,
      `${BotCommand.Campaign}#${CampaignCommand.GetGroupFunds}`
    );

  const argsList = args._;
  const campaignName = argsList[2];

  if (!campaignName || typeof campaignName !== "string") {
    message.reply(`I can't tell which campaign you want to see funds for.`);
    return;
  }

  const existingCampaign = await dbClient.discord.campaign.getCampaignByName(
    campaignName
  );

  if (!existingCampaign) {
    message.reply(`I couldn't find a campaign by the name ${campaignName}.`);
    return;
  }

  const isRequesterAdminOrPlayer = existingCampaign.adminIDs
    .concat(existingCampaign.memberIDs)
    .includes(requesterID);

  if (!isRequesterAllowedCommand && !isRequesterAdminOrPlayer) {
    message.reply(
      `Sorry, ${message.author.username}, you have to be a player or admin of this campaign to get that info`
    );
    return;
  }

  const funds = existingCampaign.groupFunds || 0;
  message.reply(
    `You have ${funds} ${pluralize(existingCampaign.currency, funds)}`
  );
}
