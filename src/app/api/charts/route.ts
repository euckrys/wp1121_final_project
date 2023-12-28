import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import type { z } from "zod";

import { db } from "@/db";
import { chartsTable } from "@/db/schema";

export async function GET(request: NextRequest) {
    
}


