import { Client } from "pg";
import { createLog, LogTag, LogType } from "src/database/utils/logger";
import { CAMPAIGNS_TABLE } from "../../constants";

/**
 * Interface to match a campaign to the actual schema in the database, which we need to translate
 * to typescript
 */
interface IDBSchemaCampaign {
  name: string;
  owner_id: string;
  admin_ids: string;
  member_ids?: string;
  characters?: string;
  character_ownership?: string;
  currency: string;
  money?: string;
  group_funds?: number | string;
}

function convertDatabaseNumber(value: number | string | undefined): number {
  if (!value) return 0;

  return typeof value === "string" ? parseInt(value) : value;
}

export class CampaignDAO {
  private client: Client;

  private dbSchemaToTsCampaign(databaseObject: IDBSchemaCampaign): ICampaign {
    const {
      name,
      owner_id,
      admin_ids,
      member_ids,
      characters,
      character_ownership,
      currency,
      money,
      group_funds,
    } = databaseObject;

    return {
      name,
      ownerID: owner_id,
      adminIDs: admin_ids.split(","),
      memberIDs: (member_ids || "").split(","),
      characters: (characters || "").split(","),
      characterOwnership: JSON.parse(character_ownership || "{}"),
      currency: currency || "gold",
      money: JSON.parse(money || "{}"),
      groupFunds: convertDatabaseNumber(group_funds),
    };
  }

  private tsCampaignToDBSchema(campaignObject: ICampaign): IDBSchemaCampaign {
    const {
      name,
      ownerID,
      adminIDs,
      memberIDs,
      characters,
      characterOwnership,
      currency,
      money,
      groupFunds,
    } = campaignObject;

    return {
      name,
      owner_id: ownerID,
      admin_ids: adminIDs.join(","),
      member_ids: memberIDs.join(","),
      characters: characters.join(","),
      character_ownership: JSON.stringify(characterOwnership),
      currency,
      money: JSON.stringify(money),
      group_funds: groupFunds,
    };
  }

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Gets a campaign by name as a unique identifier
   * @param name - name of the campaign to look for, should be unique
   * @returns a campaign whose properties match the typescript format instead of the raw schema
   */
  async getCampaignByName(name: string): Promise<ICampaign | null> {
    createLog(LogType.info, `Attempting to get campaign ${name} by name`, [
      LogTag.DB,
    ]);
    const getCampaignResponse = await this.client.query(
      `SELECT * FROM ${CAMPAIGNS_TABLE} WHERE name = $1`,
      [name]
    );

    if (getCampaignResponse.rows.length === 0) {
      createLog(LogType.info, `Campaign by name ${name} does not exist`, [
        LogTag.DB,
      ]);
      return null;
    }

    const rawDBCampaign = getCampaignResponse.rows[0];

    try {
      const campaign = this.dbSchemaToTsCampaign(rawDBCampaign);
      return campaign;
    } catch (error) {
      createLog(
        LogType.error,
        `Error converting campaign ${name} to JS object`
      );
      console.log(error);
      return null;
    }
  }

  /**
   * Saves a new or existing campaign object by upserting into the database
   * @param campaign - campaign to save
   */
  async saveCampaign(campaign: ICampaign): Promise<void> {
    const databaseObject = this.tsCampaignToDBSchema(campaign);
    const {
      name,
      owner_id,
      admin_ids,
      member_ids,
      characters,
      character_ownership,
      currency,
      money,
      group_funds,
    } = databaseObject;

    await this.client.query(
      `INSERT INTO ${CAMPAIGNS_TABLE} (name, owner_id, admin_ids, member_ids, characters, character_ownership, currency, money, group_funds)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (name)
      DO
        UPDATE SET name = $1, owner_id = $2, admin_ids = $3, member_ids = $4, characters = $5, character_ownership = $6, currency = $7, money = $8, group_funds = $9
      `,
      [
        name,
        owner_id,
        admin_ids,
        member_ids,
        characters,
        character_ownership,
        currency,
        money,
        group_funds,
      ]
    );
  }
}
