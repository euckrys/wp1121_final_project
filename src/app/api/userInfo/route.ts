import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { postsTable, profileInfoTable, repliesTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { z } from "zod";

import { profileInfoSchema } from "@/validators/profileInfo";

type ProfileRequest = z.infer<typeof profileInfoSchema>;

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [userInfo] = await db
            .select({
                userId: profileInfoTable.userId,
                displayName: profileInfoTable.displayName,
                sportType: profileInfoTable.sportType,
                age: profileInfoTable.age,
                height: profileInfoTable.height,
                weight: profileInfoTable.weight,
                place: profileInfoTable.place,
                license: profileInfoTable.license,
                availableTime: profileInfoTable.availableTime,
                appointment: profileInfoTable.appointment,
            })
            .from(profileInfoTable)
            .where(eq(profileInfoTable.userId, session.user.id))
            .execute();

        return NextResponse.json({ userInfo }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        profileInfoSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { displayName, sportType, age, height, weight, place, license, availableTime, appointment} = data as ProfileRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";
        const isCoach = session?.user?.isCoach === undefined ? false: session?.user?.isCoach;
        await db.transaction(async (tx) => {
            const result = await tx
                .insert(profileInfoTable)
                .values({
                    isCoach,
                    userId,
                    displayName,
                    sportType,
                    age,
                    height,
                    weight,
                    place,
                    license,
                    availableTime,
                    appointment,
                })
                .execute();

            await tx
                .update(usersTable)
                .set({username: displayName})
                .where(eq(usersTable.displayId, userId))
                .execute();

            console.log(result);
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}

export async function PUT(request: NextRequest) {
    const data = await request.json();

    try {
        profileInfoSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { displayName, sportType, age, height, weight, place, license} = data as ProfileRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id? session.user.id : "";

        await db.transaction(async (tx) => {
            const [result] = await tx
                .update(profileInfoTable)
                .set({
                    displayName,
                    sportType,
                    age,
                    height,
                    weight,
                    place,
                    license,
                })
                .where(eq(profileInfoTable.userId, userId))
                .returning();

            await tx
                .update(usersTable)
                .set({username: displayName})
                .where(eq(usersTable.displayId, userId))
                .execute();

            await tx
                .update(postsTable)
                .set({author: displayName})
                .where(eq(postsTable.authorId, userId))
                .execute();

            await tx
                .update(repliesTable)
                .set({author: displayName})
                .where(eq(repliesTable.authorId, userId))
                .execute();

            console.log(result);
        })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}