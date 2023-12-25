import { index, pgTable, serial, uuid, varchar, boolean, integer, real } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    isCoach: boolean("isCoach").notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    avatarUrl: varchar("avatar_url").notNull(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials"],
    })
      .notNull()
      .default("credentials"),
    sportType: varchar("sportType"),
    age: varchar("age"),
    height: varchar("height"),
    weight: varchar("weight"),
    place: varchar("place"),
    license: varchar("license"),
  },
  (table) => ({
    displayIdIndex: index("display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);
