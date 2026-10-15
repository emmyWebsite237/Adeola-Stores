-- Run once in the Neon SQL Editor. Matches api/auth/signup.js and api/auth/verify.js.
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  token         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS users_token_idx ON users (token);
