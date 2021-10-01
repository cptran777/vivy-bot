// Note: Can probably be refactored better
export const USER_MENTION_REGEX = /<@.+>/;
export const USER_MENTION_GLOBAL_REGEX = /<@.+>/g;

/**
 * @param value - value to test against
 * @returns whether the argument value is a user mention based on the string format
 */
export function isUserMention(value: string): boolean {
  return USER_MENTION_REGEX.test(value);
}

export function mentionUser(userID: string): string {
  return `<@${userID}>`;
}

/**
 * Extracts a mentioned user from a string representation 
 * @param mentionString - string to extract a userID from
 */
export function getMentionedUser(mentionString: string): string {
  const userIDMatch = mentionString.match(/[0-9]+/);
  return (userIDMatch && userIDMatch[0]) || "";
}
