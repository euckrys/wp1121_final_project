import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
    try {

        const users = await db.query.usersTable.findMany({
            columns: {
                email: true,
                username: true,
            }
    });
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        );
    }
}