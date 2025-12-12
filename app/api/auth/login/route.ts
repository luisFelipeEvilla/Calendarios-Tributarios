import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const url = `${process.env.API_URL}/login/empleado`;

  const body = { username, password };

  try {
    const response = await axios.post(url, body);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
