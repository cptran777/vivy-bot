import { Message } from "discord.js";
import { Arguments } from "yargs";
import pluralize = require("pluralize");
import { dbClient } from "../../../database/clients";

const FUNDS_AMOUNT_FLAG = "amount";
enum GroupFundsAction {
  ADD = "add",
  REMOVE = "remove",
}

/**
 * Handles the add group funds to campaign command. The format of the command message should be:
 * !vivy campaign addgroupfunds to campaignName --amount 123456
 * @param args - expected arguments object for this command
 * @param message - message that triggered the command
 */
export async function handleCampaignAddGroupFundsCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  const { existingCampaign, amount, success } = await campaignModifyFundsChecks(
    args,
    message,
    GroupFundsAction.REMOVE
  );

  if (!success) return;

  modifyCampaignGroupFunds(
    message,
    existingCampaign as ICampaign,
    GroupFundsAction.ADD,
    amount as string | number
  );
}

/**
 * Handles the remove group funds to campaign command. The format of the command message should be:
 * !vivy campaign spendgroupfunds campaignName --amount 123456
 * @param args - expected arguments object for this command
 * @param message - message that triggered the command
 */
export async function handleCampaignRemoveGroupFundsCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  const { existingCampaign, amount, success } = await campaignModifyFundsChecks(
    args,
    message,
    GroupFundsAction.REMOVE
  );

  if (!success) return;

  modifyCampaignGroupFunds(
    message,
    existingCampaign as ICampaign,
    GroupFundsAction.REMOVE,
    amount as string | number
  );
}

interface IChecksReturnValue {
  existingCampaign?: ICampaign;
  amount?: number | string;
  success: boolean;
}

async function campaignModifyFundsChecks(
  args: Arguments,
  message: Message,
  action: GroupFundsAction
): Promise<IChecksReturnValue> {
  const requesterID = message.author.id;

  // Filters out worthless words
  const worthlessWords: Array<string | number> = ["to", "from", "in"];
  const argsList = args._.filter((item) => !worthlessWords.includes(item));
  const campaignName = argsList[3];

  if (!campaignName || typeof campaignName !== "string") {
    const actionMessage =
      action === GroupFundsAction.ADD ? "add funds to" : "remove funds from";
    message.reply(`I can't tell which campaign you want to ${actionMessage}`);
    return { success: false };
  }

  const existingCampaign = await dbClient.discord.campaign.getCampaignByName(
    campaignName
  );

  if (!existingCampaign) {
    message.reply(`I couldn't find a campaign by the name ${campaignName}.`);
    return { success: false };
  }

  const isRequesterAllowedCommand = existingCampaign.adminIDs
    .concat(GroupFundsAction.ADD ? [] : existingCampaign.memberIDs)
    .includes(requesterID);

  if (!isRequesterAllowedCommand) {
    message.reply(
      `Sorry, ${message.author.username}, you can't use that command.`
    );
    return { success: false };
  }

  const amount = args[FUNDS_AMOUNT_FLAG] as string;
  const isAmountValid =
    amount && (typeof amount === "string" || typeof amount === "number");

  if (!isAmountValid) {
    message.reply(
      "Please specify a valid amount, with --amount number in your request"
    );
    return { success: false };
  }

  return { success: true, existingCampaign, amount };
}

async function modifyCampaignGroupFunds(
  message: Message,
  campaign: ICampaign,
  action: GroupFundsAction,
  amount: number | string
): Promise<void> {
  const parsedAmount = parseInt(amount as string);
  const currentAmount = campaign.groupFunds || 0;

  const modifiedAmount =
    action === GroupFundsAction.ADD ? parsedAmount : -parsedAmount;

  campaign.groupFunds = currentAmount + modifiedAmount;
  await dbClient.discord.campaign.saveCampaign(campaign);

  const funds = campaign.groupFunds;

  message.reply(
    `${parsedAmount} successfully ${
      action === GroupFundsAction.ADD ? "added" : "removed"
    }. You now have ${funds} ${pluralize(campaign.currency, funds)}`
  );
}
