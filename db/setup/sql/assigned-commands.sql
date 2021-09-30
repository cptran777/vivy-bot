CREATE TABLE assigned_commands(
  ID SERIAL PRIMARY KEY,
  command_name TEXT NOT NULL,
  user_id TEXT NOT NULL
);
