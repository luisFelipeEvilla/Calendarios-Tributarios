import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const url = `${process.env.API_URL}/cliente/${id}`;
    const response = await axios.get(url);
    return NextResponse.json(response.data.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const url = `${process.env.API_URL}/cliente/${id}`;
    const response = await axios.put(url, body);
    return NextResponse.json(response.data.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}