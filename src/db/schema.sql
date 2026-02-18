CREATE TABLE IF NOT EXISTS feature_flags (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  key         TEXT    NOT NULL UNIQUE,
  enabled     INTEGER NOT NULL DEFAULT 0,
  description TEXT
);

CREATE TABLE IF NOT EXISTS overrides (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  flag_key    TEXT    NOT NULL REFERENCES feature_flags(key) ON DELETE CASCADE,
  target_type TEXT    NOT NULL CHECK(target_type IN ('user', 'group')),
  target_id   TEXT    NOT NULL,
  enabled     INTEGER NOT NULL CHECK(enabled IN (0, 1)),
  UNIQUE(flag_key, target_type, target_id)
);
