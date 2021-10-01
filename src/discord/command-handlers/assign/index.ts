import { Message } from "discord.js";
import {
  BotCommand,
  HELP_FLAG,
} from "../../../types/discord/constants/commands";
import { Arguments } from "yargs";
import { assignCommandHelpMessage } from "./help";
import { SHOULD_REMOVE_COMMAND_FLAG } from "./constants";
import { dbClient } from "../../../database/clients";
import {
  handleSubCommandAssignment,
  handleSubCommandRemoval,
} from "./subcommands";

// To ensure that we do not mistype process.env variables, which are essentially "any" keys
const PROCESS_ENV = process.env as EnvironmentVariables;

/**
 * Handles commands in the format !vivy assign @User commandName
 * @param args - _: ["assign", <mentioned user>, assignedCommand], remove: boolean
 * @param message - message object from Discord
 *  https://discord.js.org/#/docs/main/stable/class/Message
 */
export async function handleAssignCommand(
  args: Arguments,
  message: Message
): Promise<void> {
  // This makes sense for now since this is a personal bot, but maybe it'd be worth keeping this in
  // a DB in the future
  if (message.author.id !== PROCESS_ENV.ADMIN_ID) {
    message.reply("Only my admin can assign commands");
    return;
  }

  const argsList = args._;
  // argsList[0] === "assign", argsList[1] === @mentioned UserID
  const command = argsList[2] as BotCommand;

  if (!command && args[HELP_FLAG]) {
    assignCommandHelpMessage(message);
    return;
  }

  const assignTarget = message.mentions.users.first();

  if (!assignTarget) {
    message.reply("I didn't recognize who you wanted to assign");
    return;
  }

  const assignableCommands = Object.values(BotCommand).filter(
    (item) => item !== BotCommand.Assign
  );

  if (!assignableCommands.includes(command)) {
    message.reply(
      `I don't recognize the command you want to assign to ${assignTarget.username}`
    );
    return;
  }

  // Example usage: !vivy assign @Charlie sam --remove
  const shouldRemoveAssignment = Boolean(args[SHOULD_REMOVE_COMMAND_FLAG]);
  const subCommands =
    typeof argsList[3] === "string" ? argsList[3].split(",") : [];

  // Turns the subcommands into a format that is read by the DB
  const compoundCommands = subCommands.map((item) =>
    `${command}#${item}`.toLowerCase()
  );

  try {
    if (shouldRemoveAssignment) {
      await dbClient.discord.assign.removeAssignedCommand(
        assignTarget.id,
        command
      );
      await handleSubCommandRemoval(message, assignTarget.id, compoundCommands);
      message.reply(
        `${assignTarget.username} can no longer user the command ${command}`
      );
    } else {
      await dbClient.discord.assign.assignCommand(assignTarget.id, command);
      await handleSubCommandAssignment(
        message,
        assignTarget.id,
        compoundCommands
      );
      message.reply(
        `${assignTarget.username} can now use the command ${command}`
      );
    }
  } catch (error) {
    console.log(error);
    message.reply("I just wanted to make everyone happy with my singing...");
  }
}
