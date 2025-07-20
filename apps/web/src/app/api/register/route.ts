// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: NextRequest) {
	const { email, password, display_name } = await req.json();

	const response = await fetch(`${API_BASE_URL}/api/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, display_name }),
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Register error" }, { status: 400 });
	}

	const data = await response.json();

	const nextResponse = NextResponse.json({ success: true, user: data.user });
	nextResponse.cookies.set("authToken", data.token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7,
	});

	return nextResponse;
}
