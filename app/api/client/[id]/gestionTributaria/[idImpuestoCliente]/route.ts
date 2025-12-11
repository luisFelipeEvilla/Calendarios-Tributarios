import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string; idImpuestoCliente: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id, idImpuestoCliente } = await params;

  return NextResponse.json({ id, idImpuestoCliente });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id, idImpuestoCliente } = await params;

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/cliente/${id}/impuesto/${idImpuestoCliente}`;
    const response = await axios.put(url, body);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
