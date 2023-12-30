import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { chartsTable, postsTable, profileInfoTable, repliesTable, reviewsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { z } from "zod";

import { profileInfoSchema } from "@/validators/profileInfo";

type ProfileRequest = z.infer<typeof profileInfoSchema>;

const nowYear = new Date().getFullYear();
const nowMonth = new Date().getMonth()+1;

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
                avatarUrl: profileInfoTable.avatarUrl,
                sportType: profileInfoTable.sportType,
                age: profileInfoTable.age,
                height: profileInfoTable.height,
                weight: profileInfoTable.weight,
                place: profileInfoTable.place,
                license: profileInfoTable.license,
                introduce: profileInfoTable.introduce,
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

    const { displayName, sportType, age, height, weight, place, license, introduce, availableTime, appointment} = data as ProfileRequest;


    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";
        const avatarUrl = session?.user?.avartarUrl ? session.user.avartarUrl : "";

        const isCoach = session?.user?.isCoach === undefined ? false: session?.user?.isCoach;
        await db.transaction(async (tx) => {
            const result = await tx
                .insert(profileInfoTable)
                .values({
                    isCoach,
                    userId,
                    displayName,
                    avatarUrl,
                    sportType,
                    age,
                    height,
                    weight,
                    place,
                    license,
                    introduce,
                    availableTime,
                    appointment,
                })
                .execute();

            await tx
                .update(usersTable)
                .set({username: displayName})
                .where(eq(usersTable.displayId, userId))
                .execute();

            for (let i = 0; i < 6; i++) {
                const month = nowMonth - 3 + i;

                let year = nowYear;
                if (month > 12) {
                    year = nowYear + 1
                }
                else if (month < 1) {
                    year = nowYear - 1;
                } else {
                    year = nowYear;
                }

                await tx
                    .insert(chartsTable)
                    .values({
                        ownerId: userId,
                        month,
                        year,
                        totalTime: Array(31).fill(0),
                    })
                    .execute();
            }

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

    const { displayName, avatarUrl, sportType, age, height, weight, place, license, introduce} = data as ProfileRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";

        await db.transaction(async (tx) => {
            const [result] = await tx
                .update(profileInfoTable)
                .set({
                    displayName,
                    avatarUrl,
                    sportType,
                    age,
                    height,
                    weight,
                    place,
                    license,
                    introduce,
                })
                .where(eq(profileInfoTable.userId, userId))
                .returning();

            await tx
            .update(usersTable)
            .set({avatarUrl})
            .where(eq(usersTable.displayId, userId))
            .execute();

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

            await tx
                .update(reviewsTable)
                .set({author: displayName})
                .where(eq(reviewsTable.authorId, userId))
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