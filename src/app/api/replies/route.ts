import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

import type { z } from "zod";

import { db } from "@/db";
import { postsTable, repliesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { replySchema } from "@/validators/replies";

import Pusher from "pusher";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";

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

        await db.transaction(async (tx) => {
            const [result] = await tx
                .insert(repliesTable)
                .values({
                    toPostId,
                    authorId: userId,
                    author,
                    content,
                })
                .returning();

                await tx
                    .update(postsTable)
                    .set({updatedAt: new Date()})
                    .where(eq(postsTable.postId, toPostId))
                    .execute();

            console.log(result);
        })

        const pusher = new Pusher({
            appId: privateEnv.PUSHER_ID,
            key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
            secret: privateEnv.PUSHER_SECRET,
            cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
            useTLS: true,
        });

        await pusher.trigger(`private-${toPostId}`, "reply:update", {
            senderId: userId,
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