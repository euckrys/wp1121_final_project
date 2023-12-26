import { index, pgTable, serial, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
    hasProfile: boolean("has_profile").notNull(),
  },
  (table) => ({
    isCoachIndex: index("is_coach_index").on(table.isCoach),
    emailIndex: index("email_index").on(table.email)
  }),
);

export const userRelations = relations(usersTable, ({ one }) => ({
  profileInfo: one(profileInfoTable),
}))

export const profileInfoTable = pgTable(
  "profile_info",
  {
    id: serial("id").primaryKey(),
    userId: uuid('user_id').
      notNull().
      references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    displayName: varchar("display_name"),
    // avatarUrl: varchar("avatar_url").notNull().references(() => usersTable.avatarUrl, { onDelete: "cascade", onUpdate: "cascade" }),
    sportType: varchar("sport_type"),
    age: varchar("age"),
    height: varchar("height"),
    weight: varchar("weight"),
    place: varchar("place"),
    license: varchar("license"),
  },
  (table) => ({
    userIdIndex: index("display_id_index").on(table.userId),
    sportTypeIndex: index("sport_type_index").on(table.sportType)
  })
)