import { index, pgTable, serial, uuid, varchar, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
    displayIdIndex: index("display_id_index").on(table.displayId),
    isCoachIndex: index("is_coach_index").on(table.isCoach),
    emailIndex: index("email_index").on(table.email)
  }),
);

export const profileInfoTable = pgTable(
  "profile_info",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    isCoach: boolean("isCoach"),
    displayName: varchar("display_name"),
    // avatarUrl: varchar("avatar_url").notNull().references(() => usersTable.avatarUrl, { onDelete: "cascade", onUpdate: "cascade" }),
    sportType: varchar("sport_type"),
    age: varchar("age"),
    height: varchar("height"),
    weight: varchar("weight"),
    place: varchar("place"),
    license: varchar("license"),
    availableTime: boolean("availableTime").array(70),
    appointment: varchar("appointment").array(35),
  },
  (table) => ({
    userIdIndex: index("display_id_index").on(table.userId),
    displayNameIndex: index("display_name_index").on(table.displayName),
    sportTypeIndex: index("sport_type_index").on(table.sportType),
  })
)

export const postsTable = pgTable(
  "posts_table",
  {
    id: serial("id").primaryKey(),
    postId: uuid("post_id").defaultRandom().notNull().unique(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    author: varchar("author").notNull(),
    authorIsCoach: boolean("author_is_coach").notNull(),
    sportType: varchar("sport_type").notNull(),
    description: varchar("description").notNull(),
    updatedAt: timestamp("update_at").default(sql`now()`).notNull(),
  },
  (table) => ({
    postIdIndex: index("post_id_index").on(table.postId),
    authorIndex: index("author_index").on(table.author),
    sportTypeIndex: index("sport_type_index").on(table.sportType),
    updatedAtIndex: index("update_at_index").on(table.updatedAt),
    uniqCombination: unique().on(table.postId, table.authorId),
  })
)

export const repliesTable = pgTable(
  "replies_table",
  {
    id: serial("id").primaryKey(),
    toPostId: uuid("to_post_id")
      .notNull()
      .references(() => postsTable.postId, { onDelete: "cascade", onUpdate: "cascade"}),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    author: varchar("author").notNull(),
    content: varchar("content").notNull(),
    createdAt: timestamp("create_at").default(sql`now()`).notNull(),
  },
  (table) => ({
    toPostIdIndex: index("to_post_id_index").on(table.toPostId),
    authorIndex: index("author_index").on(table.author),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  })
)

export const userRelations = relations(usersTable, ({ one, many }) => ({
  profileInfo: one(profileInfoTable, {
    fields: [usersTable.displayId],
    references: [profileInfoTable.userId],
  }),
  posts: many(postsTable),
  replies: many(repliesTable),
}))

export const postRelations = relations(postsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [postsTable.authorId],
    references: [usersTable.displayId],
  }),
  replies: many(repliesTable),
}))

export const repliesRelations = relations(repliesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [repliesTable.authorId],
    references: [usersTable.displayId],
  }),
  post: one(postsTable, {
    fields: [repliesTable.toPostId],
    references: [postsTable.postId],
  })
}))