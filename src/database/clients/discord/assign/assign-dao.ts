import { Client } from "pg";
import { createLog, LogTag, LogType } from "src/database/utils/logger";
import { PERMISSIONS_TABLE } from "../../constants";

export class AssignDAO {
  private client: Client;

  /**
   * Creates an entry in the database that assigns a command to a specific user
   * @param userID ID of the user to assign a command
   * @param command command to be assigned to a user
   */
  async assignCommand(userID: string, commandKey: string): Promise<void> {
    createLog(
      LogType.info,
      `Attempting to assign command ${commandKey} for ${userID}`,
      [LogTag.DB]
    );
    const isAssignedAlready = await this.isUserAssignedCommand(
      userID,
      commandKey
    );

    if (isAssignedAlready) {
      createLog(LogType.info, `${userID} was already assigned ${commandKey}`, [
        LogTag.DB,
      ]);
      return;
    }

    await this.client.query(
      `INSERT INTO ${PERMISSIONS_TABLE} (command_key, user_id) VALUES ($1, $2)`,
      [commandKey, userID]
    );

    createLog(
      LogType.info,
      `Successfully added permission ${commandKey} for ${userID}`,
      [LogTag.DB]
    );
  }

  /**
   * Removes an assigned top level command from a user by deleting the db entry
   * @param userID user by ID to remove the command assignment
   * @param command command to be removed from the user
   */
  async removeAssignedCommand(
    userID: string,
    commandKey: string
  ): Promise<void> {
    createLog(
      LogType.info,
      `Attempting to remove command ${commandKey} for user ${userID}`,
      [LogTag.DB]
    );
    await this.client.query(
      `DELETE FROM ${PERMISSIONS_TABLE} where command_key = $1 and user_id = $2`,
      [commandKey, userID]
    );
    createLog(
      LogType.info,
      `Successfully removed permission ${commandKey} for ${userID}`,
      [LogTag.DB]
    );
  }

  /**
   * Determines whether a user by ID is assigned a particular top level command or not
   * @param userID ID of the user to check for command assignment
   * @param command command to check against
   * @returns whether the user is assigned a command
   */
  async isUserAssignedCommand(
    userID: string,
    commandKey: string
  ): Promise<boolean> {
    createLog(
      LogType.info,
      `Attempting to check command ${commandKey} assignment for ${userID}`
    );
    const checkExistingEntryResponse = await this.client.query(
      `SELECT * from ${PERMISSIONS_TABLE} where user_id = $1 and command_key = $2`,
      [userID, commandKey]
    );

    const isAssignedAlready = checkExistingEntryResponse.rows.length !== 0;
    return isAssignedAlready;
  }

  constructor(client: Client) {
    this.client = client;
  }
}
