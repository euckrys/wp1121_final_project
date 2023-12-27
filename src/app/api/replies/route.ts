import { type NextRequest, NextResponse } from "next/server";

import type { z } from "zod";

import { replySchema } from "@/validators/replies";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { repliesTable } from "@/db/schema";

type ReplyRequest = z.infer<typeof replySchema>;

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        replySchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { toPostId, author, content } = data as ReplyRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";

        const result = await db
            .insert(repliesTable)
            .values({
                toPostId,
                authorId: userId,
                author,
                content,
            })
            .execute();

        console.log(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}