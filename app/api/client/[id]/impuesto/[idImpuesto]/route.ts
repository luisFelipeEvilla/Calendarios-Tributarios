import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string; idImpuesto: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id, idImpuesto } = await params;

  try {
    const url = `${process.env.API_URL}/cliente/${id}/impuesto/${idImpuesto}`;
    const response = await axios.delete(url);

    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
