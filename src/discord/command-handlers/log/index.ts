import { Message } from "discord.js";
import { Arguments } from "yargs";
import { createLog, LogType } from "../../../database/utils/logger";

/**
 * Logs a specific message property from the server by command, useful for debugging purposes
 * @param args - arguments that were parsed
 * @param message - message that triggered the log
 */
export async function logMessage(
  args: Arguments,
  message: Message
): Promise<void> {
  createLog(LogType.info, "Logger discord command used");
  console.log(args);
  message.reply("Logged");
}
