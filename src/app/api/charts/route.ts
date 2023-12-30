import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const charts = await db.query.chartsTable.findMany({
            columns: {
                id: false,
            },
            where: (chartsTable, { eq }) => eq(chartsTable.ownerId, userId),
            orderBy: (chartsTable, { asc }) => [asc(chartsTable.month)],
            with: {
                records: {
                    columns: {
                        id: true,
                        year: true,
                        month: true,
                        date: true,
                        sportType: true,
                        time: true,
                        description: true,
                    },
                }
            }
        });

        return NextResponse.json({ charts }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
}


