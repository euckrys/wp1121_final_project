import { type NextRequest,NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { profileInfoTable, usersTable } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = new URL(request.url);
        const sportType = url.searchParams.get("sportType");
        const targetCoachString = url.searchParams.get("targetCoach");
        // console.log(!targetCoachString)
        // console.log(url)
        const coaches = await db.query.profileInfoTable.findMany({
            where: and(
                eq(profileInfoTable.isCoach, true),
                like(profileInfoTable.displayName, targetCoachString ? `%${targetCoachString}%` : "%%"),
                like(profileInfoTable.sportType, sportType ? `%${sportType}%` : "%%"),
                ),
            columns: {
                id: false,
            }
    });
    // console.log("coaches: " ,coaches)

        return NextResponse.json({ coaches }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

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

        // console.log(user);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}
