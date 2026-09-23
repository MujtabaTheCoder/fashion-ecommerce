import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "Auth callback is not implemented yet." },
    { status: 501 },
  );
}
