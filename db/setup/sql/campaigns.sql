CREATE TABLE campaigns(
  name varchar(50) PRIMARY KEY,
  owner_id TEXT NOT NULL,
  admin_ids TEXT NOT NULL,
  member_ids TEXT,
  characters TEXT,
  character_ownership TEXT,
  currency TEXT DEFAULT 'gold',
  money TEXT,
  group_funds INT
);
