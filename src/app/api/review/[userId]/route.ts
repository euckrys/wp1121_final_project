import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { z } from "zod";
import { db } from "@/db";
import { reviewsTable, profileInfoTable } from "@/db/schema";
import { reviewPostSchema } from "@/validators/review";
import { eq } from "drizzle-orm"

type PostRequest = z.infer<typeof reviewPostSchema>

export async function GET(
    request: NextRequest,
    {
        params,
    }: {
        params: {
            userId: string;
        }
    }
) {
    try {
        const session = await auth();
        if (!session || !session?.user?.id || !session?.user?.username) {
            return NextResponse.json({ error: "Unathorized" }, { status: 401 });
        }

        const review = await db.query.usersTable.findFirst({
            where: (usersTable, { eq }) => eq(usersTable.displayId, params.userId),
            columns: {
                id: false,
                displayId: false,
                isCoach: false,
                username: false,
                email: false,
                avatarUrl: false,
                hashedPassword: false,
                provider: false,
                hasProfile: false,
            },
            with: {
                reviews: {
                    columns: {
                        authorId: true,
                        author: true,
                        isAnonymous: true,
                        content: true,
                        star: true,
                        createdAt: true,
                    },
                    orderBy: (repliesTable, { desc }) => [desc(repliesTable.createdAt)],
                }
            }
        })

        const user = await db.query.profileInfoTable.findFirst({
            where: (profileInfoTable, { eq }) => eq(profileInfoTable.userId, params.userId),
            columns: {
                totalStar: true,
                totalReview: true,
            }
        });
        const newTotalStar = (user?.totalStar === null || user?.totalStar === undefined) ? -1 : (user.totalStar);   
        const newTotalReview = (user?.totalReview === null || user?.totalReview === undefined) ? -1 : (user.totalReview);   
 
        // console.log(review)

        return NextResponse.json({ review, newTotalStar, newTotalReview }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}

export async function POST(
    request: NextRequest,
    {
        params,
    }: {
        params: {
            userId: string;
        }
    }) {
    const data = await request.json();
    console.log(data)
    try {
        reviewPostSchema.parse(data);
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { authorId, author, isAnonymous, star, content } = data as PostRequest;

    try {
        const result = await db
            .insert(reviewsTable)
            .values({
                toCoachId: params.userId,
                authorId,
                author,
                isAnonymous,
                star,
                content,
            })
            .execute();

        console.log("reviewResult:", result);

        const user = await db.query.profileInfoTable.findFirst({
            where: (profileInfoTable, { eq }) => eq(profileInfoTable.userId, params.userId),
            columns: {
                totalStar: true,
                totalReview: true,
            }
        });

        const newTotalStar = (user?.totalStar === null || user?.totalStar === undefined) ? -1 : (user.totalStar + star);   
        const newTotalReview = (user?.totalReview === null || user?.totalReview === undefined) ? -1 : (user.totalReview + 1);   
        const [reviewResult] = await db
            .update(profileInfoTable)
            .set({
                totalStar: newTotalStar,
                totalReview: newTotalReview,
            })
            .where(eq(profileInfoTable.userId, params.userId))
            .returning();

        console.log(reviewResult);

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }

    return new NextResponse("OK", { status: 200 });
}