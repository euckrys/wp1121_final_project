import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: {
            postId: string;
        }
    }
) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unathorized" }, { status: 401 });
        }

        const post = await db.query.postsTable.findFirst({
            where: (postsTable, { eq }) => eq(postsTable.postId, params.postId),
            with: {
                replies: {
                    columns: {
                        author: true,
                        content: true,
                        createdAt: true,
                    },
                    orderBy: (repliesTable, { asc }) => [asc(repliesTable.createdAt)],
                }
            }
        })

        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}