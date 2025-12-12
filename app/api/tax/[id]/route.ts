import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const url = `${process.env.API_URL}/impuesto/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(false, { status: 404 });
    }

    const impuesto = await response.json();
    return NextResponse.json(impuesto);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching impuesto" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/impuesto/${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(false, { status: 404 });
    }

    const impuestoActualizado = await response.json();
    return NextResponse.json(impuestoActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating impuesto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const url = `${process.env.API_URL}/impuesto/${id}`;
    const response = await fetch(url, { method: "DELETE" });

    if (!response.ok) {
      return NextResponse.json(false, { status: 404 });
    }

    const deleted = await response.json();
    return NextResponse.json(deleted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting impuesto" }, { status: 500 });
  }
}