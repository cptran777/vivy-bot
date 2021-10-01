import { Message } from "discord.js";

export function mainHelpMessage(message: Message): void {
  message.reply(
    "Hello, my name is Vivy and I am here to help!\n" +
      "\n" +
      "Usage: !vivy [command] --[flag] [flag-value]\n" +
      "\n" +
      "Options:\n" +
      `  "light the fires of gondor"    - calls for aid\n` +
      "\n" +
      `Note: Make sure to use double quotes (") when a single command takes multiple words`
  );
}
