CREATE TABLE server_members(
  ID SERIAL PRIMARY KEY,
  server_id TEXT NOT NULL,
  member_ids TEXT NOT NULL
);
