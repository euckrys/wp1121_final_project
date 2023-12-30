import { NextResponse } from "next/server";

import { db } from "@/db";
import { usersTable, chartsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
export const revalidate = 0
export const GET = async () => {
  try {
    const nowMonth = new Date().getMonth()+1;
    const nowYear = new Date().getFullYear();
    let month = nowMonth+2;
    let year = nowYear;
    if (month > 12) {
        year = nowYear + 1
    }
    else {
        year = nowYear;
    }

    const users = await db.query.usersTable.findMany({
        columns: {
            displayId: true,
        }
    })
    for (const user of users){
        await db
            .insert(chartsTable)
            .values({
                ownerId: user.displayId,
                month,
                year,
                totalTime: Array(31).fill(0),
            })
            .execute();
    }

    await db
         .delete(chartsTable)
         .where(eq(chartsTable.month, month-6));

    console.log("update success")
    return NextResponse.json(
      { message: "Update successfully."},
      { status: 200 },
    );
  } catch (error) {
    console.error("Error update the database:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};