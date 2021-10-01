/**
 * In-code interface for working with table-top campaign objects.
 */
 interface ICampaign {
  /**
   * Name of the campaign, should be unique
   */
  name: string;
  /**
   * User ID of the owner of the campaign (which is the one who created)
   */
  ownerID: string;
  /**
   * People who have the power to affect the campaign items, this is a secondary permissions layer
   * on top of the normal command assignments
   */
  adminIDs: Array<string>;
  /**
   * People who are part of the campaign as members
   */
  memberIDs: Array<string>;
  /**
   * List of characters who are part of the campaign
   */
  characters: Array<string>;
  /**
   * Map of who owns what characters, keyed as memberID => character name
   */
  characterOwnership: Record<string, string>;
  /**
   * Currency unit used in this campaign
   * @default "gold"
   */
  currency: string;
  /**
   * Record of who has what money units, mapped as character name => amount
   */
  money: Record<string, number>;
  groupFunds: number;
}