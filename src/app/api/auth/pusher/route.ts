import { type NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";

import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email || !session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.formData();
        const socketId = data.get("socket_id") as string;
        const channel = data.get("channel_name") as string

        const docId = channel.slice(8);
        if (!docId) {
            return NextResponse.json(
                { error: "Invalid channel name" }, { status: 400 },
            );
        }

        const userData = {
            user_id: session.user.id,
        };

        const authResponse = pusherServer.authorizeChannel(
            socketId,
            channel,
            userData,
        );

        return NextResponse.json(authResponse);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error"}, { status: 500 }
        );
    }
}