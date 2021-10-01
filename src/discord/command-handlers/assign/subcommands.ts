import { Message } from "discord.js";
import { dbClient } from "../../../database/clients";
import { isValidSubCommand } from "../../utils/commands";

export async function handleSubCommandAssignment(
  message: Message,
  userID: string,
  subCommands: Array<string>
): Promise<void> {
  if (subCommands.length === 0) return;

  for (let x = 0; x < subCommands.length; x++) {
    if (!isValidSubCommand(subCommands[x])) {
      message.reply(
        "I don't recognize one of your commands. Your assignment probably didn't work."
      );
      return;
    }
  }

  for (let y = 0; y < subCommands.length; y++) {
    const subCommand = subCommands[y];
    await dbClient.discord.assign.assignCommand(userID, subCommand);
  }
}

export async function handleSubCommandRemoval(
  message: Message,
  userID: string,
  subCommands: Array<string>
): Promise<void> {
  if (subCommands.length === 0) return;

  for (let x = 0; x < subCommands.length; x++) {
    if (!isValidSubCommand(subCommands[x])) {
      message.reply(
        "I don't recognize one of your commands. Your removal probably didn't work."
      );
      return;
    }
  }

  for (let y = 0; y < subCommands.length; y++) {
    const subCommand = subCommands[y];
    await dbClient.discord.assign.removeAssignedCommand(userID, subCommand);
  }
}
