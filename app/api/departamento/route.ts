import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/departamento`;
    const response = await fetch(url);
    const departments = await response.json();

    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching departamentos" }, { status: 500 });
  }
}