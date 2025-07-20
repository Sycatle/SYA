import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	// Appel direct à ton backend Rust
	const response = await fetch(`${API_BASE_URL}/api/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const data = await response.json();

	// Pose le cookie SERVER-SIDE pour Next.js SSR et pour le client !
	const nextResponse = NextResponse.json({ success: true, user: data.user });
	nextResponse.cookies.set("authToken", data.token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 7 jours
	});

	return nextResponse;
}
