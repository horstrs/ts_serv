CREATE TABLE "chirps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"body" varchar(140) NOT NULL,
	"userId" uuid,
	CONSTRAINT "chirps_body_unique" UNIQUE("body")
);
