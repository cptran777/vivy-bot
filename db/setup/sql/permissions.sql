-- For discord, permissions for general commands will work as follows:
--   Discord commands follow a tier command#subcommand1#subcommand2 ...etc
--   Higher granularity means more restrictive permissions sets. 
--     Ex: A command: campaign create
--     In the above, there are two possible permissions sets: campaign and campaign#create
--     A user who has permissions for campaign has permissions for campaign#create
--     However, another command: campaign delete
--     A user may have permissions for campaign#create only which means they would not have
--     permissions to delete a campaign

CREATE TABLE permissions(
  ID SERIAL PRIMARY KEY,
  command_key TEXT NOT NULL,
  user_id TEXT NOT NULL
);
