export enum LogType {
  info = "VIVY-INFO",
  error = "VIVY-ERROR",
}

export enum LogTag {
  DB = "VIVY-DB",
}

export function createLog(
  type: LogType,
  message: string,
  tags?: Array<LogTag>
): void {
  console.log(
    `[${type}]${(tags || [])
      .map((tag) => "[" + tag + "]")
      .join("")}: ${message}`
  );
}
