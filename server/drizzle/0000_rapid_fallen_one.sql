CREATE TABLE "habit_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"date" date NOT NULL,
	"status" varchar(20) NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "uq_entries_habit_date" UNIQUE("habit_id","date")
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#6366f1',
	"icon" varchar(50),
	"frequency_type" varchar(20) DEFAULT 'daily' NOT NULL,
	"frequency_days" integer[],
	"target_per_week" integer,
	"is_archived" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "habit_entries" ADD CONSTRAINT "habit_entries_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_entries_date" ON "habit_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_entries_habit_status" ON "habit_entries" USING btree ("habit_id","status");--> statement-breakpoint
CREATE INDEX "idx_habits_archived" ON "habits" USING btree ("is_archived");