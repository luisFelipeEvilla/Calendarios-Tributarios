import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/municipio`;
    const response = await fetch(url);
    const municipalities = await response.json();

    return NextResponse.json(municipalities);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching municipios" }, { status: 500 });
  }
}