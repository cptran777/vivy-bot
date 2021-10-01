-- Special arguments stored for a specific special command, like lighting the fires of gondor.
-- The targets are just stored as text, in a JSON format with whatever schema suits the feature
-- best. We don't need too much type structure here yet, so just going to leave it relatively
-- freeform for now.

CREATE TABLE special_command_targets(
  ID SERIAL PRIMARY KEY,
  server_id TEXT NOT NULL,
  command_key TEXT NOT NULL,
  targets TEXT NOT NULL
);
