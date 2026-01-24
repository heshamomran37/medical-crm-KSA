import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        verified: true,
        time: new Date().toISOString(),
        folder: "C:/crm medical/medical-app"
    });
}
