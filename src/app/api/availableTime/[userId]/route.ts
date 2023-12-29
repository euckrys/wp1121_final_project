import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { profileInfoTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import type { z } from "zod";

import { availableTimeSchema } from "@/validators/profileInfo";

type AvailableTimeRequest = z.infer<typeof availableTimeSchema>;

export async function GET(req: NextRequest,
    {
      params,
    }: {
      params: {
        userId: string;
      };
    },) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401});
        }

        const [availableTime] = await db
            .select({
                availableTime: profileInfoTable.availableTime,
                appointment: profileInfoTable.appointment,
            })
            .from(profileInfoTable)
            .where(eq(profileInfoTable.userId, params.userId))
            .execute();

        return NextResponse.json({ availableTime }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: NextRequest,
    {
      params,
    }: {
      params: {
        userId: string;
      };
    },) {
    const data = await request.json();

    try {
        availableTimeSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { availableTime, appointment } = data as AvailableTimeRequest;

    try {
        const [result] = await db
            .update(profileInfoTable)
            .set({
                availableTime,
                appointment,
            })
            .where(eq(profileInfoTable.userId, params.userId))
            .returning();

        console.log(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}