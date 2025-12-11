import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vigencia = searchParams.get("vigencia");

    const url = `${process.env.API_URL}/impuesto?vigencia=${vigencia}`;

    console.log(url);

    const response = await fetch(url);
    const impuestos = await response.json();

    return NextResponse.json(impuestos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching impuestos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/impuesto`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating impuesto" }, { status: 500 });
  }
}