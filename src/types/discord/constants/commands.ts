export enum BotCommand {
  Assign = "assign",
  Campaign = "campaign",
}
// Sam = "sam",
// Log = "log",

/**
 * Campaigns follow their own permissions, where some actions are only allowed to specific roles
 * within the campaign. Campaigns are divided into two roles: player and admin
 */
export enum CampaignCommand {
  // Follows normal permissions rules
  Create = "create",
  // Admin or player, or normal permissions rules
  GetGroupFunds = "viewgroupfunds",
  // Admin only
  AddMember = "addplayer",
  // Admin only
  AddGroupFunds = "addgroupfunds",
  // Admin or player
  SpendGroupFunds = "spendgroupfunds",
}
// Admin only
// Delete = "delete",
// Admin only
// AddAdmin = "addadmin",

export const HELP_FLAG = "help";
