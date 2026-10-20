import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.RESTCOUNTRIES_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ message: "Missing RESTCOUNTRIES_API_KEY" }, { status: 500 });
    }

    const response = await fetch("https://api.restcountries.com/countries/v5/codes.alpha_2", {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
        return NextResponse.json({ message: "Failed to fetch countries" }, { status: response.status });
    }

    const json = await response.json();
    return NextResponse.json(json.data ?? json);
}