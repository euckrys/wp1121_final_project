import { index, pgTable, serial, uuid, varchar, boolean, timestamp, unique, integer, real} from "drizzle-orm/pg-core";
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
    avatarUrl: varchar("avatar_url").notNull(),
    sportType: varchar("sport_type"),
    age: varchar("age"),
    height: varchar("height"),
    weight: varchar("weight"),
    place: varchar("place"),
    license: varchar("license"),
    introduce: varchar("introduce"),
    availableTime: boolean("availableTime").array(70),
    appointment: varchar("appointment").array(35),
    totalStar: real("totalStar").default(0),
    totalReview: real("totalReview").default(0),
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
    expectedTime: varchar("expected_time").array(6),
    description: varchar("description").notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  },
  (table) => ({
    postIdIndex: index("post_id_index").on(table.postId),
    authorIdIndex: index("author_id_index").on(table.authorId),
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
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  },
  (table) => ({
    toPostIdIndex: index("to_post_id_index").on(table.toPostId),
    authorIdIndex: index("author_id_index").on(table.authorId),
    authorIndex: index("author_index").on(table.author),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  })
)

export const reviewsTable = pgTable(
  "reviews_table",
  {
    id: serial("id").primaryKey(),
    toCoachId: uuid("to_coach_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade"}),
    authorId: uuid("author_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    author: varchar("author").notNull(),
    isAnonymous: boolean("is_anonymous").notNull(),
    star: real("star").notNull(),
    content: varchar("content").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  },
  (table) => ({
    toCoachIdIndex: index("to_post_id_index").on(table.toCoachId),
    authorIdIndex: index("author_id").on(table.authorId),
    authorIndex: index("author_index").on(table.author),
    starIndex: index("star_index").on(table.star),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  })
)

export const chartsTable = pgTable(
  "charts_table",
  {
    id: serial("id").primaryKey(),
    chartId: uuid("chart_id").defaultRandom().notNull().unique(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    month: integer("month").notNull(),
    totalTime: integer("total_time").array(31),
  },
  (table) => ({
    ownerIdIndex: index("owner_id_index").on(table.ownerId),
    monthIndex: index("month_index").on(table.month),
    totalTimeIndex: index("total_time_index").on(table.totalTime),
    uniqCombination: unique().on(table.ownerId, table.month),
  })
)

export const recordsTable = pgTable(
  "records_table",
  {
    id: serial("id").primaryKey(),
    toChartId: uuid("to_chart_id")
      .notNull()
      .references(() => chartsTable.chartId, { onDelete: "cascade", onUpdate: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => usersTable.displayId, { onDelete: "cascade", onUpdate: "cascade" }),
    month: integer("month").notNull(),
    date: integer("date").notNull(),
    sportType: varchar("sport_type").notNull(),
    time: varchar("time").notNull(),
    description: varchar("description").notNull(),
  },
  (table) => ({
    ownerIdIndex: index("owner_id_index").on(table.ownerId),
    monthIndex: index("month_index").on(table.month),
    dateIndex: index("date_index").on(table.date),
    timeIAndex: index("time_index").on(table.time),
  })
)

export const userRelations = relations(usersTable, ({ one, many }) => ({
  profileInfo: one(profileInfoTable, {
    fields: [usersTable.displayId],
    references: [profileInfoTable.userId],
  }),
  posts: many(postsTable),
  replies: many(repliesTable),
  reviews: many(reviewsTable),
  receivedReviews: many(reviewsTable),
  charts: many(chartsTable),
  records: many(recordsTable),
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

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  // author: one(usersTable, {
  //   fields: [reviewsTable.authorId],
  //   references: [usersTable.displayId]
  // }),
  coach: one(usersTable, {
    fields: [reviewsTable.toCoachId],
    references: [usersTable.displayId]
  })
}))


export const chartsRelations = relations(chartsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [chartsTable.ownerId],
    references: [usersTable.displayId],
  }),
  records: many(recordsTable),
}))

export const recordsRelations = relations(recordsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [recordsTable.ownerId],
    references: [usersTable.displayId],
  }),
  chart: one(chartsTable, {
    fields: [recordsTable.toChartId],
    references: [chartsTable.chartId],
  })
}))