import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT() {

    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401});
        }
        const userId = session.user.id;

        const [user] = await db
            .update(usersTable)
            .set({
                hasProfile: true
            })
            .where(eq(usersTable.displayId, userId))
            .returning();

        console.log(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}
