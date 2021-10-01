import { Message } from "discord.js";
import { COMMAND_PREFIX } from "./constants";
import { getRandomLOTRQuote, lightTheFiresOfGonder } from "./sam";
import yargs = require("yargs-parser");
import { mainHelpMessage } from "./help/main-help-message";
import { handleAssignCommand } from "./assign";
import { logMessage } from "./log";
import { handleCampaignCommand } from "./campaign";
import { BotCommand, HELP_FLAG } from "../../types/discord/constants/commands";
import { mentionUser } from "../utils/user";

// NOTE: For now we're using everything imported from separate modules here, but in the future we
// will probably migrate everything that's not this router to AWS lambda functions

/**
 * Main handler for handling incoming messages, with a high level check then a router to specified
 * lower level handlers for specific commands, if one has been given
 * @param message - triggering message
 */
export function discordMessageCommandHandler(message: Message): void {
  if (message.author.bot) return;
  if (!message.content.startsWith(COMMAND_PREFIX)) return;

  const commandBody = message.content.slice(COMMAND_PREFIX.length);
  // Avoids wasting yargs parsing if the message invocation is not for vivy in the first place
  // Using this simpler method helps us quickly recognize that, even if it's a little redundant
  // Should also reduce potential causes for error
  const args = commandBody.split(" ");
  const invocation = args.shift()?.toLowerCase();

  if (invocation !== "vivy") return;

  try {
    const args = yargs(commandBody);

    console.log("[ARGS]");
    console.log(args);
    // Accommodates already having checked the vivy invocation
    args._.shift()?.toLowerCase();

    if (args._.includes(`"light the fires of gondor"`)) {
      lightTheFiresOfGonder(message);
      return;
    }

    const command = args._[0]?.toLowerCase();

    // Expected: !vivy --help
    if (!command && args[HELP_FLAG]) {
      mainHelpMessage(message);
      return;
    }

    switch (command) {
      case BotCommand.Sam:
        getRandomLOTRQuote(message);
        break;
      case BotCommand.Assign:
        handleAssignCommand(args, message);
        break;
      case BotCommand.Log:
        logMessage(args, message);
        break;
      case BotCommand.Campaign:
        handleCampaignCommand(args, message);
        break;
      default:
        message.reply(
          `Sorry, ${mentionUser(
            message.author.id
          )}, I don't recognize that command.`
        );
    }

    return;
  } catch (error) {
    console.log(error);
    message.reply("I just want to make everyone happy with my singing...");
    return;
  }
}
