import {
  BotCommand,
  CampaignCommand,
} from "../../types/discord/constants/commands";

/**
 * Returns whether a command is a valid command
 * @param command potential value to check if is a valid command
 * @returns whether or not command is valid
 */
export const isValidCommand = (command: string): boolean => {
  return Object.values(BotCommand).includes(command as BotCommand);
};

/**
 * Returns whether a subcommand is potentially valid or not (this is not as exact of a check
 * because there are potentially multiple tiers of commands/subcommands, but the value has to at
 * least exist before we try to handle it)
 * @returns whether or not the subcommand is valid
 */
export const isValidSubCommand = (subcommand: string): boolean => {
  const command = Object.values(BotCommand).find((item) =>
    subcommand.includes(item)
  );
  const sub = Object.values(CampaignCommand).find((item) =>
    subcommand.includes(item)
  );

  return Boolean(command && sub);
};
