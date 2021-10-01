interface IEnvironmentVariables {
  DATABASE_URL: string;
  PORT: number;

  // Discord based environment variables
  BOT_TOKEN: string;
  CLIENT_ID: string;
  SERVER_ID: string;
  ADMIN_ID: string;

  // Octoprint based environment variables
  WEBHOOK_ROUTE: string;
  WEBHOOK_AUTH_KEY: string;
  WEBHOOK_AUTH_TOKEN: string;
}

type EnvironmentVariables = IEnvironmentVariables & NodeJS.ProcessEnv;
