import { uuid, integer, text, pgTable, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
});
