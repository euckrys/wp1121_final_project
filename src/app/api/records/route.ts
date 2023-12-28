import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import type { z } from "zod";

import { db } from "@/db";
import { chartsTable,  recordsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { recordSchema } from "@/validators/records";

type RecordRequest = z.infer<typeof recordSchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        recordSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { toChartId, month, date, sportType, time, description, totalTime } = data as RecordRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";

        await db.transaction(async (tx) => {
            const result = await tx
                .insert(recordsTable)
                .values({
                    toChartId,
                    ownerId: userId,
                    month,
                    date,
                    sportType,
                    time,
                    description,
                })
                .execute();

            await tx
                .update(chartsTable)
                .set({
                    totalTime,
                })
                .where(eq(chartsTable.chartId, toChartId))
                .execute()

            console.log(result);
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}