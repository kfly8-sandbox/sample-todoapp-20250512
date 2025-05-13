CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"done" boolean NOT NULL
);
