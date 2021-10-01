import { Message } from "discord.js";

export function assignCommandHelpMessage(message: Message): void {
  message.reply(
    "Usage: !vivy assign [@User] [commandName] [subcommands] [--options]\n" +
      "\n" +
      "Note: [subcommands] should be commands separated by commas with no spaces.\n" +
      "Example: !vivy assign @Matthew campaign create,delete\n" +
      "\n" +
      "Options:\n" +
      "  --remove        - will unassign the listed commands instead"
  );
}
