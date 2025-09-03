import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

const timestamps = {
  updatedAt: text(),
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  deletedAt: text(),
};

export { timestamps };
