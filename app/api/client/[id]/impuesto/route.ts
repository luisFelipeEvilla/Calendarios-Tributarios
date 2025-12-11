import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/cliente/${id}/impuesto`;
    const response = await axios.post(url, body);

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
