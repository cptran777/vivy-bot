import { Message } from "discord.js";
import { Arguments } from "yargs";
import { handleCampaignCreateCommand } from "./create";
import { handleCampaignAddMemberCommand } from "./add-member";
import {
  handleCampaignAddGroupFundsCommand,
  handleCampaignRemoveGroupFundsCommand,
} from "./modify-funds";
import { handleGetGroupFundsCommand } from "./get-info";
import { CampaignCommand } from "../../../types/discord/constants/commands";

export async function handleCampaignCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  // Expected: ["campaign", "create"]
  const argsList = args._;

  const subCommand = argsList[1];

  switch (subCommand) {
    case CampaignCommand.Create:
      handleCampaignCreateCommand(args, message);
      break;
    case CampaignCommand.AddMember:
      handleCampaignAddMemberCommand(args, message);
      break;
    case CampaignCommand.AddGroupFunds:
      handleCampaignAddGroupFundsCommand(args, message);
      break;
    case CampaignCommand.SpendGroupFunds:
      handleCampaignRemoveGroupFundsCommand(args, message);
      break;
    case CampaignCommand.GetGroupFunds:
      handleGetGroupFundsCommand(args, message);
      break;
    default:
      message.reply(
        "Sorry, I don't know what you want me to do with that campaign"
      );
  }
}
