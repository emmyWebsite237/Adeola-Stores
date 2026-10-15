-- OPTIONAL. The API creates and upgrades these tables itself on first use,
-- so you do not have to run this. Kept as a reference of the final shape.
CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  name              TEXT        NOT NULL,
  email             TEXT        NOT NULL UNIQUE,
  phone             TEXT,
  password_hash     TEXT        NOT NULL,
  verified          BOOLEAN     NOT NULL DEFAULT FALSE,
  token             TEXT,                 -- hash of the confirmation link token
  token_expires_at  TIMESTAMPTZ,          -- 60 minutes after sign-up; unconfirmed rows are deleted after this
  reset_token       TEXT,
  reset_expires_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings saved from Admin -> Integrations. The API creates this table
-- automatically on first use, so running this part is optional.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
