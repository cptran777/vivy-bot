export enum BotCommand {}
// Assign = "assign",
// Sam = "sam",
// Log = "log",
// Campaign = "campaign",

/**
 * Campaigns follow their own permissions, where some actions are only allowed to specific roles
 * within the campaign. Campaigns are divided into two roles: player and admin
 */
export enum CampaignCommand {}
// Follows normal permissions rules
// Create = "create",
// Admin only
// Delete = "delete",
// Admin only
// AddMember = "addplayer",
// Admin only
// AddAdmin = "addadmin",
// Admin only
// AddGroupFunds = "addgroupfunds",
// Admin or player
// SpendGroupFunds = "spendgroupfunds",
// Admin or player
// GetGroupFunds = "viewgroupfunds",

export const HELP_FLAG = "help";
