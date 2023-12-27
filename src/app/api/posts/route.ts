import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { db } from "@/db";
import { postsTable } from "@/db/schema";
// import { eq } from "drizzle-orm";

import { postSchema } from "@/validators/posts"
// import { and, eq } from "drizzle-orm";

type PostRequest = Zod.infer<typeof postSchema>

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const sportType = url.searchParams.get("sportType");
        const isMine = url.searchParams.get("isMine");
        const isCoachString = url.searchParams.get("isCoach");

        const isCoach = isCoachString?.toLowerCase() == "true" ? true : false;
        console.log(isCoach);

        const userId = isMine ? `${session.user.id}` : `%%`;

        const posts = await db.query.postsTable.findMany({
            where: (postsTable, { and, like, eq, ne }) => {
                return and(
                    like(postsTable.sportType, sportType? `%${sportType}%` : "%%"),
                    isMine ? eq(postsTable.authorId, userId) : ne(postsTable.authorId, userId),
                    eq(postsTable.authorIsCoach, isCoach),
                )
            },
            orderBy: (postsTable, { desc }) => [desc(postsTable.updatedAt)],
            with: {
                replies: {
                    columns: {
                        author: true,
                        content: true,
                    },
                    orderBy: (repliesTable, { desc }) => [desc(repliesTable.createdAt)],
                }
            }
        });

        console.log("hi", posts);

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const data = await request.json();

    try {
        postSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { author, sportType, description } = data as PostRequest;

    try {
        const session = await auth();
        const userId = session?.user?.id ? session.user.id : "";
        const isCoach = session?.user ? session.user.isCoach : false;

        const result = await db
            .insert(postsTable)
            .values({
                authorId: userId,
                author,
                authorIsCoach: isCoach,
                sportType,
                description,
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