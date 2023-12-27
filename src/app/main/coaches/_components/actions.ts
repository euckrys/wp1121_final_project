'use server'
import { and, eq, ne, desc } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, profileInfoTable } from "@/db/schema";

export const getCoachs = async () => {
    "use server";
  
    const coachs = await db.query.usersTable.findMany({
      where: eq(usersTable.isCoach, true),
      with: {
        profileInfo:true,
      }
    });
    return coachs;
};
