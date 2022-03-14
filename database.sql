-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "about" TEXT,
    "img" TEXT,
    "access_level" INT NOT NULL DEFAULT 0
);

CREATE TABLE "race" (
  "id" SERIAL PRIMARY KEY,
  "time" TIMESTAMPTZ,
  "winner_id" INT REFERENCES "user"
);

CREATE TABLE "users_races" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user",
	"race_id" INT REFERENCES "race",
	"finish_time" FLOAT
);